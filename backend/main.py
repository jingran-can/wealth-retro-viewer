import os
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import Body
from dotenv import load_dotenv
import requests
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

load_dotenv()

# 注意：以下是临时硬编码API密钥的方案，仅用于在线演示目的
# 在真实生产环境中，应该使用环境变量或密钥管理系统存储API密钥
# API_KEY = os.getenv("MARKETSTACK_API_KEY")  # 原方式：从.env文件读取
API_KEY = "ddb8cdb6ec1bfeb398cb831732d66fd2"  # 临时硬编码，仅用于演示
BASE_URL = "https://api.marketstack.com/v1"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 数据库设置 ---
DATABASE_URL = "sqlite:///./history.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class PortfolioHistory(Base):
    __tablename__ = "portfolio_history"
    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String)
    start_date = Column(String)
    initial_balance = Column(Float)
    current_value = Column(Float)
    total_return = Column(Float)
    total_return_pct = Column(Float)
    timestamp = Column(String)
    stocks = relationship("StockPerformance", back_populates="history", cascade="all, delete-orphan")

class StockPerformance(Base):
    __tablename__ = "stock_performance"
    id = Column(Integer, primary_key=True, index=True)
    history_id = Column(Integer, ForeignKey("portfolio_history.id"))
    symbol = Column(String)
    allocation = Column(Float)
    initial_value = Column(Float)
    current_value = Column(Float)
    return_value = Column(Float)
    return_pct = Column(Float)
    history = relationship("PortfolioHistory", back_populates="stocks")

Base.metadata.create_all(bind=engine)

# --- Pydantic 模型 ---
class StockPerformanceIn(BaseModel):
    symbol: str
    allocation: float
    initialValue: float
    currentValue: float
    return_: float = Field(alias='return')
    returnPercentage: float
    class Config:
        allow_population_by_field_name = True

class PortfolioPerformanceIn(BaseModel):
    clientName: str
    startDate: str
    initialBalance: float
    currentValue: float
    totalReturn: float
    totalReturnPercentage: float
    stocks: List[StockPerformanceIn]
    timestamp: str

# --- API ---
@app.post("/api/history")
def save_history(perf: PortfolioPerformanceIn):
    db = SessionLocal()
    try:
        history = PortfolioHistory(
            client_name=perf.clientName,
            start_date=perf.startDate,
            initial_balance=perf.initialBalance,
            current_value=perf.currentValue,
            total_return=perf.totalReturn,
            total_return_pct=perf.totalReturnPercentage,
            timestamp=perf.timestamp
        )
        db.add(history)
        db.flush()  # 获取 id
        for s in perf.stocks:
            stock = StockPerformance(
                history_id=history.id,
                symbol=s.symbol,
                allocation=s.allocation,
                initial_value=s.initialValue,
                current_value=s.currentValue,
                return_value=s.return_,
                return_pct=s.returnPercentage
            )
            db.add(stock)
        db.commit()
        return {"success": True, "id": history.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/api/history")
def get_all_history():
    db = SessionLocal()
    try:
        records = db.query(PortfolioHistory).order_by(PortfolioHistory.timestamp.desc()).all()
        result = []
        for h in records:
            result.append({
                "id": h.id,
                "clientName": h.client_name,
                "startDate": h.start_date,
                "initialBalance": h.initial_balance,
                "currentValue": h.current_value,
                "totalReturn": h.total_return,
                "totalReturnPercentage": h.total_return_pct,
                "timestamp": h.timestamp
            })
        return result
    finally:
        db.close()

@app.get("/api/history/{history_id}")
def get_history_detail(history_id: int):
    db = SessionLocal()
    try:
        h = db.query(PortfolioHistory).filter(PortfolioHistory.id == history_id).first()
        if not h:
            raise HTTPException(status_code=404, detail="Not found")
        stocks = db.query(StockPerformance).filter(StockPerformance.history_id == history_id).all()
        return {
            "id": h.id,
            "clientName": h.client_name,
            "startDate": h.start_date,
            "initialBalance": h.initial_balance,
            "currentValue": h.current_value,
            "totalReturn": h.total_return,
            "totalReturnPercentage": h.total_return_pct,
            "timestamp": h.timestamp,
            "stocks": [
                {
                    "symbol": s.symbol,
                    "allocation": s.allocation,
                    "initialValue": s.initial_value,
                    "currentValue": s.current_value,
                    "return": s.return_value,
                    "returnPercentage": s.return_pct
                } for s in stocks
            ]
        }
    finally:
        db.close()

# 保留原有股票价格代理接口
@app.get("/api/stock/price")
def get_stock_price(symbol: str = Query(...), date: str = Query(None)):
    try:
        if date:
            # 查找目标日期前后 5 天，找最近的交易日
            target_date = datetime.strptime(date, "%Y-%m-%d")
            start_date = (target_date - timedelta(days=5)).strftime("%Y-%m-%d")
            end_date = (target_date + timedelta(days=1)).strftime("%Y-%m-%d")
            url = f"{BASE_URL}/eod?access_key={API_KEY}&symbols={symbol}&date_from={start_date}&date_to={end_date}&sort=DESC&limit=10"
        else:
            # 最近 7 天，找最新交易日
            end_date = datetime.now().strftime("%Y-%m-%d")
            start_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
            url = f"{BASE_URL}/eod?access_key={API_KEY}&symbols={symbol}&date_from={start_date}&date_to={end_date}&sort=DESC&limit=5"
        resp = requests.get(url)
        data = resp.json()
        if "data" in data and data["data"]:
            if date:
                # 找到最接近目标日期的价格
                target_time = datetime.strptime(date, "%Y-%m-%d").timestamp()
                closest = min(data["data"], key=lambda x: abs(datetime.strptime(x["date"].split("T")[0], "%Y-%m-%d").timestamp() - target_time))
                return {"price": closest["close"], "date": closest["date"]}
            else:
                latest = data["data"][0]
                return {"price": latest["close"], "date": latest["date"]}
        return JSONResponse(status_code=404, content={"error": "No data found"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)}) 