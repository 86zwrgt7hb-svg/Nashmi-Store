import '../css/app.css';
import '../css/dark-mode.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { LayoutProvider } from './contexts/LayoutContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { BrandProvider } from './contexts/BrandContext';
import { ModalStackProvider } from './contexts/ModalStackContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initializeTheme } from './hooks/use-appearance';
import { CustomToast } from './components/custom-toast';
import { initializeGlobalSettings } from './utils/globalSettings';
import './i18n'; // Import i18n configuration
import './utils/axios-config'; // Import axios configuration
import { setupFlashMessages } from './utils/flash-messages';

const initializeDirection = () => {
    const savedDirection = localStorage.getItem('layoutDirection');
    if (savedDirection) {
        document.documentElement.dir = savedDirection;
        document.documentElement.setAttribute('dir', savedDirection);
    } else {
        // Check current language and set direction accordingly
        const currentLang = localStorage.getItem('i18nextLng') || 'ar';
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        const direction = rtlLanguages.includes(currentLang) ? 'rtl' : 'ltr';
        document.documentElement.dir = direction;
        document.documentElement.setAttribute('dir', direction);
        localStorage.setItem('layoutDirection', direction);
    }
};

createInertiaApp({
    title: (title) => {
        // Get dynamic app name from global settings
        const page = (window as any).page;
        const globalSettings = page?.props?.globalSettings;
        const appName = globalSettings?.titleText || import.meta.env.VITE_APP_NAME || 'Nashmi Store';
        return `${title} - ${appName}`;
    },
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        initializeDirection();
        const root = createRoot(el);

        // Make page data globally available for axios interceptor
        try {
            (window as any).page = props.initialPage;
        } catch (e) {
        }

        // Set demo mode globally
        try {
            (window as any).isDemo = props.initialPage.props?.is_demo || false;
        } catch (e) {
            // Ignore errors
        }

        // Initialize global settings from shared data
        const globalSettings = props.initialPage.props.globalSettings || {};
        if (Object.keys(globalSettings).length > 0) {
            initializeGlobalSettings(globalSettings);

            // Set initial document title
            if (globalSettings.titleText) {
                const pageTitle = props.initialPage.props.title || 'Dashboard';
                document.title = `${pageTitle} - ${globalSettings.titleText}`;
            }
        }

        // Always initialize theme with available settings
        initializeTheme(globalSettings);

        const renderApp = (appProps: any) => {
            const currentGlobalSettings = appProps.initialPage.props.globalSettings || {};
            const user = appProps.initialPage.props.auth?.user;

            return (
                <ErrorBoundary>
                <ModalStackProvider>
                    <LayoutProvider>
                        <SidebarProvider>
                            <BrandProvider globalSettings={currentGlobalSettings} user={user}>
                                <App {...appProps} />
                                <CustomToast />
                            </BrandProvider>
                        </SidebarProvider>
                    </LayoutProvider>
                </ModalStackProvider>
                </ErrorBoundary>
            );
        };

        root.render(renderApp(props));

        // Handle invalid Inertia responses (prevents white pages)
        router.on('invalid', (event) => {
            event.preventDefault();
            // Auto-reload the page when an invalid response is received
            window.location.reload();
        });

        // Handle exceptions during Inertia visits
        router.on('exception', (event) => {
            event.preventDefault();
            // Auto-reload on exception
            window.location.reload();
        });

        // Update global page data on navigation and re-render with new settings
        router.on('navigate', (event) => {
            try {
                (window as any).page = event.detail.page;

                // Re-initialize global settings with updated data
                const updatedGlobalSettings = event.detail.page.props.globalSettings || {};
                if (Object.keys(updatedGlobalSettings).length > 0) {
                    initializeGlobalSettings(updatedGlobalSettings);

                    // Update document title with page title and brand titleText
                    const pageTitle = event.detail.page.props.title || event.detail.page.component.split('/').pop()?.replace(/([A-Z])/g, ' $1').trim() || 'Dashboard';
                    const appName = updatedGlobalSettings.titleText || 'Nashmi Store';
                    document.title = `${pageTitle} - ${appName}`;
                }

                // Update brand context without full re-render (Inertia handles page rendering)
                // root.render(renderApp({ initialPage: event.detail.page })); // Removed: causes React hooks mismatch error #300

                // Force dark mode check on navigation
                const savedTheme = localStorage.getItem('themeSettings');
                if (savedTheme) {
                    const themeSettings = JSON.parse(savedTheme);
                    const isDark = themeSettings.appearance === 'dark' ||
                        (themeSettings.appearance === 'system' &&
                            window.matchMedia('(prefers-color-scheme: dark)').matches);
                    document.documentElement.classList.toggle('dark', isDark);
                    document.body.classList.toggle('dark', isDark);
                }
            } catch (e) {
            }
        });
    },
    progress: {
        color: '#4B5563',
    },
});

// Add event listener for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    // Re-apply theme when system preference changes
    const savedTheme = localStorage.getItem('themeSettings');
    if (savedTheme) {
        const themeSettings = JSON.parse(savedTheme);
        if (themeSettings.appearance === 'system') {
            initializeTheme();
        }
    }
});

// Setup flash messages
setupFlashMessages();