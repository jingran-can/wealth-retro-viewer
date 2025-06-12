# 财富回溯查看器 (Wealth Retro Viewer)

一个专业的投资组合收益计算和分析工具，帮助投资顾问和个人投资者分析股票投资组合的历史表现。

## 🚀 功能特色

### 📊 投资组合分析
- **实时股价数据**：集成 Marketstack API，获取真实的股票价格数据
- **历史收益计算**：精确计算从指定日期到现在的投资收益
- **多股票支持**：支持添加多只股票，灵活配置投资比例
- **可视化图表**：直观的收益趋势图和投资组合分布图

### 💼 专业功能
- **客户管理**：为每个投资组合设置客户名称
- **百分比验证**：确保投资比例总和为100%
- **交易日处理**：自动处理非交易日的数据获取
- **错误处理**：详细的错误提示和数据验证

### 🌍 用户体验
- **双语支持**：中英文界面切换
- **响应式设计**：完美适配桌面和移动设备
- **搜索历史**：保存和查看历史查询记录
- **现代UI**：基于 Tailwind CSS 的精美界面

### 🗄️ 历史查询持久化
- **数据库**：后端集成 SQLite + SQLAlchemy，所有投资组合查询历史和个股表现均持久化存储，支持多用户多次查询，数据安全可靠
- **数据库结构**：
  1. `portfolio_history`：每次投资组合查询的主记录（客户名、起始日、初始金额、现值、总收益、时间戳等）
  2. `stock_performance`：每次查询下每只股票的表现（股票代码、分配比例、初始金额、现值、收益、收益率等）
- **主要API接口**：
  - `POST /api/history`  保存一次查询（请求体为 PortfolioPerformance 结构，含所有股票表现）
  - `GET /api/history`    获取所有历史记录（不含个股详情）
  - `GET /api/history/{id}` 获取某次查询的详细个股表现
  - `GET /api/stock/price` 股票价格代理接口

## 🛠 技术栈

- **前端框架**：React 18 + TypeScript
- **后端**：FastAPI + SQLite
- **构建工具**：Vite
- **样式系统**：Tailwind CSS
- **UI组件**：shadcn/ui
- **图表库**：Recharts
- **状态管理**：React Query (@tanstack/react-query)
- **数据源**：Marketstack API

## 📋 使用说明

### 1. 基本信息填写
- **客户姓名**：输入客户或投资者姓名
- **起始日期**：选择投资组合的开始日期（建议选择工作日）
- **初始余额**：输入投资的初始金额（美元）

### 2. 投资组合配置
- **股票代码**：输入正确的股票交易代码（如：AAPL, MSFT, TSLA）
- **投资比例**：设置每只股票的投资百分比
- **比例验证**：确保所有股票的投资比例总和为100%

### 3. 结果分析
- **收益概览**：查看总收益、收益率和各股票表现
- **可视化图表**：分析收益趋势和投资组合分布
- **详细数据**：每只股票的具体收益数据

## 🔗 API 集成

本应用使用 [Marketstack API](https://marketstack.com/) 获取实时和历史股票数据：

- **支持市场**：美股、港股等全球主要股票市场
- **数据类型**：日终价格、历史价格、实时数据
- **更新频率**：实时更新，确保数据准确性

## 🚀 快速开始

### 本地开发

确保您已安装 Node.js 和 npm：

```bash
# 克隆项目
git clone <YOUR_GIT_URL>

# 进入项目目录
cd wealth-retro-viewer

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 在线访问

您可以直接访问在线版本：https://wealth-retro-viewer.lovable.app/

## 📱 支持的股票市场

- **美股**：NASDAQ、NYSE（如：AAPL、MSFT、GOOGL、TSLA）
- **港股**：香港交易所（如：0700.HK、0941.HK）
- **其他市场**：支持 Marketstack API 覆盖的全球市场

## 🔧 环境要求

- Node.js 16+ 
- npm 或 yarn
- 现代浏览器（Chrome、Firefox、Safari、Edge）

## 📄 项目结构

```
backend/                 # 后端服务
│   main.py              # 后端主服务
│   requirements.txt     # 后端依赖
│   .env                 # 后端环境变量
src/                     # 前端源码
├── components/          # React 组件
│   ├── ui/              # 基础 UI 组件
│   ├── PortfolioForm.tsx    # 投资组合表单
│   ├── PortfolioResults.tsx # 结果展示
│   └── PortfolioChart.tsx   # 图表组件
├── services/            # API 服务
│   └── stockApi.ts      # 股票数据 API 封装
├── contexts/            # React Context
├── pages/               # 页面组件
└── lib/                 # 工具函数
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📝 许可证

本项目采用 MIT 许可证。

## 📧 联系方式

如有问题或建议，请通过以下方式联系：18851009553@163.com

---

**注意**：使用本应用前，请确保您有合法的股票交易权限，本应用仅供投资分析参考，不构成投资建议。
