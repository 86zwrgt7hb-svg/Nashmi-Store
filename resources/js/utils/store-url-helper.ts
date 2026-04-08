
/**
 * Generate a store URL, handling custom domains/subdomains.
 * If a custom domain is active, it omits the 'store/{slug}' prefix.
 */
export const generateStoreUrl = (routeName: string, store: any, params: any = {}) => {
    // Use the global route() function
    if (typeof (window as any).route !== 'function') {
        return '';
    }

    const route = (window as any).route;

    // Always include storeSlug for Ziggy to avoid "parameter required" errors,
    // but we will strip it from the generated URL if custom domain is active.
    const routeUrl = route(routeName, { storeSlug: store?.slug, ...params });

    if (store?.enable_custom_domain || store?.enable_custom_subdomain) {
        // If it's a store route (prefix /store/slug), strip that segment for clean URLs
        const storePrefix = `/store/${store?.slug}`;
        if (routeUrl.includes(storePrefix)) {
            return routeUrl.replace(storePrefix, '');
        }
        return routeUrl;
    }

    return routeUrl;
};
