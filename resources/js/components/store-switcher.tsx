import React, { useState } from 'react';
import { Check, ChevronsUpDown, Store, PlusCircle, Loader2, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: {
    id: string;
    name: string;
  }[];
  currentStore?: {
    id: string;
    name: string;
  };
}

export function StoreSwitcher({ 
  className, 
  items = [], 
  currentStore 
}: StoreSwitcherProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { auth } = usePage().props as any;
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Check if user has create-stores permission
  const userPermissions = typeof auth?.permissions === 'function' ? auth.permissions() : (auth?.permissions || []);
  const hasCreateStoresPermission = userPermissions.includes('create-stores');

  const formattedItems = items.map((item) => ({
    id: String(item.id),
    name: item.name,
  }));

  const currentStoreItem = currentStore || formattedItems[0];

  const onStoreSelect = (store: { id: string, name: string }) => {
    if (String(currentStoreItem?.id) === String(store.id)) {
      setOpen(false);
      return;
    }
    
    setIsLoading(true);
    setOpen(false);
    
    // Use Inertia.js router to submit the form
    router.post(route('switch-store'), {
      store_id: store.id
    }, {
      onSuccess: () => {
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      }
    });
  };

  // Filter stores based on search query
  const filteredItems = searchQuery
    ? formattedItems.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : formattedItems;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          aria-label={t('Select a store')}
          className={cn("w-[120px] sm:w-[180px] justify-between font-medium text-xs sm:text-sm", className)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className={cn("h-4 w-4 animate-spin", isRTL ? "ml-2" : "mr-2")} />
          ) : (
            <Store className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          )}
          <span className="truncate">{currentStoreItem?.name || t('Select store')}</span>
          <ChevronsUpDown className={cn("h-4 w-4 shrink-0 opacity-50", isRTL ? "mr-auto" : "ml-auto")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 shadow-xl border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden" align="end">
        {/* Search input */}
        <div className="flex items-center border-b border-gray-100 dark:border-gray-700 px-3 py-2">
          <Store className={cn("h-4 w-4 opacity-40", isRTL ? "ml-2" : "mr-2")} />
          <input
            type="text"
            placeholder={t('Search store...')}
            className="flex h-8 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-gray-400 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Store list */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">
              {t('No store found.')}
            </div>
          ) : (
            <>
              <p className="px-2 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{t('Your Stores')}</p>
              {filteredItems.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => onStoreSelect(store)}
                  className="flex w-full items-center text-sm cursor-pointer rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 px-2.5 py-2.5 my-0.5 transition-colors duration-150"
                >
                  <Store className={cn("h-4 w-4 text-gray-400", isRTL ? "ml-2.5" : "mr-2.5")} />
                  <span className="flex-grow text-left">{store.name}</span>
                  {String(currentStoreItem?.id) === String(store.id) && (
                    <Check className={cn("h-4 w-4 text-green-500", isRTL ? "mr-2" : "ml-2")} />
                  )}
                </button>
              ))}
            </>
          )}
        </div>
        
        {/* Add New Store - Redirects to pricing page */}
        {hasCreateStoresPermission && (
          <div className="border-t border-gray-100 dark:border-gray-700 p-2">
            <Link 
              href={route('plans.index')} 
              className="flex w-full items-center gap-3 px-3 py-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-sm group-hover:shadow-md transition-shadow">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {isRTL ? 'أضف متجراً جديداً' : 'Add New Store'}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {isRTL ? 'رخصة مدى الحياة — 499 دينار' : 'Lifetime license — 499 JOD'}
                </p>
              </div>
              <PlusCircle className="h-4 w-4 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
