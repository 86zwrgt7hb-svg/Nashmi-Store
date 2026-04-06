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
            <header className="border-sidebar-border/50 flex h-14 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-3">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    {position === 'left' && <SidebarTrigger className="-ml-1" />}
                    <div className="text-sm font-medium">
                        <Breadcrumbs items={breadcrumbs.map(b => ({ label: b.title, href: b.href }))} />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Store Switcher - Show for company users and sub-users with stores data */}
                    {((usePage().props as any).auth?.user?.type === 'company' || ((usePage().props as any).stores && (usePage().props as any).stores.length > 0)) && (
                        <StoreSwitcher 
                            items={(usePage().props as any).stores || []} 
                            currentStore={((usePage().props as any).stores || []).find(store => String(store.id) === String((usePage().props as any).auth?.user?.current_store)) || ((usePage().props as any).stores?.length > 0 ? (usePage().props as any).stores[0] : null)} 
                        />
                    )}
                    

                    <LanguageSwitcher />
                    {position === 'right' && <SidebarTrigger className="-mr-1" />}
                </div>
            </div>
        </header>
        </>
    );
}