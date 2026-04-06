import React from 'react';
import { getImageUrl } from '../../../utils/image-helper';
import { formatCurrency } from '../../../utils/currency-formatter';
import { useStoreLanguage } from '../../shared/StoreLanguageContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stockQuantity: number;
  taxName?: string;
  taxPercentage?: number;
  variants?: {[key: string]: string} | null;
}

interface CartDrawerProps {
  cartItems: CartItem[];
  currency: string;
  onClose: () => void;
  onRemoveFromCart: (index: number) => void;
  onUpdateQuantity: (index: number, change: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
  onProductClick: (item: CartItem) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  cartItems,
  currency,
  onClose,
  onRemoveFromCart,
  onUpdateQuantity,
  onQuantityChange,
  onProductClick,
  onCheckout
}) => {
  const { getLocalizedField, isArabic } = useStoreLanguage();
  const storeSettings = (window as any).page?.props?.storeSettings || {};
  const currencies = (window as any).page?.props?.currencies || [];
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalTax = cartItems.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const taxAmount = item.taxPercentage ? (itemTotal * item.taxPercentage) / 100 : 0;
    return sum + taxAmount;
  }, 0);
  const total = subtotal + totalTax;

  const { language } = useStoreLanguage();

  const handleWhatsAppOrder = () => {
    const config = (window as any).page?.props?.config || {};
    const phone = (config.whatsapp_payment_number || "").replace(/[^0-9]/g, "");
    if (!phone) return;
    
    const isAr = language === 'ar';
    const greeting = isAr ? 'مرحبا' : 'Hello';
    const orderIntro = isAr ? 'حاب اطلب:' : 'I would like to order:';
    const totalLbl = isAr ? 'المجموع: ' : 'Total: ';
    
    const itemsList = cartItems.map(item => {
      const itemName = isAr ? (getLocalizedField(item, 'name') || item.name) : item.name;
      return '- ' + itemName + ' (x' + item.quantity + ')';
    }).join('\n');
    
    const fullMessage = greeting + '\n' + orderIntro + '\n' + itemsList + '\n\n' + totalLbl + formatCurrency(total, storeSettings, currencies);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(fullMessage)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 px-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{language === "ar" ? "سلة التسوق" : "Shopping Cart"}</h2>
              <span className="text-xs text-gray-500">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 px-6 bg-gray-50">
          {cartItems.length === 0 ? (
            <div className="text-center mt-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{language === "ar" ? "سلتك فارغة" : "Your cart is empty"}</h3>
              <p className="text-gray-500 text-sm mb-6">Add some products to get started</p>
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
              >{isArabic ? "متابعة التسوق" : "Continue Shopping"}</button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div>
                      <img loading="lazy" 
                        src={getImageUrl(item.image)} 
                        alt={getLocalizedField(item, 'name')} 
                        onClick={() => onProductClick(item)}
                        loading="lazy"
                        className="w-16 h-16 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity" 
                      />
                    </div>
                    <div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : ''}`}>
                      <h3 
                        onClick={() => onProductClick(item)}
                        className="font-semibold text-gray-900 mb-1 text-sm leading-tight cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        {getLocalizedField(item, 'name')}
                      </h3>
                      {(() => {
                        const variants = typeof item.variants === 'string' ? JSON.parse(item.variants) : item.variants;
                        return variants && Object.keys(variants).length > 0 && (
                          <div className="text-xs text-gray-500 mb-1">
                            {Object.entries(variants).map(([key, value], index) => (
                              <span key={key}>
                                {key}: {value}
                                {index < Object.keys(variants).length - 1 && ', '}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-blue-600 font-bold text-lg">{formatCurrency(item.price * item.quantity, storeSettings, currencies)}</p>
                        <button 
                          onClick={() => onRemoveFromCart(index)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{formatCurrency(item.price, storeSettings, currencies)} each</span>
                      </div>
                      {item.taxName && item.taxPercentage && (
                        <p className="text-xs text-gray-400 mt-2">
                          {item.taxName}: {item.taxPercentage}% ({formatCurrency((item.price * item.quantity * item.taxPercentage) / 100, storeSettings, currencies)})
                        </p>
                      )}
                      <div className="flex items-center justify-end mt-2">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                          <button 
                            onClick={() => item.quantity > 1 && onUpdateQuantity(index, -1)}
                            className={`w-7 h-7 flex items-center justify-center rounded-md text-white text-sm shadow-sm font-bold leading-none ${
                              item.quantity > 1 ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => onQuantityChange(index, e.target.value)}
                            className="w-8 text-sm font-semibold text-gray-900 text-center bg-transparent border-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min="1"
                          />
                          <button 
                            onClick={() => onUpdateQuantity(index, 1)}
                            className="w-7 h-7 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm cursor-pointer shadow-sm font-bold leading-none"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 px-6 bg-white mt-auto">
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{isArabic ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(subtotal, storeSettings, currencies)}</span>
                </div>
                {totalTax > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Tax</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(totalTax, storeSettings, currencies)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">{isArabic ? "الإجمالي" : "Total"}</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(total, storeSettings, currencies)}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
              </svg>
              {language === "ar" ? "إتمام الطلب" : "Proceed to Checkout"}
            </button>
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {language === "ar" ? "اطلب عبر واتساب" : "Order via WhatsApp"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};