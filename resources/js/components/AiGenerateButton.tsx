import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'sonner';

interface AiGenerateButtonProps {
  contextName: string;
  fieldType: 'description' | 'specifications' | 'category_description' | 'seo_description' | 'meta_keywords';
  language: 'en' | 'ar';
  categoryName?: string;
  onGenerated: (content: string) => void;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
}

export function AiGenerateButton({
  contextName,
  fieldType,
  language,
  categoryName = '',
  onGenerated,
  buttonText,
  className = '',
  disabled = false,
}: AiGenerateButtonProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const defaultButtonText = language === 'ar' ? 'توليد بالذكاء الاصطناعي' : 'AI Generate';

  const handleGenerate = async () => {
    if (!contextName.trim()) {
      toast.error(
        language === 'ar'
          ? 'يرجى إدخال اسم المنتج أولاً'
          : 'Please enter the product name first'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(route('ai.content.generate'), {
        context_name: contextName,
        field_type: fieldType,
        language: language,
        category_name: categoryName,
      });

      if (response.data.success) {
        onGenerated(response.data.content);
        toast.success(
          language === 'ar' ? 'تم التوليد بنجاح!' : 'Generated successfully!'
        );
      } else {
        toast.error(response.data.message || (language === 'ar' ? 'فشل التوليد' : 'Generation failed'));
      }
    } catch (error: any) {
      const message = error.response?.data?.message || (language === 'ar' ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred, please try again');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={disabled || isLoading || !contextName.trim()}
      className={`inline-flex items-center gap-1.5 text-xs h-7 px-2.5 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950 dark:hover:text-purple-300 transition-all ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>{language === 'ar' ? 'جاري التوليد...' : 'Generating...'}</span>
        </>
      ) : (
        <>
          <Sparkles className="h-3 w-3" />
          <span>{buttonText || defaultButtonText}</span>
        </>
      )}
    </Button>
  );
}
