import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Calculator, AlertCircle, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Stock {
  symbol: string;
  percentage: number;
}

export interface PortfolioData {
  clientName: string;
  startDate: string;
  initialBalance: number;
  stocks: Stock[];
}

interface PortfolioFormProps {
  onSubmit: (data: PortfolioData) => void;
  loading: boolean;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({ onSubmit, loading }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<PortfolioData>({
    clientName: '',
    startDate: '',
    initialBalance: 0,
    stocks: [{ symbol: '', percentage: 0 }]
  });

  const addStock = () => {
    setFormData(prev => ({
      ...prev,
      stocks: [...prev.stocks, { symbol: '', percentage: 0 }]
    }));
  };

  const removeStock = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stocks: prev.stocks.filter((_, i) => i !== index)
    }));
  };

  const updateStock = (index: number, field: keyof Stock, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      stocks: prev.stocks.map((stock, i) => 
        i === index ? { ...stock, [field]: value } : stock
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPercentage = formData.stocks.reduce((sum, stock) => sum + stock.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      alert('股票分配总和必须为100%');
      return;
    }
    onSubmit(formData);
  };

  const totalPercentage = formData.stocks.reduce((sum, stock) => sum + stock.percentage, 0);

  // 获取建议的日期范围（避免周末）
  const getDateSuggestions = () => {
    const today = new Date();
    const getValidWeekday = (date: Date) => {
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0) date.setDate(date.getDate() - 2); // Sunday -> Friday
      if (dayOfWeek === 6) date.setDate(date.getDate() - 1); // Saturday -> Friday
      return date;
    };

    const oneMonthAgo = getValidWeekday(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()));
    const threeMonthsAgo = getValidWeekday(new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()));
    const sixMonthsAgo = getValidWeekday(new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()));
    
    return {
      oneMonth: oneMonthAgo.toISOString().split('T')[0],
      threeMonths: threeMonthsAgo.toISOString().split('T')[0],
      sixMonths: sixMonthsAgo.toISOString().split('T')[0]
    };
  };

  const dateSuggestions = getDateSuggestions();

  // 获取最大可选日期（今天或最近的工作日）
  const getMaxDate = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    if (dayOfWeek === 0) today.setDate(today.getDate() - 2); // Sunday -> Friday
    if (dayOfWeek === 6) today.setDate(today.getDate() - 1); // Saturday -> Friday
    return today.toISOString().split('T')[0];
  };

  // 获取最小可选日期（一年前）
  const getMinDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 1);
    return today.toISOString().split('T')[0];
  };

  return (
    <Card className="w-full max-w-4xl bg-white/70 backdrop-blur-sm shadow-xl border border-white/20">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-75"></div>
            <div className="relative p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('portfolioAllocation')}
          </CardTitle>
        </div>
        <p className="text-gray-600">配置您的客户投资组合并计算收益表现</p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本信息卡片 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              基本信息
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">{t('clientName')}</Label>
                <Input
                  id="clientName"
                  type="text"
                  placeholder="输入客户姓名"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  required
                  className="mt-2 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {t('startDate')}
                  <Info className="h-4 w-4 text-blue-500" />
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                  max={getMaxDate()}
                  min={getMinDate()}
                  className="mt-2 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="mt-2 text-xs text-red-600">
                  注意：免费版API仅支持查询近12个月的数据
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <div>建议选择工作日，快捷选择：</div>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, startDate: dateSuggestions.oneMonth }))}
                      className="text-blue-600 hover:underline"
                    >
                      1个月前
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, startDate: dateSuggestions.threeMonths }))}
                      className="text-blue-600 hover:underline"
                    >
                      3个月前
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, startDate: dateSuggestions.sixMonths }))}
                      className="text-blue-600 hover:underline"
                    >
                      6个月前
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="initialBalance" className="text-sm font-medium text-gray-700">{t('initialBalance')}</Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="initialBalance"
                    type="number"
                    placeholder="500000"
                    value={formData.initialBalance || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, initialBalance: Number(e.target.value) }))}
                    required
                    className="pl-8 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 股票配置卡片 */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                {t('portfolioAllocation')}
              </h3>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  Math.abs(totalPercentage - 100) > 0.01 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-purple-100 text-purple-700 border border-purple-200'
                }`}>
                  总计: {totalPercentage.toFixed(1)}%
                </div>
                {Math.abs(totalPercentage - 100) > 0.01 && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    <span>必须等于100%</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {formData.stocks.map((stock, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-700">{t('stockSymbol')}</Label>
                      <Input
                        type="text"
                        placeholder="例如: AAPL"
                        value={stock.symbol}
                        onChange={(e) => updateStock(index, 'symbol', e.target.value.toUpperCase())}
                        required
                        className="mt-2 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-700">{t('percentage')}</Label>
                      <div className="relative mt-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="0.0"
                          value={stock.percentage || ''}
                          onChange={(e) => updateStock(index, 'percentage', Number(e.target.value))}
                          required
                          className="pr-8 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeStock(index)}
                      disabled={formData.stocks.length === 1}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <Minus size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={addStock}
              className="mt-4 w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
            >
              <Plus size={16} className="mr-2" />
              {t('addStock')}
            </Button>
          </div>

          {/* 提交按钮 */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300" 
              disabled={loading || Math.abs(totalPercentage - 100) > 0.01}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('loading')}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Calculator size={20} />
                  {t('calculateReturns')}
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PortfolioForm;
