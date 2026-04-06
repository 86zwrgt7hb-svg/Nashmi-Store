import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useLayout } from '@/contexts/LayoutContext';
import { useSidebarSettings } from '@/contexts/SidebarContext';
import { useBrand } from '@/contexts/BrandContext';
import { type NavItem } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { BookOpen, Contact, Folder, LayoutGrid, ShoppingBag, Users, Tag, FileIcon, Settings, BarChart, Barcode, FileText, Briefcase, CheckSquare, Calendar, CreditCard, Nfc, Ticket, DollarSign, MessageSquare, CalendarDays, Palette, Image, Mail, Store, ChevronDown, Building2, Globe, Package, ShoppingCart, UserCheck, Truck, Star, Zap, Bot, Webhook, FileType, Languages, Percent, Headphones, Smartphone, Globe2, Megaphone } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AppLogo from './app-logo';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { hasPermission } from '@/utils/permissions';
import { getImageUrl } from '@/utils/image-helper';



export function AppSidebar() {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const userRole = auth.user?.type || auth.user?.role;
    const permissions = auth?.permissions || [];
    const businesses = auth.user?.businesses || [];
    const currentBusiness = businesses.find((b: any) => b.id === auth.user?.current_store) || businesses[0];
    
    const handleBusinessSwitch = (businessId: number) => {
        router.post(route('switch-business'), { business_id: businessId });
    };

    const getSuperAdminNavItems = (): NavItem[] => [
        {
            title: t('Dashboard'),
            href: route('dashboard'),
            icon: LayoutGrid,
        },

        {
            title: t('Companies'),
            href: route('companies.index'),
            icon: Briefcase,
        },
        {
            title: t('Media Library'),
            href: route('media-library'),
            icon: Image,
        },


        {
            title: t('Plans'),
            icon: CreditCard,
            children: [
                {
                    title: t('Plan'),
                    href: route('plans.index')
                },
                {
                    title: t('Plan Request'),
                    href: route('plan-requests.index')
                },
                {
                    title: t('Plan Orders'),
                    href: route('plan-orders.index')
                }
            ]
        },
        {
            title: t('Coupons'),
            href: route('coupons.index'),
            icon: Settings,
        },

        {
            title: t('Currencies'),
            href: route('currencies.index'),
            icon: DollarSign,
        },
        {
            title: t('Location Management'),
            icon: Globe2,
            children: [
                {
                    title: t('Countries'),
                    href: route('countries.index')
                },
                {
                    title: t('States'),
                    href: route('states.index')
                },
            ]
        },

        {
            title: t('Landing Page'),
            icon: Palette,
            children: [
                {
                    title: t('Landing Page'),
                    href: route('landing-page')
                },
                {
                    title: t('Custom Pages'),
                    href: route('landing-page.custom-pages.index')
                },
                {
                    title: t('Subscribers'),
                    href: route('landing-page.subscribers.index')
                },
                {
                    title: t('Contacts'),
                    href: route('landing-page.contacts.index')
                }
            ]
        },
        {
            title: t('Email Templates'),
            href: route('email-templates.index'),
            icon: Mail,
        },
        {
            title: t('Notification Templates'),
            href: route('notification-templates.index'),
            icon: MessageSquare,
        },
        {
            title: t('Settings'),
            href: route('settings'),
            icon: Settings,
        }
    ];

    const getCompanyNavItems = (): NavItem[] => {
        const items: NavItem[] = [];
        const user = auth.user;
        const plan = user?.plan;
        
        // Helper function to check feature access
        const hasFeatureAccess = (feature: string) => {
            // Always allow for superadmin
            if (userRole === 'superadmin') return true;
            
            // If no plan, allow by default (for backward compatibility)
            if (!plan) return true;
            
            const featureMap: { [key: string]: string } = {
                'pos': 'enable_pos',
                'analytics': 'enable_analytics',
                'express_checkout': 'enable_express_checkout',
                'staff_management': 'enable_staff_management'
            };
            const planFeature = featureMap[feature];
            return planFeature ? plan[planFeature] === 'on' : true;
        };
        
        // Dashboard
        items.push({
            title: t('Dashboard'),
            href: route('dashboard'),
            icon: LayoutGrid,
        });

        // Store Management
        if (hasPermission('manage-stores')) {
            items.push({
                title: t('Store Management'),
                icon: Building2,
                children: [
                    {
                        title: t('Stores'),
                        href: route('stores.index')
                    },
                ]
            });
        }

        // Product Management
        const productChildren = [];
        if (hasPermission('manage-products')) {
            productChildren.push({
                title: t('Products'),
                href: route('products.index')
            });
        }
        if (hasPermission('manage-categories')) {
            productChildren.push({
                title: t('Categories'),
                href: route('categories.index')
            });
        }
        if (hasPermission('manage-tax')) {
            productChildren.push({
                title: t('Tax'),
                href: route('tax.index')
            });
        }
        if (productChildren.length > 0) {
            items.push({
                title: t('Product Management'),
                icon: Package,
                children: productChildren
            });
        }

        // Order Management
        if (hasPermission('manage-orders')) {
            items.push({
                title: t('Order Management'),
                href: route('orders.index'),
                icon: ShoppingCart,
            });
        }

        // Customer Management
        if (hasPermission('manage-customers')) {
            items.push({
                title: t('Customer Management'),
                href: route('customers.index'),
                icon: UserCheck,
            });
        }



        // Coupon System
        if (hasPermission('manage-coupon-system')) {
            items.push({
                title: t('Coupon System'),
                href: route('coupon-system.index'),
                icon: Percent,
            });
        }

        // Shipping Management - available for all plans
        if (hasPermission('manage-shipping')) {
            items.push({
                title: t('Shipping Management'),
                href: route('shipping.index'),
                icon: Truck,
            });
        }

        // Analytics & Reporting - Pro feature
        if (hasPermission('manage-analytics')) {
            const hasAnalyticsAccess = hasFeatureAccess('analytics');
            items.push({
                title: t('Analytics & Reporting'),
                href: route('analytics.index'),
                icon: BarChart,
                isProFeature: true,
                isLocked: !hasAnalyticsAccess,
            });
        }

        // Express Checkout - Pro feature
        if (hasPermission('manage-express-checkout')) {
            const hasExpressCheckoutAccess = hasFeatureAccess('express_checkout');
            items.push({
                title: t('Express Checkout'),
                href: route('express-checkout.index'),
                icon: Zap,
                isProFeature: true,
                isLocked: !hasExpressCheckoutAccess,
            });
        }

        // POS System - show for all but indicate if locked
        if (hasPermission('manage-pos')) {
            const hasPosAccess = hasFeatureAccess('pos');
            items.push({
                title: t('POS System'),
                href: route('pos.index'),
                icon: Smartphone,
                isProFeature: true,
                isLocked: !hasPosAccess,
            });
        }


        // Staff Management - Pro feature
        if (hasPermission('manage-users') || hasPermission('manage-roles')) {
            const hasStaffAccess = hasFeatureAccess('staff_management');
            const staffChildren = [];
            if (hasPermission('manage-users')) {
                staffChildren.push({
                    title: t('Users'),
                    href: route('users.index')
                });
            }
            if (hasPermission('manage-roles')) {
                staffChildren.push({
                    title: t('Roles'),
                    href: route('roles.index')
                });
            }
            if (staffChildren.length > 0) {
                items.push({
                    title: t('Staff Management'),
                    icon: Users,
                    children: staffChildren,
                    isProFeature: true,
                    isLocked: !hasStaffAccess,
                });
            }
        }

        // Media Library
        if (hasPermission('manage-media')) {
            items.push({
                title: t('Media Library'),
                href: route('media-library'),
                icon: Image,
            });
        }

        // Plans
        const planChildren = [];
        if (hasPermission('manage-plans')) {
            planChildren.push({
                title: t('Plan'),
                href: route('plans.index')
            });
        }
        if (hasPermission('manage-plan-requests')) {
            planChildren.push({
                title: t('Plan Request'),
                href: route('plan-requests.index')
            });
        }
        if (hasPermission('manage-plan-orders')) {
            planChildren.push({
                title: t('Plan Orders'),
                href: route('plan-orders.index')
            });
        }
        if (planChildren.length > 0) {
            items.push({
                title: t('Plans'),
                icon: CreditCard,
                children: planChildren
            });
        }



        // Settings - Only show if user has settings permission
        if (hasPermission('manage-settings')) {
            items.push({
                title: t('Settings'),
                href: route('settings'),
                icon: Settings,
            });
        }

        return items;
    };

    const mainNavItems = userRole === 'superadmin' ? getSuperAdminNavItems() : getCompanyNavItems();

    const { position } = useLayout();
    const { variant, collapsible, style } = useSidebarSettings();
    const { logoLight, logoDark, favicon, updateBrandSettings } = useBrand();
    const [sidebarStyle, setSidebarStyle] = useState({});

    useEffect(() => {

        // Apply styles based on sidebar style
        if (style === 'colored') {
            setSidebarStyle({ backgroundColor: 'var(--primary)', color: 'white' });
        } else if (style === 'gradient') {
            setSidebarStyle({
                background: 'linear-gradient(to bottom, var(--primary), color-mix(in srgb, var(--primary), transparent 20%))',
                color: 'white'
            });
        } else {
            setSidebarStyle({});
        }
    }, [style]);

    const filteredNavItems = mainNavItems;
    
    // Get the first available menu item's href for logo link
    const getFirstAvailableHref = () => {
        if (filteredNavItems.length === 0) return route('dashboard');
        
        const firstItem = filteredNavItems[0];
        if (firstItem.href) {
            return firstItem.href;
        } else if (firstItem.children && firstItem.children.length > 0) {
            return firstItem.children[0].href || route('dashboard');
        }
        return route('dashboard');
    };

    return (
        <Sidebar
            side={position}
            collapsible={collapsible}
            variant={variant}
            className={style !== 'plain' ? 'sidebar-custom-style' : ''}
        >
            <SidebarHeader className={style !== 'plain' ? 'sidebar-styled' : ''} style={sidebarStyle}>
                <div className="flex justify-center items-center">
                    <Link href={getFirstAvailableHref()} prefetch className="flex items-center justify-center">
                        {/* Logo for expanded sidebar */}
                        <div className="group-data-[collapsible=icon]:hidden flex items-center">
                            {(() => {
                                const isDark = document.documentElement.classList.contains('dark');
                                const currentLogo = isDark ? logoLight : logoDark;
                                
                                return currentLogo ? (
                                    <img loading="lazy"
                                        key={`${currentLogo}-${Date.now()}`}
                                        src={getImageUrl(currentLogo)}
                                        alt="Logo"
                                        className="w-auto h-6 object-contain transition-all duration-200"
                                        onError={() => updateBrandSettings({ [isDark ? 'logoLight' : 'logoDark']: '' })}
                                    />
                                ) : (
                                    <div className="h-8 text-inherit font-semibold flex items-center text-lg tracking-tight">
                                        {titleText || 'Nashmi Store'}
                                    </div>
                                );
                            })()} 
                        </div>

                        {/* Icon for collapsed sidebar */}
                        <div className="h-8 w-8 hidden group-data-[collapsible=icon]:block">
                            {(() => {
                                return favicon ? (
                                    <img loading="lazy"
                                        key={`${favicon}-${Date.now()}`}
                                        src={getImageUrl(favicon)}
                                        alt="Icon"
                                        className="h-8 w-8 transition-all duration-200"
                                        onError={() => updateBrandSettings({ favicon: '' })}
                                    />
                                ) : (
                                    <div className="h-8 w-8 bg-primary text-white rounded flex items-center justify-center font-bold shadow-sm">
                                        W
                                    </div>
                                );
                            })()} 
                        </div>
                    </Link>
                </div>
                
                {/* Business Switcher - Only show for company users */}
                {userRole !== 'superadmin' && businesses.length > 0 && (
                    <div className="px-2 pb-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    className="w-full justify-between h-8 px-2 text-xs group-data-[collapsible=icon]:hidden"
                                    style={{ color: style !== 'plain' ? 'inherit' : undefined }}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Building2 className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">{currentBusiness?.name || t('Select Business')}</span>
                                    </div>
                                    <ChevronDown className="h-3 w-3 flex-shrink-0" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                {businesses.length > 0 ? (
                                    businesses.map((business: any) => (
                                        <DropdownMenuItem 
                                            key={business.id}
                                            onClick={() => handleBusinessSwitch(business.id)}
                                            className={business.id === auth.user?.current_store ? 'bg-accent' : ''}
                                        >
                                            <Building2 className="h-4 w-4 mr-2" />
                                            <span className="truncate">{business.name}</span>
                                            {business.id === auth.user?.current_store && (
                                                <span className="ml-auto text-xs text-muted-foreground">Current</span>
                                            )}
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <DropdownMenuItem disabled>
                                        <span className="text-muted-foreground">No businesses found</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                <div style={sidebarStyle} className={`h-full ${style !== 'plain' ? 'sidebar-styled' : ''}`}>
                    <NavMain items={filteredNavItems} position={position} />
                </div>
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" position={position} /> */}
                {/* Profile menu moved to header */}
            </SidebarFooter>
        </Sidebar>
    );
}