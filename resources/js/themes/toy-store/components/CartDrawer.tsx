import { useStoreLanguage } from '../../shared/StoreLanguageContext';
import React from 'react';
import { getImageUrl } from '../../../utils/image-helper';
import { formatCurrency } from '../../../utils/currency-formatter';
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';

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

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
      <div className="absolute inset-0 bg-purple-900/40" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-purple-100 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-purple-600 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-2 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-6 right-6 w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-3 left-12 w-4 h-4 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-5 right-10 w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{language === "ar" ? "سلة التسوق" : "Shopping Cart"}</h2>
                <p className="text-purple-200 text-sm font-medium">{cartItems.length} items in cart</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-purple-200 hover:text-white hover:bg-purple-500 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ShoppingCart className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-3">{language === "ar" ? "سلتك فارغة" : "Your cart is empty"}</h3>
              <p className="text-purple-600 mb-6">Add some amazing toys to get started!</p>
              <button
                onClick={onClose}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg"
              >{isArabic ? "متابعة التسوق" : "Continue Shopping"}</button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-200 hover:shadow-xl transition-all">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-purple-50 rounded-xl overflow-hidden border-2 border-purple-200">
                        <img loading="lazy" 
                          src={getImageUrl(item.image)} 
                          alt={getLocalizedField(item, 'name')} 
                          onClick={() => onProductClick(item)}
                          className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" 
                        />
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 
                          onClick={() => onProductClick(item)}
                          className="font-bold text-purple-800 text-sm leading-tight cursor-pointer hover:text-purple-600 transition-colors line-clamp-2"
                        >
                          {getLocalizedField(item, 'name')}
                        </h3>
                        <button 
                          onClick={() => onRemoveFromCart(index)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Variants */}
                      {(() => {
                        const variants = typeof item.variants === 'string' ? JSON.parse(item.variants) : item.variants;
                        return variants && Object.keys(variants).length > 0 && (
                          <div className="mb-2">
                            {Object.entries(variants).map(([key, value]) => (
                              <span key={key} className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                      
                      {/* Price */}
                      <div className="bg-purple-50 rounded-xl p-3 mb-3">
                        <div className="text-lg font-bold text-purple-700">
                          {formatCurrency(item.price * item.quantity, storeSettings, currencies)}
                        </div>
                        <div className="text-xs text-purple-600">
                          {formatCurrency(item.price, storeSettings, currencies)} × {item.quantity}
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-purple-700">Quantity:</span>
                        <div className="flex items-center bg-purple-100 rounded-xl">
                          <button 
                            onClick={() => item.quantity > 1 && onUpdateQuantity(index, -1)}
                            className={`w-8 h-8 rounded-l-xl flex items-center justify-center text-sm font-bold transition-all ${
                              item.quantity > 1 ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <div className="w-10 h-8 bg-white flex items-center justify-center border-x-2 border-purple-200">
                            <span className="text-sm font-bold text-purple-800">{item.quantity}</span>
                          </div>
                          <button 
                            onClick={() => onUpdateQuantity(index, 1)}
                            className="w-8 h-8 rounded-r-xl flex items-center justify-center bg-purple-500 text-white hover:bg-purple-600 text-sm font-bold transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Tax Info */}
                      {item.taxName && item.taxPercentage && (
                        <div className="text-xs mt-2 text-purple-600">
                          {item.taxName}: {item.taxPercentage}% ({formatCurrency((item.price * item.quantity * item.taxPercentage) / 100, storeSettings, currencies)})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="bg-white p-4 border-t-4 border-purple-400">
            {/* Order Summary */}
            <div className="bg-purple-50 rounded-2xl p-4 mb-4 border-2 border-purple-200">
              <div className="text-center mb-3">
                <h3 className="font-bold text-purple-800">{isArabic ? "ملخص الطلب" : "Order Summary"}</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">{isArabic ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span className="font-bold text-purple-800">{formatCurrency(subtotal, storeSettings, currencies)}</span>
                </div>
                {totalTax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-700">{isArabic ? "الضريبة" : "Tax"}</span>
                    <span className="font-bold text-purple-800">{formatCurrency(totalTax, storeSettings, currencies)}</span>
                  </div>
                )}
                <div className="border-t-2 border-purple-300 pt-2 flex justify-between">
                  <span className="font-bold text-purple-900">{isArabic ? "الإجمالي" : "Total"}</span>
                  <span className="text-xl font-bold text-purple-600">{formatCurrency(total, storeSettings, currencies)}</span>
                </div>
              </div>
            </div>
            
            {/* Checkout Button */}
            <button 
              onClick={onCheckout}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{language === "ar" ? "إتمام الطلب" : "Proceed to Checkout"}</span>
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