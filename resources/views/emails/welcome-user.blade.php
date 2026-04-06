@extends('emails.base-layout')

@section('title', 'مرحباً بك في متجر نشمي - Welcome to Nashmi Store')
@section('preheader', 'تم إنشاء حسابك بنجاح - Your account has been created successfully')
@section('icon', '👋')

@section('content_ar')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    مرحباً بك في متجر نشمي!
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مرحباً {{ $userName ?? '' }}،
</p>
<p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    تم إنشاء حسابك بنجاح في <strong style="color: #6366f1;">متجر نشمي</strong>. إليك تفاصيل تسجيل الدخول:
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
    <tr>
        <td style="padding: 18px 20px; direction: rtl; text-align: right;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #6b7280; width: 120px; text-align: right;">البريد الإلكتروني:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #1f2937; font-weight: 600; text-align: right;">{{ $userEmail ?? '' }}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #6b7280; text-align: right;">كلمة المرور:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #1f2937; font-weight: 600; text-align: right;">{{ $userPassword ?? '********' }}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #6b7280; text-align: right;">نوع الحساب:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #1f2937; font-weight: 600; text-align: right;">{{ $userType ?? 'مستخدم' }}</td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9ca3af;">
    يرجى الحفاظ على هذه المعلومات آمنة وتغيير كلمة المرور بعد أول تسجيل دخول.
</p>
@endsection

@section('content_en')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    Welcome to Nashmi Store!
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Hello {{ $userName ?? 'there' }},
</p>
<p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Your account has been successfully created on <strong style="color: #6366f1;">Nashmi Store</strong>. Here are your login details:
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
    <tr>
        <td style="padding: 18px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #6b7280; width: 100px;">Email:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #1f2937; font-weight: 600;">{{ $userEmail ?? '' }}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #6b7280;">Password:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #1f2937; font-weight: 600;">{{ $userPassword ?? '********' }}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #6b7280;">Type:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #1f2937; font-weight: 600;">{{ $userType ?? 'User' }}</td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9ca3af;">
    Please keep this information secure and change your password after first login.
</p>
@endsection

@section('cta_url', $loginUrl ?? url('/login'))
@section('cta_text_ar', 'تسجيل الدخول')
@section('cta_text_en', 'Login Now')
