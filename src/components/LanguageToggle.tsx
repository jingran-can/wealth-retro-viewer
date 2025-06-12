
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
      className="flex items-center gap-2"
    >
      <Globe size={16} />
      {language === 'zh' ? 'EN' : '中文'}
    </Button>
  );
};

export default LanguageToggle;
