<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('title', 'متجر نشمي - Nashmi Store')</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        /* Reset */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
        
        /* Typography */
        .en-text { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: ltr; text-align: left; }
        .ar-text { font-family: 'Segoe UI', Tahoma, 'Arabic Typesetting', 'Traditional Arabic', sans-serif; direction: rtl; text-align: right; }
        
        /* Responsive */
        @media only screen and (max-width: 620px) {
            .email-container { width: 100% !important; max-width: 100% !important; }
            .fluid { max-width: 100% !important; height: auto !important; }
            .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
            .center-on-narrow { text-align: center !important; display: block !important; margin-left: auto !important; margin-right: auto !important; float: none !important; }
            table.center-on-narrow { display: inline-block !important; }
            .padding-mobile { padding: 15px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; -webkit-font-smoothing: antialiased;">
    <!-- Preheader (hidden preview text) -->
    <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
        @yield('preheader', 'متجر نشمي - Nashmi Store')
    </div>

    <center style="width: 100%; background-color: #f4f6f9;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto;" class="email-container">
            
            <!-- Header -->
            <tr>
                <td style="padding: 30px 0 20px 0; text-align: center;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="text-align: center; padding: 0 40px;">
                                <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #6366f1; font-family: 'Segoe UI', Tahoma, 'Arabic Typesetting', sans-serif;">
                                    متجر نشمي
                                </h1>
                                <p style="margin: 5px 0 0 0; font-size: 14px; color: #9ca3af; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                    Nashmi Store
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Body -->
            <tr>
                <td style="padding: 0 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                        
                        <!-- Icon/Emoji Header -->
                        @hasSection('icon')
                        <tr>
                            <td style="padding: 30px 40px 10px 40px; text-align: center;">
                                <div style="font-size: 48px; line-height: 1;">@yield('icon')</div>
                            </td>
                        </tr>
                        @endif

                        <!-- Arabic Content (TOP) -->
                        <tr>
                            <td class="ar-text padding-mobile" style="padding: 25px 40px 15px 40px; font-family: 'Segoe UI', Tahoma, 'Arabic Typesetting', 'Traditional Arabic', sans-serif; direction: rtl; text-align: right;">
                                @yield('content_ar')
                            </td>
                        </tr>

                        <!-- Divider -->
                        <tr>
                            <td style="padding: 10px 40px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="border-top: 1px dashed #e5e7eb; font-size: 0; line-height: 0;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- English Content (BOTTOM) -->
                        <tr>
                            <td class="en-text padding-mobile" style="padding: 15px 40px 25px 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: ltr; text-align: left;">
                                @yield('content_en')
                            </td>
                        </tr>

                        <!-- CTA Button (if needed) -->
                        @hasSection('cta_url')
                        <tr>
                            <td style="padding: 10px 40px 30px 40px; text-align: center;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                    <tr>
                                        <td style="border-radius: 10px; background-color: #6366f1;">
                                            <a href="@yield('cta_url')" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                                @yield('cta_text_ar', 'اضغط هنا') | @yield('cta_text_en', 'Click Here')
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        @endif

                    </table>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="padding: 30px 40px; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <p style="margin: 0 0 10px 0; font-size: 13px; color: #9ca3af; font-family: 'Segoe UI', Tahoma, 'Arabic Typesetting', sans-serif; direction: rtl;">
                        متجر نشمي &mdash; منصة متجرك على واتساب
                    </p>
                    <p style="margin: 0 0 10px 0; font-size: 13px; color: #9ca3af;">
                        Nashmi Store &mdash; Your WhatsApp Store Platform
                    </p>
                    <p style="margin: 0 0 5px 0; font-size: 12px; color: #d1d5db;">
                        <a href="https://ns.urdun-tech.com" style="color: #6366f1; text-decoration: none;">ns.urdun-tech.com</a>
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #d1d5db;">
                        &copy; {{ date('Y') }} جميع الحقوق محفوظة | All rights reserved
                    </p>
                </td>
            </tr>

        </table>
    </center>
</body>
</html>
