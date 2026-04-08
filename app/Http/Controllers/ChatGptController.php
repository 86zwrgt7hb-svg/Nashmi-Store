<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Setting;
use OpenAI;

class ChatGptController extends Controller
{
    public function generate(Request $request): JsonResponse
    {
        $request->validate([
            'prompt' => 'required|string|max:1000',
            'language' => 'string|in:en,es,ar,da,de,fr,he,it,ja,nl,pl,pt,pt-BR,ru,tr,zh',
            'creativity' => 'string|in:low,medium,high',
            'num_results' => 'integer|min:1|max:5',
            'max_length' => 'integer|min:1|max:500'
        ]);

        try {
            $apiKey = Setting::where('key', 'chatgptKey')->value('value');
            $model = Setting::where('key', 'chatgptModel')->value('value') ?? 'gpt-3.5-turbo';
            
            if (!$apiKey) {
                return response()->json([
                    'success' => false,
                    'message' => __('Please set proper configuration for Api Key')
                ]);
            }

            $temperature = (float) $request->input('creativity', 0.7);
            if (is_string($request->input('creativity'))) {
                $temperature = match($request->input('creativity')) {
                    'low' => 0.3,
                    'high' => 0.9,
                    default => 0.7
                };
            }
            
            $language = $request->input('language', 'en');
            $langText = $language !== 'en' ? "Provide response in " . match($language) {
                'es' => 'Spanish',
                'ar' => 'Arabic',
                'da' => 'Danish',
                'de' => 'German',
                'fr' => 'French',
                'he' => 'Hebrew',
                'it' => 'Italian',
                'ja' => 'Japanese',
                'nl' => 'Dutch',
                'pl' => 'Polish',
                'pt' => 'Portuguese',
                'pt-BR' => 'Brazilian Portuguese',
                'ru' => 'Russian',
                'tr' => 'Turkish',
                'zh' => 'Chinese',
                default => 'English'
            } . " language.\n\n " : "";

            $maxTokens = (int) $request->input('max_length', 150);
            $maxResults = (int) $request->input('num_results', 1);

            $client = OpenAI::client($apiKey);
            
            $response = $client->chat()->create([
                'model' => $model,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $request->prompt . ' ' . $langText
                    ]
                ],
                'max_tokens' => $maxTokens,
                'temperature' => $temperature,
                'n' => $maxResults
            ]);

            if (isset($response->choices)) {
                $text = '';
                $counter = 1;
                
                if (count($response->choices) > 1) {
                    foreach ($response->choices as $choice) {
                        $text .= $counter . '. ' . trim($choice->message->content) . "\r\n\r\n\r\n";
                        $counter++;
                    }
                } else {
                    $text = $response->choices[0]->message->content;
                }

                return response()->json([
                    'success' => true,
                    'content' => trim($text)
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => __('Text was not generated, please try again')
                ]);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    public function generateContent(Request $request): JsonResponse
    {
        $request->validate([
            'context_name' => 'required|string|max:500',
            'field_type' => 'required|string|in:description,specifications,category_description,seo_description,meta_keywords',
            'language' => 'required|string|in:en,ar',
            'category_name' => 'nullable|string|max:200',
        ]);

        try {
            $apiKey = Setting::where('key', 'chatgptKey')->value('value');
            $model = Setting::where('key', 'chatgptModel')->value('value') ?? 'gpt-4o-mini';

            if (!$apiKey) {
                return response()->json([
                    'success' => false,
                    'message' => __('AI API key is not configured. Please set it in Settings > ChatGPT.')
                ], 400);
            }

            $contextName = $request->input('context_name');
            $fieldType = $request->input('field_type');
            $language = $request->input('language');
            $categoryName = $request->input('category_name', '') ?? '';

            $prompt = $this->buildContentPrompt($contextName, $fieldType, $language, $categoryName);
            $systemPrompt = $language === 'ar'
                ? 'أنت مساعد متخصص في كتابة محتوى المتاجر الإلكترونية باللغة العربية. اكتب محتوى احترافي وجذاب يساعد في بيع المنتجات. لا تستخدم عناوين أو ترقيم. اكتب بأسلوب تسويقي مباشر وواضح.'
                : 'You are an expert e-commerce content writer. Write professional, engaging content that helps sell products. Do not use headings or numbering. Write in a direct, clear marketing style.';

            $maxTokens = match($fieldType) {
                'description' => 300,
                'specifications' => 250,
                'category_description' => 100,
                'seo_description' => 60,
                'meta_keywords' => 50,
                default => 200
            };

            $client = \OpenAI::client($apiKey);

            $response = $client->chat()->create([
                'model' => $model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'max_tokens' => $maxTokens,
                'temperature' => 0.7,
            ]);

            if (isset($response->choices[0])) {
                $content = trim($response->choices[0]->message->content);
                $content = preg_replace('/^#+\s*/m', '', $content);

                return response()->json([
                    'success' => true,
                    'content' => $content
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => __('Failed to generate content. Please try again.')
            ], 500);

        } catch (\Exception $e) {
            \Log::error('AI Content Generation Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => __('AI service error. Please try again later.')
            ], 500);
        }
    }

    private function buildContentPrompt(string $name, string $fieldType, string $language, string $categoryName = ''): string
    {
        $categoryContext = $categoryName ? ($language === 'ar' ? " في فئة: {$categoryName}" : " in category: {$categoryName}") : '';

        return match($fieldType) {
            'description' => $language === 'ar'
                ? "اكتب وصفاً تسويقياً احترافياً للمنتج \"{$name}\"{$categoryContext}. اجعله جذاباً ومقنعاً للمشتري. 2-3 فقرات قصيرة."
                : "Write a professional marketing description for the product \"{$name}\"{$categoryContext}. Make it engaging and persuasive. 2-3 short paragraphs.",
            'specifications' => $language === 'ar'
                ? "اكتب مواصفات تقنية مفصلة للمنتج \"{$name}\"{$categoryContext}. استخدم نقاط واضحة ومختصرة تشمل المواد والأبعاد والميزات الرئيسية."
                : "Write detailed technical specifications for the product \"{$name}\"{$categoryContext}. Use clear, concise bullet points covering materials, dimensions, and key features.",
            'category_description' => $language === 'ar'
                ? "اكتب وصفاً قصيراً وجذاباً لفئة المنتجات \"{$name}\". جملتين إلى ثلاث جمل تصف الفئة وتشجع التصفح."
                : "Write a short, engaging description for the product category \"{$name}\". 2-3 sentences describing the category and encouraging browsing.",
            'seo_description' => $language === 'ar'
                ? "اكتب وصف SEO مختصر (160 حرف كحد أقصى) للمنتج \"{$name}\"{$categoryContext}."
                : "Write a brief SEO meta description (max 160 characters) for the product \"{$name}\"{$categoryContext}.",
            'meta_keywords' => $language === 'ar'
                ? "اكتب 5-8 كلمات مفتاحية للمنتج \"{$name}\"{$categoryContext}. افصل بينها بفواصل."
                : "Write 5-8 SEO keywords for the product \"{$name}\"{$categoryContext}. Separate with commas.",
            default => "Write content for \"{$name}\"."
        };
    }
}
