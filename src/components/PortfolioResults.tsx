import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import PortfolioChart from './PortfolioChart';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, User } from 'lucide-react';

export interface StockPerformance {
  symbol: string;
  initialValue: number;
  currentValue: number;
  return: number;
  returnPercentage: number;
  allocation: number;
}

export interface PortfolioPerformance {
  id?: number;
  clientName: string;
  startDate: string;
  initialBalance: number;
  currentValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
  stocks: StockPerformance[];
  timestamp: string;
}

interface PortfolioResultsProps {
  performance: PortfolioPerformance;
}

const PortfolioResults: React.FC<PortfolioResultsProps> = ({ performance }) => {
  const { t } = useLanguage();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const isPositive = performance.totalReturn >= 0;

  return (
    <div className="w-full space-y-8">
      {/* 客户信息和总体表现 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 客户信息卡片 */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <User size={20} />
              客户信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">姓名:</span>
              <span className="font-semibold text-gray-800">{performance.clientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">起始日期:</span>
              <span className="font-medium text-gray-700">{performance.startDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* 初始投资卡片 */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <DollarSign size={20} />
              初始投资
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">
              {formatCurrency(performance.initialBalance)}
            </div>
            <p className="text-sm text-gray-600 mt-1">投资起始金额</p>
          </CardContent>
        </Card>

        {/* 当前价值卡片 */}
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <TrendingUp size={20} />
              当前价值
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">
              {formatCurrency(performance.currentValue)}
            </div>
            <p className="text-sm text-gray-600 mt-1">投资组合现值</p>
          </CardContent>
        </Card>
      </div>

      {/* 总收益表现卡片 */}
      <Card className={`shadow-xl border-2 ${
        isPositive 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
          : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
      }`}>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {isPositive ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
              <span className="text-2xl font-bold text-gray-800">{t('overallPortfolioReturn')}</span>
            </div>
            <Badge variant={isPositive ? "default" : "destructive"} className="text-lg px-4 py-2">
              {formatPercentage(performance.totalReturnPercentage)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white/70 rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign size={16} className="text-gray-500" />
                <p className="text-sm text-gray-600 font-medium">{t('initialBalance')}</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(performance.initialBalance)}</p>
            </div>
            <div className="text-center p-4 bg-white/70 rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp size={16} className="text-gray-500" />
                <p className="text-sm text-gray-600 font-medium">{t('currentValue')}</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(performance.currentValue)}</p>
            </div>
            <div className="text-center p-4 bg-white/70 rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign size={16} className={isPositive ? 'text-green-600' : 'text-red-600'} />
                <p className="text-sm text-gray-600 font-medium">{t('totalReturn')}</p>
              </div>
              <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(performance.totalReturn)}
              </p>
            </div>
            <div className="text-center p-4 bg-white/70 rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Percent size={16} className={isPositive ? 'text-green-600' : 'text-red-600'} />
                <p className="text-sm text-gray-600 font-medium">{t('returnPercentage')}</p>
              </div>
              <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(performance.totalReturnPercentage)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 图表展示 */}
      <PortfolioChart performance={performance} />

      {/* 个股表现 */}
      <Card className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            {t('individualStockPerformance')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-700">{t('stockSymbol')}</th>
                  <th className="text-right p-4 font-semibold text-gray-700">{t('percentage')}</th>
                  <th className="text-right p-4 font-semibold text-gray-700">{t('initialBalance')}</th>
                  <th className="text-right p-4 font-semibold text-gray-700">{t('currentValue')}</th>
                  <th className="text-right p-4 font-semibold text-gray-700">{t('totalReturn')}</th>
                  <th className="text-right p-4 font-semibold text-gray-700">{t('returnPercentage')}</th>
                </tr>
              </thead>
              <tbody>
                {performance.stocks.map((stock, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{stock.symbol.substring(0, 2)}</span>
                        </div>
                        <span className="font-bold text-gray-800">{stock.symbol}</span>
                      </div>
                    </td>
                    <td className="text-right p-4 font-medium text-gray-700">{stock.allocation.toFixed(1)}%</td>
                    <td className="text-right p-4 font-medium text-gray-700">{formatCurrency(stock.initialValue)}</td>
                    <td className="text-right p-4 font-medium text-gray-700">{formatCurrency(stock.currentValue)}</td>
                    <td className={`text-right p-4 font-bold ${stock.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(stock.return)}
                    </td>
                    <td className={`text-right p-4 font-bold ${stock.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(stock.returnPercentage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioResults;
