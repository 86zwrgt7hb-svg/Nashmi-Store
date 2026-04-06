@extends('emails.base-layout')

@section('title', 'إعادة تعيين كلمة المرور - Reset Your Password')
@section('preheader', 'إعادة تعيين كلمة مرور حساب المتجر - Reset your store account password')
@section('icon', '🔑')

@section('content_ar')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    إعادة تعيين كلمة المرور
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مرحباً،
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    لقد طلبت إعادة تعيين كلمة المرور لحسابك في <strong style="color: #6366f1;">{{ $storeSlug ?? 'متجرنا' }}</strong>. اضغط على الزر أدناه لإعادة تعيين كلمة المرور.
</p>
<p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9ca3af;">
    إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد. ستبقى كلمة المرور كما هي.
</p>
@endsection

@section('content_en')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    Reset Your Password
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Hello,
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    You requested a password reset for your account at <strong style="color: #6366f1;">{{ $storeSlug ?? 'our store' }}</strong>. Click the button below to reset your password.
</p>
<p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9ca3af;">
    If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
</p>
@endsection

@section('cta_url', $resetUrl)
@section('cta_text_ar', 'إعادة تعيين')
@section('cta_text_en', 'Reset Password')
