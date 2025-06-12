
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { PortfolioPerformance } from './PortfolioResults';
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface PortfolioChartProps {
  performance: PortfolioPerformance;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#10B981'];

const PortfolioChart: React.FC<PortfolioChartProps> = ({ performance }) => {
  const { t } = useLanguage();

  const allocationData = performance.stocks.map((stock, index) => ({
    name: stock.symbol,
    value: stock.allocation,
    color: COLORS[index % COLORS.length],
    amount: stock.currentValue
  }));

  const performanceData = performance.stocks.map((stock) => ({
    symbol: stock.symbol,
    return: stock.returnPercentage,
    value: stock.currentValue
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* 分配饼图 */}
      <Card className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <PieChartIcon className="h-5 w-5 text-white" />
            </div>
            {t('allocationChart')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  `${value.toFixed(1)}%`,
                  `分配比例`
                ]}
                labelFormatter={(label) => `股票: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* 图例 */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {allocationData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                <span className="text-sm text-gray-600">{item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 表现柱状图 */}
      <Card className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            {t('performanceChart')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="symbol" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db' }}
                label={{ value: '收益率 (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}%`, '收益率']}
                labelFormatter={(label) => `股票: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="return" 
                fill="url(#colorGradient)"
                radius={[4, 4, 0, 0]}
                stroke="#fff"
                strokeWidth={1}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioChart;
