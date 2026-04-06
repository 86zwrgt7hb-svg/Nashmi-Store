import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { TrialBanner } from '@/components/TrialBanner';
import { SuspensionBanner } from '@/components/SuspensionBanner';
import { EmailVerificationBanner } from '@/components/EmailVerificationBanner';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <EmailVerificationBanner />
                <TrialBanner />
                <SuspensionBanner />
                {children}
            </AppContent>
        </AppShell>
    );
}
