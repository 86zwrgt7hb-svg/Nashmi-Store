import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { Save, Search, Upload, X, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { getImageUrl } from '@/utils/image-helper';
import MediaPicker from '@/components/MediaPicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SeoSettingsProps {
  settings?: Record<string, string>;
}

export default function SeoSettings({ settings = {} }: SeoSettingsProps) {
  const { t } = useTranslation();
  const pageProps = usePage().props as any;

  // Default settings
  const defaultSettings = {
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    metaImage: ''
  };

  // Combine settings from props and page props
  const settingsData = Object.keys(settings).length > 0
    ? settings
    : (pageProps.settings || {});

  // Initialize state with merged settings
  const [seoSettings, setSeoSettings] = useState(() => ({
    metaTitle: settingsData.metaTitle || defaultSettings.metaTitle,
    metaKeywords: settingsData.metaKeywords || defaultSettings.metaKeywords,
    metaDescription: settingsData.metaDescription || defaultSettings.metaDescription,
    metaImage: settingsData.metaImage || defaultSettings.metaImage
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Update state when settings change
  useEffect(() => {
    if (pageProps.settings) {
      setSeoSettings(prev => ({
        ...prev,
        metaTitle: pageProps.settings.metaTitle || prev.metaTitle,
        metaKeywords: pageProps.settings.metaKeywords || prev.metaKeywords,
        metaDescription: pageProps.settings.metaDescription || prev.metaDescription,
        metaImage: pageProps.settings.metaImage || prev.metaImage
      }));
    }
  }, [pageProps.settings]);

  // Handle SEO settings form changes
  const handleSeoSettingsChange = (field: string, value: string) => {
    setSeoSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle media picker selection
  const handleMediaSelect = (url: string) => {
    setImageError(false);
    setSeoSettings(prev => ({
      ...prev,
      metaImage: url
    }));
  };

  // Remove uploaded image
  const removeImage = () => {
    setImageError(false);
    setSeoSettings(prev => ({
      ...prev,
      metaImage: ''
    }));
  };

  const getDescriptionStatus = () => {
    const length = seoSettings.metaDescription.length;
    if (length === 0) return { status: 'empty', color: 'text-muted-foreground', icon: AlertCircle };
    if (length < 120) return { status: 'short', color: 'text-orange-500', icon: AlertCircle };
    if (length <= 160) return { status: 'good', color: 'text-green-500', icon: CheckCircle2 };
    return { status: 'long', color: 'text-red-500', icon: AlertCircle };
  };

  const getKeywordsCount = () => {
    return seoSettings.metaKeywords.split(',').filter(k => k.trim()).length;
  };

  // Handle SEO settings form submission
  const submitSeoSettings = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!seoSettings.metaKeywords.trim()) {
      toast.error(t('Meta Keywords is required'));
      return;
    }

    if (!seoSettings.metaDescription.trim()) {
      toast.error(t('Meta Description is required'));
      return;
    }

    if (!seoSettings.metaImage.trim()) {
      toast.error(t('Meta Image is required'));
      return;
    }

    setIsLoading(true);

    // Submit to backend using Inertia
    router.post(route('settings.seo.update'), seoSettings, {
      preserveScroll: true,
      onSuccess: () => {
        setIsLoading(false);
      },
      onError: (errors) => {
        setIsLoading(false);
        const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to update SEO settings');
        toast.error(errorMessage);
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Search className="h-5 w-5" />
            {t("SEO Settings")}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t("Configure SEO settings to improve your website's search engine visibility")}
          </p>
        </div>
        <Button onClick={submitSeoSettings} disabled={isLoading} size="sm">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? t('Saving...') : t("Save Changes")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Meta Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="metaTitle">{t('Meta Title')}</Label>
                <span className={`text-sm ${seoSettings.metaTitle.length > 60 ? 'text-red-500' :
                    seoSettings.metaTitle.length > 50 ? 'text-orange-500' : 'text-green-500'
                  }`}>
                  {seoSettings.metaTitle.length}/60
                </span>
              </div>
              <Input
                id="metaTitle"
                value={seoSettings.metaTitle}
                onChange={(e) => handleSeoSettingsChange('metaTitle', e.target.value)}
                placeholder={t('Enter page title for search engines')}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                {t('Appears as the clickable headline in search results')}
              </p>
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="metaDescription">{t('Meta Description')}</Label>
                <div className="flex items-center gap-1">
                  {(() => {
                    const { color, icon: Icon } = getDescriptionStatus();
                    return (
                      <>
                        <Icon className={`h-4 w-4 ${color}`} />
                        <span className={`text-sm ${color}`}>
                          {seoSettings.metaDescription.length}/160
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
              <Textarea
                id="metaDescription"
                value={seoSettings.metaDescription}
                onChange={(e) => handleSeoSettingsChange('metaDescription', e.target.value)}
                placeholder={t('Write a compelling description that summarizes your page content...')}
                maxLength={160}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {t('Appears below the title in search results. Optimal length: 120-160 characters')}
              </p>
            </div>

            {/* Meta Keywords */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="metaKeywords">{t('Meta Keywords')}</Label>
                <Badge variant="outline">{getKeywordsCount()} {t('keywords')}</Badge>
              </div>
              <Input
                id="metaKeywords"
                value={seoSettings.metaKeywords}
                onChange={(e) => handleSeoSettingsChange('metaKeywords', e.target.value)}
                placeholder={t('seo, optimization, website, keywords')}
              />
              <p className="text-xs text-muted-foreground">
                {t('Comma-separated keywords relevant to your content')}
              </p>
            </div>

            {/* Meta Image */}
            <div className="space-y-2">
              <Label>{t('Meta Image')}</Label>
              <MediaPicker
                value={seoSettings.metaImage}
                onChange={handleMediaSelect}
                placeholder={t('Select image for social media sharing...')}
                showPreview={false}
              />
              <p className="text-xs text-muted-foreground">
                {t('Image displayed when sharing on social media. Recommended: 1200x630px')}
              </p>
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <Card className="border-muted bg-muted/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="h-4 w-4 text-primary" />
                    <h3 className="text-base font-medium">{t('SEO Preview')}</h3>
                  </div>

                  {/* Search Result Preview */}
                  <div className="space-y-4">
                    <div className="border rounded-md p-3 bg-white dark:bg-slate-900 shadow-sm">
                      <div className="text-xs text-green-600 mb-1">example.com</div>
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
                        {seoSettings.metaTitle || t('Your page title will appear here')}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {seoSettings.metaDescription || t('Your meta description will appear here in search results...')}
                      </div>
                    </div>

                    {/* Social Media Preview */}
                    <div className="border rounded-md bg-white dark:bg-slate-900 shadow-sm p-3">
                      <div className="text-xs text-muted-foreground mb-2">{t('Social Media Preview')}</div>
                      {seoSettings.metaImage ? (
                        <div className="relative aspect-[1200/630] w-full mb-2 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                          <img loading="lazy"
                            src={getImageUrl(seoSettings.metaImage)}
                            alt="Social preview"
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        </div>
                      ) : (
                        <div className="aspect-[1200/630] w-full mb-2 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                          <Globe className="h-8 w-8 text-muted-foreground/20" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                          {seoSettings.metaTitle || t('Your page title')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {seoSettings.metaDescription || t('Your description...')}
                        </div>
                      </div>
                    </div>

                    {/* SEO Tips */}
                    <div className="border rounded-md p-3 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
                      <div className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2 uppercase tracking-wider">{t('SEO Tips')}</div>
                      <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1.5">
                        <li className="flex items-start gap-1.5">
                          <span className="mt-1 h-1 w-1 rounded-full bg-blue-400 flex-shrink-0" />
                          <span>{t('Title: 50-60 characters optimal')}</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="mt-1 h-1 w-1 rounded-full bg-blue-400 flex-shrink-0" />
                          <span>{t('Description: 150-160 characters')}</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="mt-1 h-1 w-1 rounded-full bg-blue-400 flex-shrink-0" />
                          <span>{t('Include target keywords early')}</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="mt-1 h-1 w-1 rounded-full bg-blue-400 flex-shrink-0" />
                          <span>{t('Image: 1200x630px works well')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}