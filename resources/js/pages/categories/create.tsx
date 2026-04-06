import React, { useState, FormEvent } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import MediaPicker from '@/components/MediaPicker';
import { AiGenerateButton } from '@/components/AiGenerateButton';

export default function CreateCategory() {
  const { t } = useTranslation();
  const { parentCategories } = usePage().props as any;
  
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    description: '',
    description_ar: '',
    image: '',
    parent_id: '',
    sort_order: 0,
    is_active: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // Convert 'none' to empty string for parent_id
    const finalValue = name === 'parent_id' && value === 'none' ? '' : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (value: string) => {
    setFormData(prev => ({ ...prev, image: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.post(route('categories.store'), formData);
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('categories.index'))
    },
    {
      label: t('Save Category'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: handleSubmit
    }
  ];

  return (
    <PageTemplate 
      title={t('Create Category')}
      url="/categories/create"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Categories'), href: route('categories.index') },
        { title: t('Create') }
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('Category Information')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('Category Name (English)')}</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder={t('Enter category name in English')} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="name_ar">{t('Category Name (Arabic)')}</Label>
                <Input 
                  id="name_ar" 
                  name="name_ar" 
                  value={formData.name_ar} 
                  onChange={handleChange} 
                  placeholder={t('أدخل اسم القسم بالعربية')} 
                  dir="rtl"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="description">{t('Description (English)')}</Label>
                  <AiGenerateButton
                    contextName={formData.name}
                    fieldType="category_description"
                    language="en"
                    onGenerated={(content) => setFormData(prev => ({ ...prev, description: content }))}
                  />
                </div>
                <Input 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder={t('Category description in English')} 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="description_ar">{t('Description (Arabic)')}</Label>
                  <AiGenerateButton
                    contextName={formData.name_ar || formData.name}
                    fieldType="category_description"
                    language="ar"
                    onGenerated={(content) => setFormData(prev => ({ ...prev, description_ar: content }))}
                  />
                </div>
                <Input 
                  id="description_ar" 
                  name="description_ar" 
                  value={formData.description_ar} 
                  onChange={handleChange} 
                  placeholder={t('وصف القسم بالعربية')} 
                  dir="rtl"
                />
              </div>
            </div>
            <div>
              <MediaPicker
                label={t('Category Image')}
                value={formData.image}
                onChange={handleImageChange}
                placeholder={t('Select category image...')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parent_id">{t('Parent Category')}</Label>
                <Select 
                  value={formData.parent_id} 
                  onValueChange={(value) => handleSelectChange('parent_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select parent category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('None (Root Category)')}</SelectItem>
                    {parentCategories && parentCategories.map((category: any) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort_order">{t('Sort Order')}</Label>
                <Input 
                  id="sort_order" 
                  name="sort_order" 
                  type="number" 
                  value={formData.sort_order} 
                  onChange={handleChange} 
                  placeholder="0" 
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('Category Status')}</Label>
                <p className="text-sm text-muted-foreground">{t('Enable or disable category')}</p>
              </div>
              <Switch 
                checked={formData.is_active} 
                onCheckedChange={handleSwitchChange} 
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </PageTemplate>
  );
}