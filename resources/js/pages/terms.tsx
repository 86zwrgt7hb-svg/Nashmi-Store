import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Terms() {
    const { t } = useTranslation();
    
    return (
        <>
            <Head title={t('Terms and Conditions')} />
            <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        {t('Terms and Conditions')}
                    </h1>
                    
                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">1. {t('Introduction')}</h2>
                            <p>{t('Welcome to Nashmi Store. By using our platform, you agree to these terms and conditions.')}</p>
                        </section>
                        
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">2. {t('Use of Service')}</h2>
                            <p>{t('Our platform provides e-commerce solutions. You must use the service in compliance with applicable laws and regulations.')}</p>
                        </section>
                        
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">3. {t('Privacy')}</h2>
                            <p>{t('We respect your privacy and protect your personal data in accordance with our privacy policy.')}</p>
                        </section>
                        
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">4. {t('Liability')}</h2>
                            <p>{t('Nashmi Store is not liable for any indirect damages arising from the use of the platform.')}</p>
                        </section>
                        
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">5. {t('Contact')}</h2>
                            <p>{t('For any questions about these terms, please contact us at info@urdun-tech.com')}</p>
                        </section>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <a href="/" className="text-blue-600 hover:underline">{t('Back to Home')}</a>
                    </div>
                </div>
            </div>
        </>
    );
}
