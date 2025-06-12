
import React, { createContext, useContext, useState } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  zh: {
    title: '投资组合管理系统',
    subtitle: '专业投资组合分析与跟踪平台',
    clientName: '客户姓名',
    startDate: '起始日期',
    initialBalance: '初始余额',
    portfolioAllocation: '投资组合分配',
    stockSymbol: '股票代码',
    percentage: '百分比',
    addStock: '添加股票',
    removeStock: '删除股票',
    calculateReturns: '计算收益',
    portfolioPerformance: '投资组合表现',
    individualStockPerformance: '个股表现',
    overallPortfolioReturn: '整体投资组合收益',
    previousSearches: '历史查询',
    viewDetails: '查看详情',
    currentValue: '当前价值',
    totalReturn: '总收益',
    returnPercentage: '收益率',
    loading: '加载中...',
    error: '错误',
    noData: '暂无数据',
    searchHistory: '查询历史',
    portfolioEvolution: '投资组合演变',
    allocationChart: '分配图表',
    performanceChart: '表现图表',
    switchLanguage: '切换语言',
    historicalQueries: '历史查询',
    configuration: '配置',
    performance: '表现',
    history: '历史',
    calculateFirst: '请先在"投资组合配置"页面计算投资组合表现',
    actions: '操作'
  },
  en: {
    title: 'Portfolio Management System',
    subtitle: 'Professional Portfolio Analysis & Tracking Platform',
    clientName: 'Client Name',
    startDate: 'Start Date',
    initialBalance: 'Initial Balance',
    portfolioAllocation: 'Portfolio Allocation',
    stockSymbol: 'Stock Symbol',
    percentage: 'Percentage',
    addStock: 'Add Stock',
    removeStock: 'Remove Stock',
    calculateReturns: 'Calculate Returns',
    portfolioPerformance: 'Portfolio Performance',
    individualStockPerformance: 'Individual Stock Performance',
    overallPortfolioReturn: 'Overall Portfolio Return',
    previousSearches: 'Previous Searches',
    viewDetails: 'View Details',
    currentValue: 'Current Value',
    totalReturn: 'Total Return',
    returnPercentage: 'Return %',
    loading: 'Loading...',
    error: 'Error',
    noData: 'No Data',
    searchHistory: 'Search History',
    portfolioEvolution: 'Portfolio Evolution',
    allocationChart: 'Allocation Chart',
    performanceChart: 'Performance Chart',
    switchLanguage: 'Switch Language',
    historicalQueries: 'Historical Queries',
    configuration: 'Config',
    performance: 'Performance',
    history: 'History',
    calculateFirst: 'Please calculate portfolio performance in the "Portfolio Allocation" tab first',
    actions: 'Actions'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['zh']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
