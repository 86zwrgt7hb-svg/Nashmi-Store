import { useStoreLanguage } from '../../shared/StoreLanguageContext';
import React from 'react';
import { getImageUrl } from '../../../utils/image-helper';
import { formatCurrency } from '../../../utils/currency-formatter';

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
  const storeSettings = (window as any).page?.props?.storeSettings || {};
  const { getLocalizedField, isArabic } = useStoreLanguage();
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-rose-50 shadow-2xl flex flex-col">
        {/* Elegant Header */}
        <div className="bg-white border-b border-rose-200">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-gray-900">{isArabic ? "سلة التسوق" : "Shopping Cart"}</h2>
                <p className="text-sm text-rose-600 font-medium">{cartItems.length} {cartItems.length === 1 ? 'item' : 'pieces'} selected</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-100 rounded-full transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto sm:px-6 px-4 py-4">
          {cartItems.length === 0 ? (
            <div className="text-center mt-24">
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-12 h-12 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-3">Your bag awaits</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">Discover our curated collection<br/>and add your favorite pieces</p>
              <button
                onClick={onClose}
                className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="group bg-white rounded-3xl p-4 shadow-sm border border-rose-100 hover:shadow-lg hover:border-rose-200 transition-all duration-300">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
                        <img loading="lazy" 
                          src={getImageUrl(item.image)} 
                          alt={getLocalizedField(item, 'name')} 
                          onClick={() => onProductClick(item)}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                        {item.quantity}
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 
                          onClick={() => onProductClick(item)}
                          className="font-serif font-semibold text-gray-900 text-base leading-tight cursor-pointer hover:text-rose-600 transition-colors line-clamp-2"
                        >
                          {getLocalizedField(item, 'name')}
                        </h3>
                        <button 
                          onClick={() => onRemoveFromCart(index)}
                          className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Variants */}
                      {(() => {
                        const variants = typeof item.variants === 'string' ? JSON.parse(item.variants) : item.variants;
                        return variants && Object.keys(variants).length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {Object.entries(variants).map(([key, value]) => (
                              <span key={key} className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-medium">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                      
                      {/* Price and Quantity */}
                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-rose-600">
                            {formatCurrency(item.price * item.quantity, storeSettings, currencies)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatCurrency(item.price, storeSettings, currencies)} each
                          </span>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-rose-50 rounded-full p-1 border border-rose-200">
                          <button 
                            onClick={() => item.quantity > 1 && onUpdateQuantity(index, -1)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                              item.quantity > 1 
                                ? 'bg-white text-rose-600 hover:bg-rose-100 shadow-sm cursor-pointer' 
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => onUpdateQuantity(index, 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white text-rose-600 hover:bg-rose-100 rounded-full text-sm font-bold shadow-sm cursor-pointer transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Tax Info */}
                      {item.taxName && item.taxPercentage && (
                        <p className="text-xs text-gray-400 mt-2 italic">
                          {item.taxName}: {item.taxPercentage}% ({formatCurrency((item.price * item.quantity * item.taxPercentage) / 100, storeSettings, currencies)})
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Checkout Section */}
        {cartItems.length > 0 && (
          <div className="bg-white border-t border-rose-200 p-6">
            {/* Summary */}
            <div className="bg-rose-50 rounded-2xl p-5 mb-4 border border-rose-100">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">{isArabic ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(subtotal, storeSettings, currencies)}</span>
                </div>
                {totalTax > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">{isArabic ? "الضريبة" : "Tax"}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(totalTax, storeSettings, currencies)}</span>
                  </div>
                )}
                <div className="h-px bg-rose-200 my-3"></div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-serif font-bold text-gray-900">{isArabic ? "الإجمالي" : "Total"}</span>
                  <span className="text-2xl font-bold text-rose-600">
                    {formatCurrency(total, storeSettings, currencies)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Checkout Button */}
            <button 
              onClick={onCheckout}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span>{language === "ar" ? "إتمام الطلب" : "Proceed to Checkout"}</span>
            </button>
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-serif font-bold py-4 px-6 rounded-full transition-colors shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
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