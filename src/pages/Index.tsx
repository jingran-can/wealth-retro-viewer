import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import PortfolioForm, { PortfolioData } from '@/components/PortfolioForm';
import PortfolioResults, { PortfolioPerformance } from '@/components/PortfolioResults';
import SearchHistory from '@/components/SearchHistory';
import LanguageToggle from '@/components/LanguageToggle';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { getHistoricalStockPrice, getCurrentStockPrice, getHistoryList, getHistoryDetail, saveHistory } from '@/services/stockApi';
import { PieChart, TrendingUp, History, BarChart3, DollarSign } from 'lucide-react';

const IndexContent: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [currentPerformance, setCurrentPerformance] = useState<PortfolioPerformance | null>(null);
  const [searchHistory, setSearchHistory] = useState<PortfolioPerformance[]>([]);
  const [activeTab, setActiveTab] = useState('calculator');

  useEffect(() => {
    getHistoryList()
      .then(data => setSearchHistory(data))
      .catch((err) => {
        console.error("Failed to fetch history:", err);
        toast({ title: '获取历史记录失败', description: err.message, variant: 'destructive' });
        setSearchHistory([]);
      });
  }, []);

  const calculatePortfolioPerformance = async (data: PortfolioData) => {
    setLoading(true);
    try {
      const stockPerformances = await Promise.all(
        data.stocks.map(async (stock) => {
          try {
            const historicalPrice = await getHistoricalStockPrice(stock.symbol, data.startDate);
            const currentPrice = await getCurrentStockPrice(stock.symbol);
            const initialValue = (data.initialBalance * stock.percentage) / 100;
            const shares = initialValue / historicalPrice;
            const currentValue = shares * currentPrice;
            const returnAmount = currentValue - initialValue;
            const returnPercentage = (returnAmount / initialValue) * 100;
            return {
              symbol: stock.symbol,
              initialValue,
              currentValue,
              return: returnAmount,
              returnPercentage,
              allocation: stock.percentage
            };
          } catch (error) {
            console.error(`获取股票 ${stock.symbol} 数据失败:`, error);
            throw new Error(`股票代码 ${stock.symbol} 无效或API服务暂时不可用`);
          }
        })
      );
      const totalCurrentValue = stockPerformances.reduce((sum, stock) => sum + stock.currentValue, 0);
      const totalReturn = totalCurrentValue - data.initialBalance;
      const totalReturnPercentage = (totalReturn / data.initialBalance) * 100;
      const performance: PortfolioPerformance = {
        clientName: data.clientName,
        startDate: data.startDate,
        initialBalance: data.initialBalance,
        currentValue: totalCurrentValue,
        totalReturn,
        totalReturnPercentage,
        stocks: stockPerformances,
        timestamp: new Date().toISOString()
      };
      setCurrentPerformance(performance);
      await saveHistory(performance);

      const newHistory = await getHistoryList();
      setSearchHistory(newHistory);

      setActiveTab('results');
      toast({
        title: t('portfolioPerformance'),
        description: `${data.clientName}的投资组合计算完成`,
      });
    } catch (error) {
      console.error('计算投资组合表现时出错:', error);
      const errorMessage = error instanceof Error ? error.message : '计算投资组合表现时出错，请检查网络连接和股票代码';
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (performance: PortfolioPerformance) => {
    if (!performance.id) return;
    try {
        const detail = await getHistoryDetail(performance.id);
        setCurrentPerformance(detail);
        setActiveTab('results');
    } catch(err) {
        console.error("Failed to fetch details:", err);
        toast({ title: '获取详情失败', description: '无法加载该条历史记录的详细信息。', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {/* 增强的头部设计 */}
        <div className="flex justify-between items-center mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75"></div>
              <div className="relative p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {t('title')}
              </h1>
              <p className="text-gray-600 text-lg mt-1">{t('subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">{t('historicalQueries')}</p>
              <p className="text-2xl font-bold text-gray-800">{searchHistory.length}</p>
            </div>
            <LanguageToggle />
          </div>
        </div>

        {/* 增强的Tabs设计 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 h-14 p-1 bg-white/70 backdrop-blur-sm shadow-lg border border-white/20">
              <TabsTrigger 
                value="calculator" 
                className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                <PieChart size={20} />
                <span className="hidden sm:inline">{t('portfolioAllocation')}</span>
                <span className="sm:hidden">{t('configuration')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white"
              >
                <TrendingUp size={20} />
                <span className="hidden sm:inline">{t('portfolioPerformance')}</span>
                <span className="sm:hidden">{t('performance')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <History size={20} />
                <span className="hidden sm:inline">{t('searchHistory')}</span>
                <span className="sm:hidden">{t('history')}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calculator" className="flex justify-center">
            <PortfolioForm onSubmit={calculatePortfolioPerformance} loading={loading} />
          </TabsContent>

          <TabsContent value="results">
            {currentPerformance ? (
              <PortfolioResults performance={currentPerformance} />
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm shadow-lg border border-white/20">
                <CardContent className="flex items-center justify-center py-24">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur opacity-30"></div>
                      <div className="relative p-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full inline-block">
                        <TrendingUp className="h-16 w-16 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">{t('noData')}</h3>
                    <p className="text-gray-500 text-lg">{t('calculateFirst')}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <SearchHistory history={searchHistory} onViewDetails={handleViewDetails} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
