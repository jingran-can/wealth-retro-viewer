import { PortfolioPerformance } from "@/components/PortfolioResults";

// Real API integration with marketstack.com
export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

// 本地开发环境下，前端所有 API 请求都走本地后端
const API_BASE_URL = 'http://127.0.0.1:8000';

const apiFetch = async (path: string, options?: RequestInit): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || errorData.error || `API Error: ${response.status} - ${response.statusText}`;
    throw new Error(errorMessage);
  }
  
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

// Get the most recent trading day before the specified date
const getValidTradingDate = (targetDate: string): string => {
  const date = new Date(targetDate);
  const today = new Date();
  
  // If target date is in the future, use today
  if (date > today) {
    return today.toISOString().split('T')[0];
  }
  
  // Go back up to 7 days to find a trading day
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(date);
    checkDate.setDate(checkDate.getDate() - i);
    
    // Skip weekends (Saturday = 6, Sunday = 0)
    const dayOfWeek = checkDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      return checkDate.toISOString().split('T')[0];
    }
  }
  
  return targetDate; // Fallback to original date
};

export const getCurrentStockPrice = async (symbol: string): Promise<number> => {
  const data = await apiFetch(`/api/stock/price?symbol=${symbol}`);
  if (data.price !== undefined) {
    return parseFloat(data.price);
  }
  throw new Error(`无法获取股票 ${symbol} 的当前价格数据，请检查股票代码是否正确`);
};

export const getHistoricalStockPrice = async (symbol: string, date: string): Promise<number> => {
  const data = await apiFetch(`/api/stock/price?symbol=${symbol}&date=${date}`);
  if (data.price !== undefined) {
    return parseFloat(data.price);
  }
  throw new Error(`无法获取股票 ${symbol} 在 ${date} 附近的历史价格数据，请检查股票代码是否正确`);
};

export const getStockPrice = async (symbol: string, date?: string): Promise<number> => {
  if (date) {
    return getHistoricalStockPrice(symbol, date);
  }
  return getCurrentStockPrice(symbol);
};

// Validate stock symbol
export const validateStockSymbol = async (symbol: string): Promise<boolean> => {
  try {
    await getCurrentStockPrice(symbol);
    return true;
  } catch {
    return false;
  }
};

// --- History API Functions ---

export const getHistoryList = async (): Promise<PortfolioPerformance[]> => {
    return await apiFetch('/api/history');
};

export const getHistoryDetail = async (id: number): Promise<PortfolioPerformance> => {
    return await apiFetch(`/api/history/${id}`);
};

export const saveHistory = async (performance: PortfolioPerformance): Promise<any> => {
    return await apiFetch('/api/history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(performance),
    });
};
