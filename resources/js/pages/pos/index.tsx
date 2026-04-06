import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import {
    Barcode, Search, Plus, Minus, Trash2, ShoppingCart,
    DollarSign, Receipt, CreditCard, Banknote, X, Printer, CheckCircle,
    Package, Clock, AlertTriangle, User, Phone, Volume2, VolumeX, ScanBarcode
} from 'lucide-react';

interface Product {
    id: number;
    name: string;
    name_ar: string;
    sku: string;
    price: number;
    sale_price: number | null;
    stock: number;
    cover_image: string | null;
    category: string | null;
    category_ar: string | null;
    tax_percentage: number;
    tax_name: string | null;
}

interface CartItem extends Product {
    quantity: number;
    line_total: number;
    line_tax: number;
}

interface CompletedOrder {
    id: number;
    order_number: string;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    payment_method: string;
    customer_name: string;
    items: { name: string; sku: string; quantity: number; unit_price: number; total_price: number }[];
    created_at: string;
}

export default function PosIndex() {
    const { t } = useTranslation();
    const { products: allProducts, store, todaySales } = usePage<any>().props;
    const page = usePage<any>();
    const language = page.props?.language || page.props?.locale || 'en';
    const isArabic = language === 'ar';

    // State
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('pos_cash');
    const [isProcessing, setIsProcessing] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [salesCount, setSalesCount] = useState(todaySales?.count || 0);
    const [salesToday, setSalesToday] = useState(todaySales?.total || 0);
    const [error, setError] = useState('');
    const [lastScannedSku, setLastScannedSku] = useState('');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [scannerConnected, setScannerConnected] = useState(false);

    // Refs
    const barcodeInputRef = useRef<HTMLInputElement>(null);
    const scanBufferRef = useRef('');
    const scanTimerRef = useRef<NodeJS.Timeout | null>(null);
    const globalScanBufferRef = useRef('');
    const globalScanTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastGlobalKeyTimeRef = useRef<number>(0);
    const scannerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Beep sound for successful scan
    const playBeep = useCallback(() => {
        if (!soundEnabled) return;
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.frequency.value = 1200;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.3;
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.15);
        } catch (e) {
            // Audio not available, ignore
        }
    }, [soundEnabled]);

    // Reference to addToCart that stays current (needed for global listener)
    const addToCartRef = useRef<(product: Product) => void>();

    // Add product to cart
    const addToCart = useCallback((product: Product) => {
        setError('');
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    setError(isArabic ? `لا يوجد مخزون كافٍ لـ ${product.name_ar || product.name}` : `Insufficient stock for ${product.name}`);
                    return prev;
                }
                return prev.map(item => {
                    if (item.id === product.id) {
                        const newQty = item.quantity + 1;
                        const unitPrice = product.sale_price ?? product.price;
                        const lineTotal = unitPrice * newQty;
                        const lineTax = (lineTotal * product.tax_percentage) / 100;
                        return { ...item, quantity: newQty, line_total: lineTotal, line_tax: lineTax };
                    }
                    return item;
                });
            } else {
                if (product.stock <= 0) {
                    setError(isArabic ? `المنتج ${product.name_ar || product.name} نفذ من المخزون` : `${product.name} is out of stock`);
                    return prev;
                }
                const unitPrice = product.sale_price ?? product.price;
                const lineTax = (unitPrice * product.tax_percentage) / 100;
                return [...prev, { ...product, quantity: 1, line_total: unitPrice, line_tax: lineTax }];
            }
        });
        barcodeInputRef.current?.focus();
    }, [isArabic]);

    // Keep addToCartRef current
    useEffect(() => {
        addToCartRef.current = addToCart;
    }, [addToCart]);

    // Auto-focus barcode input on mount and after actions
    useEffect(() => {
        if (!showReceipt) {
            barcodeInputRef.current?.focus();
        }
    }, [showReceipt, cart]);

    // Global barcode scanner listener - captures scans from anywhere on the page
    // Barcode scanners type characters very fast (< 50ms between keystrokes) and end with Enter
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            const now = Date.now();
            const timeDiff = now - lastGlobalKeyTimeRef.current;
            lastGlobalKeyTimeRef.current = now;

            // If the active element is an input/textarea (other than barcode input), don't intercept
            const activeEl = document.activeElement;
            const isBarcodeFocused = activeEl === barcodeInputRef.current;
            const isOtherInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') && !isBarcodeFocused;

            // If user is typing in another input field, skip global capture
            if (isOtherInput) {
                return;
            }

            // If barcode input is focused, let the normal handler deal with it
            if (isBarcodeFocused) {
                return;
            }

            // Detect rapid input (barcode scanner behavior)
            if (e.key === 'Enter') {
                const scannedValue = globalScanBufferRef.current.trim();
                if (scannedValue.length >= 3) {
                    // This looks like a barcode scan - process it
                    e.preventDefault();
                    e.stopPropagation();

                    // Mark scanner as connected
                    setScannerConnected(true);
                    if (scannerTimeoutRef.current) clearTimeout(scannerTimeoutRef.current);
                    scannerTimeoutRef.current = setTimeout(() => setScannerConnected(false), 300000); // 5 min timeout

                    // Try exact SKU match
                    const exactMatch = allProducts.find((p: Product) =>
                        p.sku && p.sku.toLowerCase() === scannedValue.toLowerCase()
                    );

                    if (exactMatch && addToCartRef.current) {
                        addToCartRef.current(exactMatch);
                        setSearchQuery('');
                        setShowSearchResults(false);
                        setLastScannedSku(exactMatch.sku);
                        playBeep();
                        setTimeout(() => setLastScannedSku(''), 2000);
                    } else {
                        // Put the value in the search field for manual search
                        setSearchQuery(scannedValue);
                        barcodeInputRef.current?.focus();
                        // Search
                        const results = allProducts.filter((p: Product) =>
                            (p.name && p.name.toLowerCase().includes(scannedValue.toLowerCase())) ||
                            (p.name_ar && p.name_ar.includes(scannedValue)) ||
                            (p.sku && p.sku.toLowerCase().includes(scannedValue.toLowerCase()))
                        );
                        setSearchResults(results.slice(0, 10));
                        setShowSearchResults(results.length > 0);
                    }
                }
                globalScanBufferRef.current = '';
                return;
            }

            // Only capture printable characters
            if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                if (timeDiff > 100) {
                    // Too slow - reset buffer (normal typing, not scanner)
                    globalScanBufferRef.current = '';
                }
                globalScanBufferRef.current += e.key;

                // Mark scanner as connected after detecting rapid input
                if (timeDiff < 50 && globalScanBufferRef.current.length >= 4) {
                    setScannerConnected(true);
                    if (scannerTimeoutRef.current) clearTimeout(scannerTimeoutRef.current);
                    scannerTimeoutRef.current = setTimeout(() => setScannerConnected(false), 300000);
                }

                // Clear buffer after timeout (if no more rapid input)
                if (globalScanTimerRef.current) clearTimeout(globalScanTimerRef.current);
                globalScanTimerRef.current = setTimeout(() => {
                    globalScanBufferRef.current = '';
                }, 200);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown, true);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown, true);
            if (globalScanTimerRef.current) clearTimeout(globalScanTimerRef.current);
            if (scannerTimeoutRef.current) clearTimeout(scannerTimeoutRef.current);
        };
    }, [allProducts, playBeep]);

    // Handle barcode scanner input (hardware scanner types fast like keyboard)
    const handleBarcodeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Clear previous timer
        if (scanTimerRef.current) {
            clearTimeout(scanTimerRef.current);
        }

        if (value.length > 0) {
            // Wait 150ms after last keystroke - if scanner, it types all chars very fast
            scanTimerRef.current = setTimeout(() => {
                // Try exact SKU match first (barcode scanner)
                const exactMatch = allProducts.find((p: Product) => 
                    p.sku && p.sku.toLowerCase() === value.toLowerCase()
                );

                if (exactMatch) {
                    addToCart(exactMatch);
                    setSearchQuery('');
                    setShowSearchResults(false);
                    setLastScannedSku(exactMatch.sku);
                    playBeep();
                    setScannerConnected(true);
                    if (scannerTimeoutRef.current) clearTimeout(scannerTimeoutRef.current);
                    scannerTimeoutRef.current = setTimeout(() => setScannerConnected(false), 300000);
                    setTimeout(() => setLastScannedSku(''), 2000);
                } else {
                    // Show search results for manual search
                    const results = allProducts.filter((p: Product) =>
                        (p.name && p.name.toLowerCase().includes(value.toLowerCase())) ||
                        (p.name_ar && p.name_ar.includes(value)) ||
                        (p.sku && p.sku.toLowerCase().includes(value.toLowerCase()))
                    );
                    setSearchResults(results.slice(0, 10));
                    setShowSearchResults(results.length > 0);
                }
            }, 150);
        } else {
            setShowSearchResults(false);
        }
    }, [allProducts, addToCart, playBeep]);

    // Handle Enter key on barcode input
    const handleBarcodeKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (scanTimerRef.current) {
                clearTimeout(scanTimerRef.current);
            }
            
            const value = searchQuery.trim();
            if (!value) return;

            const exactMatch = allProducts.find((p: Product) =>
                p.sku && p.sku.toLowerCase() === value.toLowerCase()
            );

            if (exactMatch) {
                addToCart(exactMatch);
                setSearchQuery('');
                setShowSearchResults(false);
                setLastScannedSku(exactMatch.sku);
                playBeep();
                setScannerConnected(true);
                if (scannerTimeoutRef.current) clearTimeout(scannerTimeoutRef.current);
                scannerTimeoutRef.current = setTimeout(() => setScannerConnected(false), 300000);
                setTimeout(() => setLastScannedSku(''), 2000);
            } else {
                // Search by name
                const results = allProducts.filter((p: Product) =>
                    (p.name && p.name.toLowerCase().includes(value.toLowerCase())) ||
                    (p.name_ar && p.name_ar.includes(value))
                );
                if (results.length === 1) {
                    addToCart(results[0]);
                    setSearchQuery('');
                    setShowSearchResults(false);
                } else {
                    setSearchResults(results.slice(0, 10));
                    setShowSearchResults(results.length > 0);
                }
            }
        }
    };

    // Update quantity
    const updateQuantity = (productId: number, newQty: number) => {
        if (newQty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                if (newQty > item.stock) {
                    setError(isArabic ? 'الكمية تتجاوز المخزون المتاح' : 'Quantity exceeds available stock');
                    return item;
                }
                const unitPrice = item.sale_price ?? item.price;
                const lineTotal = unitPrice * newQty;
                const lineTax = (lineTotal * item.tax_percentage) / 100;
                return { ...item, quantity: newQty, line_total: lineTotal, line_tax: lineTax };
            }
            return item;
        }));
    };

    // Remove from cart
    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
        setDiscount(0);
        setCustomerName('');
        setCustomerPhone('');
        setNotes('');
        setError('');
        barcodeInputRef.current?.focus();
    };

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.line_total, 0);
    const totalTax = cart.reduce((sum, item) => sum + item.line_tax, 0);
    const totalAmount = subtotal + totalTax - discount;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Complete sale
    const completeSale = async () => {
        if (cart.length === 0) return;
        setIsProcessing(true);
        setError('');

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/pos/complete-sale', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity,
                    })),
                    payment_method: paymentMethod,
                    customer_name: customerName || undefined,
                    customer_phone: customerPhone || undefined,
                    discount_amount: discount || 0,
                    notes: notes || undefined,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setCompletedOrder(data.order);
                setShowReceipt(true);
                setSalesCount(prev => prev + 1);
                setSalesToday(prev => prev + data.order.total_amount);
                
                // Update local product stock
                cart.forEach(item => {
                    const prod = allProducts.find((p: Product) => p.id === item.id);
                    if (prod) {
                        prod.stock -= item.quantity;
                    }
                });

                setCart([]);
                setDiscount(0);
                setCustomerName('');
                setCustomerPhone('');
                setNotes('');
            } else {
                setError(data.message || (isArabic ? 'فشل إتمام البيع' : 'Sale failed'));
            }
        } catch (err: any) {
            setError(err.message || (isArabic ? 'خطأ في الاتصال' : 'Connection error'));
        } finally {
            setIsProcessing(false);
        }
    };

    // Print receipt
    const printReceipt = () => {
        const printWindow = window.open('', '_blank', 'width=300,height=600');
        if (!printWindow || !completedOrder) return;

        const receiptHtml = `
            <!DOCTYPE html>
            <html dir="${isArabic ? 'rtl' : 'ltr'}">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Courier New', monospace; font-size: 12px; width: 280px; margin: 0 auto; padding: 10px; }
                    .center { text-align: center; }
                    .bold { font-weight: bold; }
                    .line { border-top: 1px dashed #000; margin: 5px 0; }
                    .row { display: flex; justify-content: space-between; }
                    .item { margin: 3px 0; }
                    h2 { margin: 5px 0; font-size: 16px; }
                    @media print { body { width: 100%; } }
                </style>
            </head>
            <body>
                <div class="center">
                    <h2>${store.name}</h2>
                    <p>${isArabic ? 'إيصال بيع' : 'Sales Receipt'}</p>
                </div>
                <div class="line"></div>
                <div class="row"><span>${isArabic ? 'رقم الطلب:' : 'Order #:'}</span><span>${completedOrder.order_number}</span></div>
                <div class="row"><span>${isArabic ? 'التاريخ:' : 'Date:'}</span><span>${completedOrder.created_at}</span></div>
                ${completedOrder.customer_name !== 'Walk-in Customer' ? `<div class="row"><span>${isArabic ? 'العميل:' : 'Customer:'}</span><span>${completedOrder.customer_name}</span></div>` : ''}
                <div class="line"></div>
                ${completedOrder.items.map(item => `
                    <div class="item">
                        <div>${item.name} ${item.sku ? '(' + item.sku + ')' : ''}</div>
                        <div class="row"><span>${item.quantity} x ${store.currency}${item.unit_price.toFixed(2)}</span><span>${store.currency}${item.total_price.toFixed(2)}</span></div>
                    </div>
                `).join('')}
                <div class="line"></div>
                <div class="row"><span>${isArabic ? 'المجموع الفرعي:' : 'Subtotal:'}</span><span>${store.currency}${completedOrder.subtotal.toFixed(2)}</span></div>
                ${completedOrder.tax_amount > 0 ? `<div class="row"><span>${isArabic ? 'الضريبة:' : 'Tax:'}</span><span>${store.currency}${completedOrder.tax_amount.toFixed(2)}</span></div>` : ''}
                ${completedOrder.discount_amount > 0 ? `<div class="row"><span>${isArabic ? 'الخصم:' : 'Discount:'}</span><span>-${store.currency}${completedOrder.discount_amount.toFixed(2)}</span></div>` : ''}
                <div class="line"></div>
                <div class="row bold"><span>${isArabic ? 'الإجمالي:' : 'Total:'}</span><span>${store.currency}${completedOrder.total_amount.toFixed(2)}</span></div>
                <div class="row"><span>${isArabic ? 'طريقة الدفع:' : 'Payment:'}</span><span>${completedOrder.payment_method === 'pos_cash' ? (isArabic ? 'نقداً' : 'Cash') : completedOrder.payment_method === 'pos_card' ? (isArabic ? 'بطاقة' : 'Card') : (isArabic ? 'أخرى' : 'Other')}</span></div>
                <div class="line"></div>
                <div class="center">
                    <p>${isArabic ? 'شكراً لتسوقكم!' : 'Thank you for shopping!'}</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(receiptHtml);
        printWindow.document.close();
        printWindow.print();
    };

    // New sale after receipt
    const newSale = () => {
        setShowReceipt(false);
        setCompletedOrder(null);
        barcodeInputRef.current?.focus();
    };

    // Get product display name
    const getProductName = (product: any) => {
        return isArabic && product.name_ar ? product.name_ar : product.name;
    };

    return (
        <AppLayout breadcrumbs={[
            { title: isArabic ? 'نقطة البيع' : 'Point of Sale', href: '/pos' }
        ]}>
            <Head title={isArabic ? 'نقطة البيع' : 'Point of Sale'} />

            <div className="flex flex-col h-[calc(100vh-4rem)]" dir={isArabic ? 'rtl' : 'ltr'}>
                {/* Top Bar - Stats */}
                <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                                {isArabic ? 'مبيعات اليوم:' : "Today's Sales:"} {salesCount}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                                {isArabic ? 'الإجمالي:' : 'Total:'} {store.currency}{salesToday.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date().toLocaleDateString(isArabic ? 'ar' : 'en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </Badge>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Side - Scanner & Products */}
                    <div className="flex-1 flex flex-col p-4 overflow-hidden">
                        {/* Barcode Scanner Input */}
                        <div className="mb-4">
                            <div className="relative">
                                <Barcode className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-green-600`} />
                                <Input
                                    ref={barcodeInputRef}
                                    value={searchQuery}
                                    onChange={handleBarcodeInput}
                                    onKeyDown={handleBarcodeKeyDown}
                                    placeholder={isArabic ? 'امسح الباركود أو ابحث عن منتج...' : 'Scan barcode or search product...'}
                                    className={`${isArabic ? 'pr-10 pl-20' : 'pl-10 pr-20'} h-14 text-lg border-2 border-green-500 focus:border-green-600 font-mono`}
                                    autoFocus
                                    autoComplete="off"
                                />
                                <div className={`absolute ${isArabic ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 flex gap-1 items-center`}>
                                    {/* Barcode Scanner Connection Status Indicator */}
                                    <div
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${scannerConnected ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'}`}
                                        title={scannerConnected 
                                            ? (isArabic ? 'قارئ الباركود متصل' : 'Barcode scanner connected') 
                                            : (isArabic ? 'قارئ الباركود غير متصل' : 'Barcode scanner not connected')}
                                    >
                                        <div className={`h-2 w-2 rounded-full ${scannerConnected ? 'bg-green-500 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]'}`} />
                                        <ScanBarcode className={`h-4 w-4 ${scannerConnected ? 'text-green-600' : 'text-red-400'}`} />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSoundEnabled(!soundEnabled)}
                                        className="text-muted-foreground hover:text-foreground"
                                        title={soundEnabled ? (isArabic ? 'كتم الصوت' : 'Mute') : (isArabic ? 'تشغيل الصوت' : 'Unmute')}
                                    >
                                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Last scanned indicator */}
                            {lastScannedSku && (
                                <div className="mt-1 flex items-center gap-1 text-green-600 text-sm animate-pulse">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>{isArabic ? 'تم مسح:' : 'Scanned:'} {lastScannedSku}</span>
                                </div>
                            )}

                            {/* Error message */}
                            {error && (
                                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                    <span>{error}</span>
                                    <button onClick={() => setError('')} className="ml-auto"><X className="h-4 w-4" /></button>
                                </div>
                            )}

                            {/* Search Results Dropdown */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute z-50 mt-1 w-[calc(100%-2rem)] bg-white dark:bg-gray-900 border rounded-lg shadow-xl max-h-64 overflow-y-auto">
                                    {searchResults.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                addToCart(product);
                                                setSearchQuery('');
                                                setShowSearchResults(false);
                                            }}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
                                            dir={isArabic ? 'rtl' : 'ltr'}
                                        >
                                            {product.cover_image ? (
                                                <img loading="lazy" src={product.cover_image} alt="" className="w-10 h-10 rounded object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="font-medium">{getProductName(product)}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {product.sku && <span className="font-mono">{product.sku}</span>}
                                                    {product.sku && ' · '}
                                                    {isArabic ? 'المخزون:' : 'Stock:'} {product.stock}
                                                </div>
                                            </div>
                                            <div className="font-bold text-green-600">
                                                {store.currency}{(product.sale_price ?? product.price).toFixed(2)}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Invoice / Cart Items */}
                        <Card className="flex-1 overflow-hidden flex flex-col">
                            <CardHeader className="py-3 px-4 bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Receipt className="h-4 w-4" />
                                        {isArabic ? 'الفاتورة' : 'Invoice'}
                                        {cart.length > 0 && (
                                            <Badge variant="secondary">{totalItems} {isArabic ? 'عنصر' : 'items'}</Badge>
                                        )}
                                    </CardTitle>
                                    {cart.length > 0 && (
                                        <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            {isArabic ? 'مسح الكل' : 'Clear'}
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>

                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted/20 text-xs font-semibold text-muted-foreground border-b">
                                <div className="col-span-1">#</div>
                                <div className="col-span-4">{isArabic ? 'المنتج' : 'Product'}</div>
                                <div className="col-span-2 text-center">{isArabic ? 'السعر' : 'Price'}</div>
                                <div className="col-span-2 text-center">{isArabic ? 'الكمية' : 'Qty'}</div>
                                <div className="col-span-2 text-center">{isArabic ? 'المجموع' : 'Total'}</div>
                                <div className="col-span-1"></div>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                        <Barcode className="h-16 w-16 mb-4 opacity-20" />
                                        <p className="text-lg">{isArabic ? 'امسح باركود لبدء البيع' : 'Scan a barcode to start selling'}</p>
                                        <p className="text-sm mt-1">{isArabic ? 'أو ابحث عن منتج بالاسم' : 'Or search for a product by name'}</p>
                                    </div>
                                ) : (
                                    cart.map((item, index) => (
                                        <div key={item.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b items-center hover:bg-muted/10 transition-colors">
                                            <div className="col-span-1 text-sm text-muted-foreground">{index + 1}</div>
                                            <div className="col-span-4">
                                                <div className="font-medium text-sm">{getProductName(item)}</div>
                                                {item.sku && <div className="text-xs text-muted-foreground font-mono">{item.sku}</div>}
                                            </div>
                                            <div className="col-span-2 text-center text-sm">
                                                {item.sale_price ? (
                                                    <div>
                                                        <span className="text-green-600">{store.currency}{item.sale_price.toFixed(2)}</span>
                                                        <span className="text-xs line-through text-muted-foreground block">{store.currency}{item.price.toFixed(2)}</span>
                                                    </div>
                                                ) : (
                                                    <span>{store.currency}{item.price.toFixed(2)}</span>
                                                )}
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center gap-1">
                                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="col-span-2 text-center font-semibold text-sm">
                                                {store.currency}{item.line_total.toFixed(2)}
                                            </div>
                                            <div className="col-span-1 text-center">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => removeFromCart(item.id)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Side - Payment Panel */}
                    <div className="w-80 border-l flex flex-col bg-muted/10">
                        {/* Receipt Modal */}
                        {showReceipt && completedOrder ? (
                            <div className="flex-1 flex flex-col p-4">
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                                    <h3 className="text-xl font-bold mb-2">{isArabic ? 'تمت العملية بنجاح!' : 'Sale Complete!'}</h3>
                                    <p className="text-3xl font-bold text-green-600 mb-2">
                                        {store.currency}{completedOrder.total_amount.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        {isArabic ? 'رقم الطلب:' : 'Order #:'} {completedOrder.order_number}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {completedOrder.items.length} {isArabic ? 'منتج' : 'items'}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Button onClick={printReceipt} variant="outline" className="w-full">
                                        <Printer className="h-4 w-4 mr-2" />
                                        {isArabic ? 'طباعة الإيصال' : 'Print Receipt'}
                                    </Button>
                                    <Button onClick={newSale} className="w-full bg-green-600 hover:bg-green-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        {isArabic ? 'عملية بيع جديدة' : 'New Sale'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Customer Info (Optional) */}
                                <div className="p-4 border-b">
                                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        {isArabic ? 'بيانات العميل (اختياري)' : 'Customer Info (Optional)'}
                                    </h3>
                                    <div className="space-y-2">
                                        <Input
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder={isArabic ? 'اسم العميل' : 'Customer name'}
                                            className="h-8 text-sm"
                                        />
                                        <Input
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder={isArabic ? 'رقم الهاتف' : 'Phone number'}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="p-4 border-b">
                                    <h3 className="text-sm font-semibold mb-2">{isArabic ? 'طريقة الدفع' : 'Payment Method'}</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Button
                                            variant={paymentMethod === 'pos_cash' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setPaymentMethod('pos_cash')}
                                            className={`flex flex-col h-auto py-2 ${paymentMethod === 'pos_cash' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                        >
                                            <Banknote className="h-5 w-5 mb-1" />
                                            <span className="text-xs">{isArabic ? 'نقداً' : 'Cash'}</span>
                                        </Button>
                                        <Button
                                            variant={paymentMethod === 'pos_card' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setPaymentMethod('pos_card')}
                                            className={`flex flex-col h-auto py-2 ${paymentMethod === 'pos_card' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                        >
                                            <CreditCard className="h-5 w-5 mb-1" />
                                            <span className="text-xs">{isArabic ? 'بطاقة' : 'Card'}</span>
                                        </Button>
                                        <Button
                                            variant={paymentMethod === 'pos_other' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setPaymentMethod('pos_other')}
                                            className={`flex flex-col h-auto py-2 ${paymentMethod === 'pos_other' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                                        >
                                            <DollarSign className="h-5 w-5 mb-1" />
                                            <span className="text-xs">{isArabic ? 'أخرى' : 'Other'}</span>
                                        </Button>
                                    </div>
                                </div>

                                {/* Discount */}
                                <div className="p-4 border-b">
                                    <h3 className="text-sm font-semibold mb-2">{isArabic ? 'خصم' : 'Discount'}</h3>
                                    <div className="relative">
                                        <span className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-sm text-muted-foreground`}>{store.currency}</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={discount || ''}
                                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                            className={`${isArabic ? 'pr-8' : 'pl-8'} h-8 text-sm`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="p-4 border-b">
                                    <Input
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder={isArabic ? 'ملاحظات...' : 'Notes...'}
                                        className="h-8 text-sm"
                                    />
                                </div>

                                {/* Totals */}
                                <div className="p-4 flex-1 flex flex-col justify-end">
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{isArabic ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                                            <span>{store.currency}{subtotal.toFixed(2)}</span>
                                        </div>
                                        {totalTax > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{isArabic ? 'الضريبة:' : 'Tax:'}</span>
                                                <span>{store.currency}{totalTax.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {discount > 0 && (
                                            <div className="flex justify-between text-sm text-red-500">
                                                <span>{isArabic ? 'الخصم:' : 'Discount:'}</span>
                                                <span>-{store.currency}{discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>{isArabic ? 'الإجمالي:' : 'Total:'}</span>
                                            <span className="text-green-600">{store.currency}{totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Complete Sale Button */}
                                    <Button
                                        onClick={completeSale}
                                        disabled={cart.length === 0 || isProcessing}
                                        className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center gap-2">
                                                <span className="animate-spin">⏳</span>
                                                {isArabic ? 'جاري المعالجة...' : 'Processing...'}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <CheckCircle className="h-6 w-6" />
                                                {isArabic ? 'إتمام البيع' : 'Complete Sale'}
                                                {totalAmount > 0 && ` - ${store.currency}${totalAmount.toFixed(2)}`}
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
