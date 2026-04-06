<!DOCTYPE html>
<html lang="ar" dir="rtl" @class(["dark" => ($appearance ?? "system") == "dark"])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="{{ getSetting('metaDescription', 'نشمي ستور - منصة متكاملة لإنشاء متجرك الإلكتروني بسهولة') }}">
        <meta name="keywords" content="{{ getSetting('metaKeywords', 'متجر إلكتروني, نشمي ستور, تجارة إلكترونية, إنشاء متجر') }}">
        <meta name="author" content="Nashmi Store">
        <meta name="robots" content="index, follow">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ getSetting('titleText', config('app.name', 'Nashmi Store')) }}">
        <meta property="og:description" content="{{ getSetting('metaDescription', 'نشمي ستور - منصة متكاملة لإنشاء متجرك الإلكتروني بسهولة') }}">
        <meta property="og:image" content="{{ asset(getSetting('logo', '/images/logos/logo.png')) }}">
        <meta property="og:locale" content="ar_JO">
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ getSetting('titleText', config('app.name', 'Nashmi Store')) }}">
        <meta name="twitter:description" content="{{ getSetting('metaDescription', 'نشمي ستور - منصة متكاملة لإنشاء متجرك الإلكتروني بسهولة') }}">
        <meta name="twitter:image" content="{{ asset(getSetting('logo', '/images/logos/logo.png')) }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ getSetting('titleText', config('app.name', 'Nashmi Store')) }}</title>

        {{-- Dynamic Favicon --}}
        @php
            $favicon = getSetting('favicon', '/images/logos/favicon.png');
            $faviconUrl = $favicon;
            if (!str_starts_with($favicon, 'http')) {
                // Remove leading slash and construct proper URL
                $cleanPath = ltrim($favicon, '/');
                $faviconUrl = rtrim(config('app.url'), '/') . '/' . $cleanPath;
            }
        @endphp
        <link rel="icon" href="{{ $faviconUrl }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ $faviconUrl }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ $faviconUrl }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ $faviconUrl }}">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <script src="{{ asset('js/jquery.min.js') }}"></script>

        <script>
            window.appConfig = {
                url: '{{ config('app.url') }}'
            };
            
            // Set demo mode flag
            window.isDemo = {{ config('app.is_demo') ? 'true' : 'false' }};
            
            // Set base URL for image helper
            window.appSettings = {
                baseUrl: '{{ config('app.url') }}'
            };
        </script>
        
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
