
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PortfolioPerformance } from './PortfolioResults';

interface SearchHistoryProps {
  history: PortfolioPerformance[];
  onViewDetails: (performance: PortfolioPerformance) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onViewDetails }) => {
  const { t } = useLanguage();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('searchHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">{t('noData')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('searchHistory')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">{t('clientName')}</th>
                <th className="text-left p-2">{t('startDate')}</th>
                <th className="text-right p-2">{t('initialBalance')}</th>
                <th className="text-right p-2">{t('currentValue')}</th>
                <th className="text-right p-2">{t('returnPercentage')}</th>
                <th className="text-center p-2">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((performance, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-semibold">{performance.clientName}</td>
                  <td className="p-2">{formatDate(performance.startDate)}</td>
                  <td className="text-right p-2">{formatCurrency(performance.initialBalance)}</td>
                  <td className="text-right p-2">{formatCurrency(performance.currentValue)}</td>
                  <td className={`text-right p-2 ${performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {performance.totalReturnPercentage >= 0 ? '+' : ''}{performance.totalReturnPercentage.toFixed(2)}%
                  </td>
                  <td className="text-center p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(performance)}
                    >
                      <Eye size={16} className="mr-1" />
                      {t('viewDetails')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchHistory;
