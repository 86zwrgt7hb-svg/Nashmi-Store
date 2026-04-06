import { useStoreLanguage } from '../../shared/StoreLanguageContext';
import React from 'react';
import { getImageUrl } from '../../../utils/image-helper';
import { formatCurrency } from '../../../utils/currency-formatter';
import { X, ShoppingCart, Minus, Plus, Trash2, ShoppingBag, Receipt } from 'lucide-react';

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
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-slate-800 shadow-2xl flex flex-col border-l-2 border-red-600">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-red-600 bg-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">SHOPPING CART</h2>
              <span className="text-xs text-slate-300 font-medium">{cartItems.length} ITEM{cartItems.length !== 1 ? 'S' : ''}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-red-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-800">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-20 h-20 bg-red-600 flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">CART IS EMPTY</h3>
              <p className="text-slate-300 text-sm mb-6 font-medium">ADD AUTOMOTIVE PARTS TO GET STARTED</p>
              <button
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-bold transition-colors border-2 border-red-600"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="bg-slate-900 border-2 border-slate-700 p-3 sm:p-4 hover:border-red-600 transition-all">
                  <div className="flex gap-3 sm:gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img loading="lazy" 
                        src={getImageUrl(item.image)} 
                        alt={getLocalizedField(item, 'name')} 
                        onClick={() => onProductClick(item)}
                        loading="lazy"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 
                          onClick={() => onProductClick(item)}
                          className="font-bold text-white text-sm sm:text-base leading-tight cursor-pointer hover:text-red-400 transition-colors line-clamp-2"
                        >
                          {getLocalizedField(item, 'name')}
                        </h3>
                        <button 
                          onClick={() => onRemoveFromCart(index)}
                          className="p-1 sm:p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors ml-1 sm:ml-2 flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      
                      {/* Variants */}
                      {(() => {
                        const variants = typeof item.variants === 'string' ? JSON.parse(item.variants) : item.variants;
                        return variants && Object.keys(variants).length > 0 && (
                          <div className="text-xs text-slate-400 mb-2 font-medium">
                            {Object.entries(variants).map(([key, value], index) => (
                              <span key={key}>
                                {key}: {value}
                                {index < Object.keys(variants).length - 1 && ', '}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                      
                      {/* Price and Unit Price */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm sm:text-lg font-bold text-red-400">
                            {formatCurrency(item.price * item.quantity, storeSettings, currencies)}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            {formatCurrency(item.price, storeSettings, currencies)} EACH
                          </div>
                        </div>
                      </div>
                      
                      {/* Tax Info */}
                      {item.taxName && item.taxPercentage && (
                        <div className="text-xs text-slate-400 mb-3 font-medium">
                          {item.taxName}: {item.taxPercentage}% ({formatCurrency((item.price * item.quantity * item.taxPercentage) / 100, storeSettings, currencies)})
                        </div>
                      )}
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-slate-300 font-bold">QTY</span>
                        <div className="flex items-center gap-1 bg-slate-700 p-1">
                          <button 
                            onClick={() => item.quantity > 1 && onUpdateQuantity(index, -1)}
                            className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white font-bold ${
                              item.quantity > 1 ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-600 cursor-not-allowed'
                            } transition-colors`}
                          >
                            <Minus className="w-2 h-2 sm:w-3 sm:h-3" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => onQuantityChange(index, e.target.value)}
                            className="w-8 sm:w-10 text-xs sm:text-sm font-bold text-white text-center bg-transparent border-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min="1"
                          />
                          <button 
                            onClick={() => onUpdateQuantity(index, 1)}
                            className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
                          >
                            <Plus className="w-2 h-2 sm:w-3 sm:h-3" />
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
        
        {/* Footer - Order Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t-2 border-red-600 bg-black p-4 sm:p-6">
            {/* Order Summary */}
            <div className="bg-slate-700 border-2 border-slate-600 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="w-4 h-4 text-red-400" />
                <span className="font-bold text-white">ORDER SUMMARY</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium">SUBTOTAL</span>
                  <span className="font-bold text-white">{formatCurrency(subtotal, storeSettings, currencies)}</span>
                </div>
                {totalTax > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 font-medium">TOTAL TAX</span>
                    <span className="font-bold text-white">{formatCurrency(totalTax, storeSettings, currencies)}</span>
                  </div>
                )}
                <div className="border-t-2 border-slate-600 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">TOTAL</span>
                    <span className="text-xl font-bold text-red-400">{formatCurrency(total, storeSettings, currencies)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Checkout Button */}
            <button 
              onClick={onCheckout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 transition-all border-2 border-red-600 flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">PROCEED TO CHECKOUT</span>
              <span className="sm:hidden">CHECKOUT</span>
            </button>
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 transition-all border-2 border-green-500 flex items-center justify-center gap-3"
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