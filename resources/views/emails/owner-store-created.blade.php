@extends('emails.base-layout')

@section('title', 'متجرك جاهز! - Your Store is Ready!')
@section('preheader', 'تم إنشاء متجرك بنجاح - Your store has been created successfully')
@section('icon', '🏪')

@section('content_ar')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    متجرك جاهز!
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مرحباً <strong>{{ $ownerName ?? '' }}</strong>،
</p>
<p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    أهلاً بك في <strong style="color: #6366f1;">متجر نشمي</strong>! تم إنشاء متجرك بنجاح وهو جاهز للعمل. إليك التفاصيل:
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
    <tr>
        <td style="padding: 18px 20px; direction: rtl; text-align: right;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #166534; width: 120px; text-align: right;">البريد الإلكتروني:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #166534; font-weight: 600; text-align: right;">{{ $ownerEmail ?? '' }}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #166534; text-align: right;">كلمة المرور:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #166534; font-weight: 600; text-align: right;">{{ $ownerPassword ?? '********' }}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #166534; text-align: right;">رابط المتجر:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #166534; font-weight: 600; text-align: right;">
                        <a href="{{ $storeUrl ?? '#' }}" style="color: #6366f1; text-decoration: none;">{{ $storeUrl ?? '' }}</a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
    ابدأ بإضافة منتجاتك وتخصيص متجرك لبدء البيع!
</p>
@endsection

@section('content_en')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    Your Store is Ready!
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Hello <strong>{{ $ownerName ?? 'there' }}</strong>,
</p>
<p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Welcome to <strong style="color: #6366f1;">Nashmi Store</strong>! Your store has been successfully created and is ready to go. Here are your details:
</p>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0; background-color: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
    <tr>
        <td style="padding: 18px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #166534; width: 100px;">Email:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #166534; font-weight: 600;">{{ $ownerEmail ?? '' }}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #166534;">Password:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #166534; font-weight: 600;">{{ $ownerPassword ?? '********' }}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #166534;">Store URL:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #166534; font-weight: 600;">
                        <a href="{{ $storeUrl ?? '#' }}" style="color: #6366f1; text-decoration: none;">{{ $storeUrl ?? '' }}</a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
    Start adding your products and customizing your store to begin selling!
</p>
@endsection

@section('cta_url', $appUrl ?? url('/'))
@section('cta_text_ar', 'الذهاب للوحة التحكم')
@section('cta_text_en', 'Go to Dashboard')
