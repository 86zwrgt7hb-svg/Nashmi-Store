@extends('emails.base-layout')

@section('title', 'إعادة تعيين كلمة المرور - Reset Your Password')
@section('preheader', 'لقد طلبت إعادة تعيين كلمة المرور - You requested a password reset')
@section('icon', '🔐')

@section('content_ar')
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
    إعادة تعيين كلمة المرور
</h2>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    مرحباً،
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    تلقيت هذا البريد لأننا استلمنا طلب إعادة تعيين كلمة المرور لحسابك في <strong style="color: #6366f1;">متجر نشمي</strong>.
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    اضغط على الزر أدناه لإعادة تعيين كلمة المرور. ستنتهي صلاحية هذا الرابط خلال <strong>60 دقيقة</strong>.
</p>
<p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9ca3af;">
    إذا لم تطلب إعادة تعيين كلمة المرور، لا يلزم اتخاذ أي إجراء. ستبقى كلمة المرور كما هي.
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
    You are receiving this email because we received a password reset request for your <strong style="color: #6366f1;">Nashmi Store</strong> account.
</p>
<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.7; color: #4b5563;">
    Click the button below to reset your password. This link will expire in <strong>60 minutes</strong>.
</p>
<p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9ca3af;">
    If you did not request a password reset, no further action is required. Your password will remain unchanged.
</p>
@endsection

@section('cta_url', $resetUrl)
@section('cta_text_ar', 'إعادة تعيين')
@section('cta_text_en', 'Reset Password')
