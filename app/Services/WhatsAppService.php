<?php
namespace App\Services;
use App\Models\Order;
use App\Models\StoreConfiguration;
use Illuminate\Support\Facades\Log;
class WhatsAppService
{
    public function sendOrderConfirmation(Order $order, string $whatsappNumber): bool
    {
        $store = $order->store;
        if (!$store) return false;
        $cleanNumber = $this->cleanNumber($whatsappNumber);
        if (!$cleanNumber) return false;
        $message = $this->buildMessage($order);
        $whatsappUrl = "https://wa.me/{$cleanNumber}?text=" . urlencode($message);
        
        // Store in session for backend and also prepare for frontend
        session([
            'whatsapp_redirect_url' => $whatsappUrl,
            'whatsapp_order_id' => $order->id
        ]);
        
        // Also store in a way that frontend can access via JavaScript
        session()->flash('whatsapp_data', [
            'url' => $whatsappUrl,
            'order_id' => $order->id
        ]);
        
        return true;
    }
    private function buildMessage(Order $order): string
    {
        $store = $order->store;
        $template = $this->getTemplate($store->user_id, $store->id);
        $itemTemplate = $this->getItemTemplate($store->user_id, $store->id);
        
        // Normalize line breaks: convert literal \n to actual newlines
        $template = str_replace('\n', "\n", $template);
        $itemTemplate = str_replace('\n', "\n", $itemTemplate);
        
        $items = '';
        foreach ($order->items as $item) {
            $variants = $item->product_variants;
            if (is_array($variants) && !empty($variants)) {
                $variant = implode(', ', $variants);
            } elseif (is_string($variants) && $variants && $variants !== '[]' && $variants !== 'null') {
                $variant = $variants;
            } else {
                $variant = '-';
            }
            
            // Get actual tax from order item tax_details
            $itemTax = 0;
            if ($item->tax_details) {
                $taxDetails = json_decode($item->tax_details, true);
                $itemTax = $taxDetails['tax_amount'] ?? 0;
            }
            
            $items .= str_replace(
                ['{product_name}', '{variant_name}', '{quantity}', '{item_total}', '{item_tax}', '{sku}'],
                [$item->product_name, $variant, $item->quantity, number_format($item->total_price, 2), number_format($itemTax, 2), $item->product_sku ?? 'N/A'],
                $itemTemplate
            ) . "\n";
        }

        $variables = [
            '{store_name}' => $store->name,
            '{order_no}' => $order->order_number,
            '{customer_name}' => trim($order->customer_first_name . ' ' . $order->customer_last_name),
            '{shipping_address}' => $order->shipping_address ?? '',
            '{shipping_city}' => '',
            '{shipping_country}' => '',
            '{shipping_postalcode}' => '',
            '{item_variable}' => trim($items),
            '{qty_total}' => $order->items->sum('quantity'),
            '{sub_total}' => number_format($order->subtotal, 2),
            '{discount_amount}' => number_format($order->discount_amount, 2),
            '{shipping_amount}' => number_format($order->shipping_amount, 2),
            '{total_tax}' => number_format($order->tax_amount, 2),
            '{final_total}' => number_format($order->total_amount, 2),
            '{order_date}' => $order->created_at->format('d/m/Y H:i'),
            '{payment_method}' => ucfirst($order->payment_method),
        ];
        return str_replace(array_keys($variables), array_values($variables), $template);
    }
    private function formatAddress(Order $order, string $type): string
    {
        $address = $order->{$type . '_address'};
        $parts = array_filter([$address]);
        return implode(', ', $parts);
    }
    private function getTemplate(int $userId, int $storeId): string
    {
        return getSetting('messaging_message_template', 
            "طلب جديد من {store_name}\nNew Order from {store_name}\n========================\nرقم الطلب | Order #: {order_no}\nالتاريخ | Date: {order_date}\n========================\nالعميل | Customer: {customer_name}\nالهاتف | Phone: -\nالعنوان | Address: {shipping_address}\n========================\nالمنتجات | Items ({qty_total}):\n{item_variable}\n========================\nالمجموع الفرعي | Subtotal: {sub_total}\nالخصم | Discount: {discount_amount}\nالشحن | Shipping: {shipping_amount}\nالضريبة | Tax: {total_tax}\nالإجمالي | Total: {final_total}\n========================\nشكرا لتسوقكم معنا!\nThank you for shopping with us!",
            $userId, $storeId
        );
    }
    private function getItemTemplate(int $userId, int $storeId): string
    {
        return getSetting('messaging_item_template', 
            "- {product_name} ({variant_name}) x{quantity} = {item_total}",
            $userId, $storeId
        );
    }
    private function cleanNumber(string $number): ?string
    {
        $cleaned = preg_replace('/[^0-9]/', '', $number);
        return (strlen($cleaned) >= 10 && strlen($cleaned) <= 15) ? $cleaned : null;
    }
    public static function getWhatsAppRedirectUrl(): ?string
    {
        return session('whatsapp_redirect_url');
    }
    public static function clearWhatsAppSession(): void
    {
        session()->forget(['whatsapp_redirect_url', 'whatsapp_order_id']);
    }
}
