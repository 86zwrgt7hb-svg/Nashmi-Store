import React, { useState, useRef } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';

export default function ImportProducts() {
  const { t } = useTranslation();
  const { categories, taxes, flash } = usePage().props as any;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (['csv', 'xlsx', 'xls'].includes(ext || '')) {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    router.post(route('products.importProcess'), formData, {
      forceFormData: true,
      onFinish: () => {
        setIsUploading(false);
      },
      onError: () => {
        setIsUploading(false);
      }
    });
  };

  const handleDownloadTemplate = () => {
    window.open(route('products.importTemplate'), '_blank');
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('products.index'))
    }
  ];

  return (
    <PageTemplate 
      title={t('Bulk Import Products')}
      url="/products/import"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Products'), href: route('products.index') },
        { title: t('Bulk Import') }
      ]}
    >
      <div className="space-y-6">
        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              {t('Import Instructions')}
            </CardTitle>
            <CardDescription>
              {t('Follow these steps to import products in bulk')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold mb-1">{t('Download Template')}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('Download the CSV template with the correct column headers and sample data')}
                </p>
                <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('Download Template')}
                </Button>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <h4 className="font-semibold mb-1">{t('Fill in Your Data')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('Fill in your product data following the template format. If a category name does not exist, it will be created automatically.')}
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
                <h4 className="font-semibold mb-1">{t('Upload & Import')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('Upload your completed file and the system will create the products automatically')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Fields Notice */}
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">{t('Required Fields')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">{t('REQUIRED')}</Badge>
                    <span>{t('Product Name')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">{t('REQUIRED')}</Badge>
                    <span>{t('Category Name')}</span>
                  </div>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">
                  {t('If the category name does not exist, it will be created automatically. You can also insert images directly in the Excel file.')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {flash?.success && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <p className="text-sm font-medium text-green-800 dark:text-green-200">{flash.success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('Available Categories')}</CardTitle>
            <CardDescription>
              {t('Use one of these category names, or type a new name to auto-create a category')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories && categories.length > 0 ? (
                categories.map((cat: any) => (
                  <Badge key={cat.id} variant="outline" className="text-sm py-1 px-3">
                    {cat.name}
                    {cat.name_ar && <span className="text-muted-foreground mr-1 ml-1">({cat.name_ar})</span>}
                  </Badge>
                ))
              ) : (
                <div className="text-center py-4 w-full">
                  <AlertCircle className="h-8 w-8 mx-auto text-destructive opacity-50 mb-2" />
                  <p className="text-sm text-destructive font-medium">
                    {t('No categories found! You must create at least one category before importing products.')}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => router.visit(route('categories.create'))}
                  >
                    {t('Create Category')}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              {t('Upload File')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : selectedFile 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-3">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-300">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('Click to change file')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{t('Drag & drop your file here')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('or click to browse')}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('Supported formats: CSV, XLSX, XLS (max 10MB)')}
                  </p>
                </div>
              )}
            </div>

            {isUploading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{t('Importing products...')}</span>
                </div>
                <Progress value={undefined} className="h-2" />
              </div>
            )}

            <div className="flex justify-end mt-6 gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
              >
                <Download className="h-4 w-4 mr-2" />
                {t('Download Template')}
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading || !categories || categories.length === 0}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? t('Importing...') : t('Import Products')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Import Errors Display */}
        {flash?.importErrors && flash.importErrors.length > 0 && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {t('Import Errors')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {flash.importErrors.map((error: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm p-2 bg-destructive/5 rounded">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
}
