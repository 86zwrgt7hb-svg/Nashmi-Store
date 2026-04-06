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
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col">
        
        {/* Supermarket Header */}
        <div className="bg-green-600 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{language === "ar" ? "سلة التسوق" : "Shopping Cart"}</h2>
                <p className="text-green-100 text-sm">{cartItems.length} items</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-green-100 hover:text-white hover:bg-green-500 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content - Table Style Layout */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{language === "ar" ? "سلتك فارغة" : "Your cart is empty"}</h3>
              <p className="text-gray-600 mb-6">Add fresh products to get started!</p>
              <button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="p-4">
              {/* Table Header */}
              <div className="bg-white rounded-t-lg border-b-2 border-green-200 p-3 mb-2">
                <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-center">Action</div>
                </div>
              </div>
              
              {/* Table Rows */}
              <div className="space-y-1 overflow-x-auto">
                {cartItems.map((item, index) => (
                  <div key={index} className="min-w-md bg-white rounded-lg p-3 border border-gray-200 hover:border-green-300 transition-colors">
                    <div className="grid grid-cols-12 gap-2 items-center">
                      {/* Item Number */}
                      <div className="col-span-1">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="col-span-5">
                        <div className="flex items-center gap-3">
                          <img loading="lazy" 
                            src={getImageUrl(item.image)} 
                            alt={getLocalizedField(item, 'name')} 
                            onClick={() => onProductClick(item)}
                            className="w-14 h-14 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" 
                          />
                          <div className="min-w-0">
                            <h3 
                              onClick={() => onProductClick(item)}
                              className="font-semibold text-gray-900 text-sm leading-tight cursor-pointer hover:text-green-600 transition-colors line-clamp-1"
                            >
                              {getLocalizedField(item, 'name')}
                            </h3>
                            <p className="text-xs text-gray-500">{formatCurrency(item.price, storeSettings, currencies)} each</p>
                            
                            {/* Variants */}
                            {(() => {
                              const variants = typeof item.variants === 'string' ? JSON.parse(item.variants) : item.variants;
                              return variants && Object.keys(variants).length > 0 && (
                                <div className="text-xs text-green-600 mt-1">
                                  {Object.entries(variants).map(([key, value], index) => (
                                    <span key={key} className="bg-green-100 px-1 py-0.5 rounded mr-1">
                                      {key}: {value}
                                    </span>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Quantity */}
                      <div className="col-span-2">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => item.quantity > 1 && onUpdateQuantity(index, -1)}
                            className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
                              item.quantity > 1 ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            } transition-colors`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(index, 1)}
                            className="w-6 h-6 flex items-center justify-center bg-green-600 hover:bg-green-700 rounded text-white text-xs font-bold cursor-pointer transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="col-span-2 text-right">
                        <div className="font-bold text-green-600 text-sm">
                          {formatCurrency(item.price * item.quantity, storeSettings, currencies)}
                        </div>
                        {item.taxName && item.taxPercentage && (
                          <div className="text-xs text-gray-500">
                            +{item.taxPercentage}% tax
                          </div>
                        )}
                      </div>
                      
                      {/* Action */}
                      <div className="col-span-2 text-center">
                        <button 
                          onClick={() => onRemoveFromCart(index)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Receipt-Style Footer */}
        {cartItems.length > 0 && (
          <div className="bg-white border-t-2 border-green-200 p-4">
            {/* Receipt Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-dashed border-gray-300">
              <div className="text-center mb-3">
                <Receipt className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <h3 className="font-bold text-gray-900">RECEIPT SUMMARY</h3>
                <div className="w-full h-px bg-gray-300 my-2"></div>
              </div>
              
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SUBTOTAL:</span>
                  <span className="font-bold">{formatCurrency(subtotal, storeSettings, currencies)}</span>
                </div>
                {totalTax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">TAX:</span>
                    <span className="font-bold">{formatCurrency(totalTax, storeSettings, currencies)}</span>
                  </div>
                )}
                <div className="border-t border-gray-400 pt-2 flex justify-between text-lg">
                  <span className="font-bold text-gray-900">TOTAL:</span>
                  <span className="font-bold text-green-600">{formatCurrency(total, storeSettings, currencies)}</span>
                </div>
              </div>
            </div>
            
            {/* Checkout Button */}
            <button 
              onClick={onCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{language === "ar" ? "إتمام الطلب" : "Proceed to Checkout"}</span>
            </button>
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
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