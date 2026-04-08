<?php

namespace App\Security;

/**
 * Single source of truth for all sensitive configuration keys
 * that must never be exposed to the frontend.
 * 
 * Used by HandleInertiaRequests and DomainResolver middleware
 * to sanitize settings before sharing via Inertia.
 */
class SensitiveKeys
{
    /**
     * All sensitive keys that must be stripped from settings
     * before passing to the frontend via Inertia shared data.
     */
    public const KEYS = [
        // AI / ChatGPT
        'chatgptKey', 'chatgptModel',

        // Email / SMTP
        'email_password', 'email_host', 'email_port',
        'email_username', 'email_encryption', 'email_driver', 'email_provider',

        // reCAPTCHA
        'recaptchaSecretKey',

        // AWS S3
        'aws_access_key_id', 'aws_secret_access_key', 'aws_bucket', 'aws_endpoint', 'aws_url',

        // Wasabi Storage
        'wasabi_access_key', 'wasabi_secret_key', 'wasabi_bucket', 'wasabi_region', 'wasabi_root', 'wasabi_url',

        // Stripe
        'stripeKey', 'stripeSecret',

        // PayPal
        'paypalClientId', 'paypalSecret',

        // Razorpay
        'razorpayKey', 'razorpaySecret',

        // Paystack
        'paystackPublicKey', 'paystackSecretKey',

        // OpenAI / Resend
        'openaiApiKey', 'resendApiKey',

        // SMTP Password (alternate key)
        'smtpPassword',

        // Xendit
        'xenditSecretKey',

        // ToyyibPay
        'toyyibpaySecretKey',

        // Cashfree
        'cashfreeSecretKey', 'cashfreeAppId',

        // Flutterwave
        'flutterwaveSecretKey', 'flutterwaveEncryptionKey', 'flutterwavePublicKey',

        // PayTabs
        'paytabsServerKey', 'paytabsProfileId',

        // MercadoPago
        'mercadopagoAccessToken',

        // Mollie
        'mollieApiKey',

        // Skrill
        'skrillMerchantEmail', 'skrillSecretWord',

        // PayTR
        'paytrMerchantKey', 'paytrMerchantSalt',

        // Iyzipay
        'iyzipayApiKey', 'iyzipaySecretKey',

        // Tap
        'tapSecretKey',

        // Benefit
        'benefitApiKey', 'benefitSecretKey',

        // Ozow
        'ozowApiKey', 'ozowPrivateKey', 'ozowSiteCode',

        // Easebuzz
        'easebuzzKey', 'easebuzzSalt',

        // Khalti
        'khaltiSecretKey',

        // Authorize.net
        'authorizenetApiLoginId', 'authorizenetTransactionKey',

        // FedaPay
        'fedapaySecretKey',

        // PayHere
        'payhereSecretKey', 'payhereMerchantId',

        // CinetPay
        'cinetpayApiKey', 'cinetpaySiteId',

        // Paiement
        'paiementApiKey',

        // Nepalste
        'nepalsteSecretKey',

        // YooKassa
        'yookassaSecretKey', 'yookassaShopId',

        // Aamarpay
        'aamarpayStoreId', 'aamarpaySignatureKey',

        // Midtrans
        'midtransServerKey', 'midtransClientKey',

        // PaymentWall
        'paymentwallSecretKey',

        // SSPay
        'sspaySecretKey',

        // CoinGate
        'coingateApiToken',

        // PayFast
        'payfastMerchantKey', 'payfastPassphrase',

        // Twilio
        'twilioAuthToken', 'twilioAccountSid',

        // Telegram Bot
        'telegram_bot_token',

        // Google OAuth
        'googleClientId', 'googleClientSecret',
    ];

    /**
     * Remove all sensitive keys from a settings array.
     */
    public static function sanitize(array $settings): array
    {
        foreach (self::KEYS as $key) {
            unset($settings[$key]);
        }
        return $settings;
    }
}
