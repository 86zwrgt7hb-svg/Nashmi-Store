import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLayout } from '@/contexts/LayoutContext';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { LanguageSwitcher } from '@/components/language-switcher';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { StoreSwitcher } from '@/components/store-switcher';
export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { t } = useTranslation();
    const { position } = useLayout();
    return (
        <>
            <header className="border-sidebar-border/50 flex h-auto min-h-[3.5rem] shrink-0 items-center gap-2 border-b px-3 py-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-[3rem]">
            <div className="flex w-full items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                    {position === 'left' && <SidebarTrigger className="-ml-1 shrink-0" />}
                    <div className="text-sm font-medium truncate">
                        <Breadcrumbs items={breadcrumbs.map(b => ({ label: b.title, href: b.href }))} />
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Store Switcher - Show for company users and sub-users with stores data */}
                    {((usePage().props as any).auth?.user?.type === 'company' || ((usePage().props as any).stores && (usePage().props as any).stores.length > 0)) && (
                        <StoreSwitcher 
                            items={(usePage().props as any).stores || []} 
                            currentStore={((usePage().props as any).stores || []).find(store => String(store.id) === String((usePage().props as any).auth?.user?.current_store)) || ((usePage().props as any).stores?.length > 0 ? (usePage().props as any).stores[0] : null)} 
                        />
                    )}
                    
                    <LanguageSwitcher />
                    {position === 'right' && <SidebarTrigger className="-mr-1 shrink-0" />}
                </div>
            </div>
        </header>
        </>
    );
}
