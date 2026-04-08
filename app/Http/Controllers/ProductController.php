<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Get products for the current store with category relationship
        $products = Product::with('category')
                        ->where('store_id', $currentStoreId)
                        ->latest()
                        ->get();
        
        // Get statistics
        $totalProducts = $products->count();
        $activeProducts = $products->where('is_active', true)->count();
        $lowStockProducts = $products->where('stock', '<', 10)->count();
        $totalValue = $products->sum(function ($product) {
            return $product->price * $product->stock;
        });
        
        return Inertia::render('products/index', [
            'products' => $products,
            'stats' => [
                'total' => $totalProducts,
                'active' => $activeProducts,
                'lowStock' => $lowStockProducts,
                'totalValue' => $totalValue
            ]
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Get categories for the current store
        $categories = Category::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->get();
        
        // Get taxes for the current store
        $taxes = \App\Models\Tax::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->get();
        
        return Inertia::render('products/create', [
            'categories' => $categories,
            'taxes' => $taxes
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Check if user can add more products to this store
        $productCheck = $user->canAddProductToStore($currentStoreId);
        if (!$productCheck['allowed']) {
            return redirect()->back()->with('error', $productCheck['message']);
        }
        
        // Validation
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100|unique:products,sku,NULL,id,store_id,' . $currentStoreId,
            'description' => 'nullable|string',
            'specifications' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'cover_image' => 'nullable|string',
            'images' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'tax_id' => 'nullable|exists:taxes,id',
            'is_active' => 'nullable|boolean',
            'is_downloadable' => 'nullable|boolean',
            'downloadable_file' => 'nullable|string',
            'variants' => 'nullable|array',
            'custom_fields' => 'nullable|array',
        ]);
        
        $product = new Product();
        $product->name = $request->name;
        $product->name_ar = $request->name_ar;
        $product->sku = $request->sku;
        $product->description = $request->description;
        $product->description_ar = $request->description_ar;
        $product->specifications = $request->specifications;
        $product->specifications_ar = $request->specifications_ar;
        $product->price = $request->price;
        $product->sale_price = $request->sale_price;
        $product->stock = $request->stock;
        $product->cover_image = $request->cover_image;
        $product->images = $request->images;
        $product->category_id = $request->category_id;
        $product->tax_id = $request->tax_id;
        $product->store_id = $currentStoreId;
        $product->is_active = $request->has('is_active') ? $request->is_active : true;
        $product->is_downloadable = $request->has('is_downloadable') ? $request->is_downloadable : false;
        $product->downloadable_file = $request->downloadable_file;
        $product->variants = $request->variants;
        $product->custom_fields = $request->custom_fields;
        $product->save();
        
        // Dispatch ProductCreated event for webhooks
        event(new \App\Events\ProductCreated($product));
        
        return redirect()->route('products.index')->with('success', __('Product created successfully'));
    }

    /**
     * Display the specified product.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $product = Product::with(['category', 'tax'])
                        ->where('store_id', $currentStoreId)
                        ->findOrFail($id);
        
        // Calculate dynamic stats for the product
        $orderItems = \App\Models\OrderItem::where('product_id', $product->id)->get();
        
        $stats = [
            'revenue' => $orderItems->sum('total_price'),
            'views' => 0, // Views tracking would need to be implemented separately
            'total_sold' => $orderItems->sum('quantity'),
            'total_orders' => $orderItems->count(),
        ];
        
        // Format revenue for display
        $stats['formatted_revenue'] = formatStoreCurrency($stats['revenue'], $user->id, $currentStoreId);
        
        return Inertia::render('products/show', [
            'product' => $product,
            'stats' => $stats
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(string $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $product = Product::where('store_id', $currentStoreId)->findOrFail($id);
        
        // Get categories for the current store
        $categories = Category::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->get();
        
        // Get taxes for the current store
        $taxes = \App\Models\Tax::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->get();
        
        return Inertia::render('products/edit', [
            'product' => $product,
            'categories' => $categories,
            'taxes' => $taxes
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $product = Product::where('store_id', $currentStoreId)->findOrFail($id);
        
        // Validation
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100|unique:products,sku,' . $product->id . ',id,store_id,' . $currentStoreId,
            'description' => 'nullable|string',
            'specifications' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'cover_image' => 'nullable|string',
            'images' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'tax_id' => 'nullable|exists:taxes,id',
            'is_active' => 'nullable|boolean',
            'is_downloadable' => 'nullable|boolean',
            'downloadable_file' => 'nullable|string',
            'variants' => 'nullable|array',
            'custom_fields' => 'nullable|array',
        ]);
        
        // Check if trying to activate product
        $newIsActive = $request->has('is_active') ? $request->is_active : $product->is_active;
        if ($newIsActive && !$product->is_active) {
            // Product is being activated, check plan limits
            $companyUser = $user->type === 'company' ? $user : $user->creator;
            if ($companyUser && $companyUser->plan) {
                $maxProducts = $companyUser->plan->max_products_per_store ?? 0;
                if ($maxProducts > 0) {
                    $activeProducts = Product::where('store_id', $currentStoreId)
                        ->where('is_active', true)
                        ->where('id', '!=', $product->id)
                        ->count();
                    
                    if ($activeProducts >= $maxProducts) {
                        return redirect()->back()->with('error', __('Cannot activate product. You have reached your plan limit of :max products per store. Please upgrade your plan or deactivate another product first.', ['max' => $maxProducts]));
                    }
                }
            }
        }
        
        $product->name = $request->name;
        $product->name_ar = $request->name_ar;
        $product->sku = $request->sku;
        $product->description = $request->description;
        $product->description_ar = $request->description_ar ?? $product->description;
        $product->specifications = $request->specifications;
        $product->specifications_ar = $request->specifications_ar ?? $product->specifications;
        $product->price = $request->price;
        $product->sale_price = $request->sale_price;
        $product->stock = $request->stock;
        $product->cover_image = $request->cover_image;
        $product->images = $request->images;
        $product->category_id = $request->category_id;
        $product->tax_id = $request->tax_id;
        $product->is_active = $newIsActive;
        $product->is_downloadable = $request->has('is_downloadable') ? $request->is_downloadable : $product->is_downloadable;
        $product->downloadable_file = $request->downloadable_file;
        $product->variants = $request->variants;
        $product->custom_fields = $request->custom_fields;
        $product->save();
        
        return redirect()->route('products.index')->with('success', __('Product updated successfully'));
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $product = Product::where('store_id', $currentStoreId)->findOrFail($id);
        $product->delete();
        
        return redirect()->route('products.index')->with('success', __('Product deleted successfully'));
    }

    /**
     * Bulk delete selected products.
     */
    public function bulkDestroy(Request $request)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:products,id',
        ]);
        
        $deletedCount = Product::where('store_id', $currentStoreId)
            ->whereIn('id', $request->ids)
            ->delete();
        
        return redirect()->route('products.index')->with('success', __(':count products deleted successfully', ['count' => $deletedCount]));
    }

    /**
     * Show the bulk import form.
     */
    public function importForm()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Get categories for the current store
        $categories = Category::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->get();
        
        // Get taxes for the current store
        $taxes = \App\Models\Tax::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->get();
        
        return Inertia::render('products/import', [
            'categories' => $categories,
            'taxes' => $taxes
        ]);
    }

    /**
     * Process bulk import from Excel/CSV file.
     */
    public function importProcess(Request $request)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $request->validate([
            'file' => 'required|file|mimes:csv,txt,xlsx,xls|max:10240',
        ]);
        
        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        
        $results = [
            'success' => 0,
            'failed' => 0,
            'errors' => [],
        ];
        
        try {
            // Read CSV file
            if (in_array($extension, ['csv', 'txt'])) {
                $rows = $this->parseCsvFile($file->getPathname());
            } else {
                // For xlsx/xls, we use a simple approach with PhpSpreadsheet if available
                // Otherwise fall back to CSV-only support
                if (class_exists('\PhpOffice\PhpSpreadsheet\IOFactory')) {
                    $rows = $this->parseExcelFile($file->getPathname(), $currentStoreId);
                } else {
                    return redirect()->back()->with('error', __('Excel file support requires PhpSpreadsheet library. Please use CSV format instead.'));
                }
            }
            
            if (empty($rows)) {
                return redirect()->back()->with('error', __('The uploaded file is empty or could not be parsed.'));
            }
            
            // Get header row
            $headers = array_map('strtolower', array_map('trim', $rows[0]));
            
            // Map headers to field names
            $headerMap = $this->mapHeaders($headers);
            
            if (!isset($headerMap['name'])) {
                return redirect()->back()->with('error', __('The file must contain a "Product Name" column.'));
            }
            
            // Get categories for mapping by name
            $categoryMap = Category::where('store_id', $currentStoreId)
                ->pluck('id', 'name')
                ->toArray();
            
            // Also map Arabic names
            $categoryMapAr = Category::where('store_id', $currentStoreId)
                ->whereNotNull('name_ar')
                ->pluck('id', 'name_ar')
                ->toArray();
            
            $allCategoryMap = array_merge($categoryMap, $categoryMapAr);
            
            // Process data rows (skip header)
            for ($i = 1; $i < count($rows); $i++) {
                $row = $rows[$i];
                
                // Skip empty rows
                if (empty(array_filter($row))) {
                    continue;
                }
                
                // Skip instruction/note rows (rows starting with # or *)
                $firstCell = trim($row[0] ?? '');
                if (str_starts_with($firstCell, '#') || str_starts_with($firstCell, '*') || str_starts_with($firstCell, '//')) {
                    continue;
                }
                
                try {
                    $productData = $this->extractProductData($row, $headerMap, $allCategoryMap, $currentStoreId);
                    
                    // Validate required fields
                    if (empty($productData['name'])) {
                        $results['failed']++;
                        $results['errors'][] = __('Row :row: Product name is required.', ['row' => $i + 1]);
                        continue;
                    }
                    
                    if (empty($productData['category_id'])) {
                        $results['failed']++;
                        $results['errors'][] = __('Row :row: Category name is required for product ":name".', ['row' => $i + 1, 'name' => $productData['name']]);
                        continue;
                    }
                    
                    if (!isset($productData['price']) || $productData['price'] === null) {
                        $productData['price'] = 0;
                    }
                    
                    // Check plan limits
                    $productCheck = $user->canAddProductToStore($currentStoreId);
                    if (!$productCheck['allowed']) {
                        $results['failed']++;
                        $results['errors'][] = __('Row :row: :message', ['row' => $i + 1, 'message' => $productCheck['message']]);
                        break; // Stop processing if limit reached
                    }
                    
                    // Download cover image if URL provided
                    if (!empty($productData['cover_image_url'])) {
                        $imagePath = $this->downloadImage($productData['cover_image_url'], $currentStoreId);
                        if ($imagePath) {
                            $productData['cover_image'] = $imagePath;
                        }
                    }
                    unset($productData['cover_image_url']);
                    
                    // Use embedded image from Excel if no cover image yet
                    if (empty($productData['cover_image']) && !empty($row['_embedded_image'])) {
                        $productData['cover_image'] = $row['_embedded_image'];
                    }
                    
                    // Set images field = cover_image so it shows as product image too
                    if (!empty($productData['cover_image']) && empty($productData['images'])) {
                        $productData['images'] = $productData['cover_image'];
                    }
                    
                    // Create product
                    $product = new Product();
                    $product->fill($productData);
                    $product->store_id = $currentStoreId;
                    $product->is_active = $productData['is_active'] ?? true;
                    $product->stock = $productData['stock'] ?? 0;
                    $product->save();
                    
                    $results['success']++;
                    
                } catch (\Exception $e) {
                    $results['failed']++;
                    $results['errors'][] = __('Row :row: :error', ['row' => $i + 1, 'error' => $e->getMessage()]);
                    Log::error("Bulk import error row {$i}: " . $e->getMessage());
                }
            }
            
        } catch (\Exception $e) {
            Log::error("Bulk import error: " . $e->getMessage());
            return redirect()->back()->with('error', __('Error processing file: :error', ['error' => $e->getMessage()]));
        }
        
        $message = __(':success products imported successfully.', ['success' => $results['success']]);
        if ($results['failed'] > 0) {
            $message .= ' ' . __(':failed products failed.', ['failed' => $results['failed']]);
        }
        
        if (!empty($results['errors'])) {
            return redirect()->route('products.import')
                ->with('success', $message)
                ->with('importSuccess', $results['success'])
                ->with('importErrors', array_slice($results['errors'], 0, 20));
        }
        
        return redirect()->route('products.index')->with('success', $message);
    }

    /**
     * Download the import template.
     */
    public function importTemplate()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Get categories for the template
        $categories = Category::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->get();
        
        $csvData = [];
        
        // Header row with clear labels
        $csvData[] = [
            'Product Name (REQUIRED)',
            'Product Name Arabic',
            'SKU',
            'Category Name (REQUIRED)',
            'Price',
            'Sale Price',
            'Stock',
            'Description',
            'Description Arabic',
            'Cover Image URL',
            'Active (yes/no)',
        ];
        
        // Instructions row
        $csvData[] = [
            '# INSTRUCTIONS: Fill in your products below. Lines starting with # are ignored.',
            '# اسم المنتج بالعربية',
            '# e.g. SKU-001',
            '# MUST match one of: ' . $categories->pluck('name')->implode(', '),
            '# e.g. 29.99 (default: 0)',
            '# Optional sale price',
            '# e.g. 100 (default: 0)',
            '# Product description',
            '# وصف المنتج بالعربية',
            '# https://example.com/image.jpg',
            '# yes or no (default: yes)',
        ];
        
        // Sample data row
        $sampleCategory = $categories->first() ? $categories->first()->name : 'Your Category Name';
        $csvData[] = [
            'Sample Product Name',
            'اسم المنتج',
            'SKU-001',
            $sampleCategory,
            '29.99',
            '19.99',
            '100',
            'Product description here',
            'وصف المنتج هنا',
            'https://example.com/product-image.jpg',
            'yes',
        ];
        
        $filename = 'products-import-template-' . now()->format('Y-m-d') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];
        
        $callback = function() use ($csvData) {
            $file = fopen('php://output', 'w');
            // Add BOM for Excel UTF-8 compatibility
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }

    /**
     * Parse a CSV file into rows.
     */
    private function parseCsvFile(string $path): array
    {
        $rows = [];
        if (($handle = fopen($path, 'r')) !== false) {
            // Skip BOM if present
            $bom = fread($handle, 3);
            if ($bom !== chr(0xEF).chr(0xBB).chr(0xBF)) {
                rewind($handle);
            }
            while (($data = fgetcsv($handle)) !== false) {
                $rows[] = $data;
            }
            fclose($handle);
        }
        return $rows;
    }

    /**
     * Parse an Excel file into rows using PhpSpreadsheet.
     * Supports all image types: float images, inserted in cell, MemoryDrawing, Drawing from ZIP.
     */
    private function parseExcelFile(string $path, int $storeId = null): array
    {
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($path);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = [];
        
        // Extract embedded images and map them to rows
        $imageMap = [];
        
        if ($storeId) {
            // Ensure storage directory exists
            Storage::disk('public')->makeDirectory('products/' . $storeId);
            
            foreach ($worksheet->getDrawingCollection() as $drawing) {
                $coords = $drawing->getCoordinates();
                $rowNum = (int) preg_replace('/[^0-9]/', '', $coords);
                
                $imageContent = null;
                $ext = 'png';
                
                if ($drawing instanceof \PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing) {
                    // In-memory image (e.g. copy-pasted)
                    $resource = $drawing->getImageResource();
                    if ($resource) {
                        ob_start();
                        switch ($drawing->getRenderingFunction()) {
                            case \PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing::RENDERING_JPEG:
                                imagejpeg($resource);
                                $ext = 'jpg';
                                break;
                            case \PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing::RENDERING_GIF:
                                imagegif($resource);
                                $ext = 'gif';
                                break;
                            default:
                                imagepng($resource);
                                $ext = 'png';
                                break;
                        }
                        $imageContent = ob_get_clean();
                    }
                } elseif ($drawing instanceof \PhpOffice\PhpSpreadsheet\Worksheet\Drawing) {
                    // File-based drawing - could be local file or inside ZIP
                    $drawingPath = $drawing->getPath();
                    $ext = strtolower($drawing->getExtension()) ?: 'png';
                    
                    if (file_exists($drawingPath)) {
                        // Direct file path
                        $imageContent = file_get_contents($drawingPath);
                    } elseif (str_starts_with($drawingPath, 'zip://')) {
                        // Image inside ZIP (e.g. zip:///tmp/file.xlsx#xl/media/image1.png)
                        $imageContent = @file_get_contents($drawingPath);
                        
                        // Fallback: manually extract from ZIP
                        if ($imageContent === false) {
                            $parts = explode('#', $drawingPath, 2);
                            if (count($parts) === 2) {
                                $zipPath = str_replace('zip://', '', $parts[0]);
                                $innerPath = $parts[1];
                                $zip = new \ZipArchive();
                                if ($zip->open($zipPath) === true) {
                                    $imageContent = $zip->getFromName($innerPath);
                                    $zip->close();
                                }
                            }
                        }
                    }
                }
                
                if ($imageContent && strlen($imageContent) > 0) {
                    $filename = 'products/' . $storeId . '/' . uniqid('import_img_') . '.' . $ext;
                    Storage::disk('public')->put($filename, $imageContent);
                    $imageMap[$rowNum] = '/storage/' . $filename;
                    Log::info("Extracted image for row {$rowNum}: /storage/{$filename} (" . strlen($imageContent) . " bytes)");
                }
            }
            
            // Fallback: if no images found via DrawingCollection, try reading directly from ZIP
            if (empty($imageMap)) {
                $zip = new \ZipArchive();
                if ($zip->open($path) === true) {
                    // Read drawing XML to map images to rows
                    $drawingXml = $zip->getFromName('xl/drawings/drawing1.xml');
                    $drawingRels = $zip->getFromName('xl/drawings/_rels/drawing1.xml.rels');
                    
                    if ($drawingXml && $drawingRels) {
                        // Parse relationships to get image filenames
                        $relsXml = simplexml_load_string($drawingRels);
                        $imageFiles = [];
                        foreach ($relsXml->Relationship as $rel) {
                            $rId = (string)$rel['Id'];
                            $target = (string)$rel['Target'];
                            if (str_contains($target, 'media/')) {
                                $imageFiles[$rId] = 'xl/' . str_replace('../', '', $target);
                            }
                        }
                        
                        // Parse drawing XML to map images to row numbers
                        $ns = ['xdr' => 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing',
                               'a' => 'http://schemas.openxmlformats.org/drawingml/2006/main',
                               'r' => 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'];
                        $drawXml = simplexml_load_string($drawingXml);
                        $drawXml->registerXPathNamespace('xdr', $ns['xdr']);
                        $drawXml->registerXPathNamespace('r', $ns['r']);
                        
                        $anchors = $drawXml->xpath('//xdr:twoCellAnchor | //xdr:oneCellAnchor | //xdr:absoluteAnchor');
                        foreach ($anchors as $anchor) {
                            $anchor->registerXPathNamespace('xdr', $ns['xdr']);
                            $anchor->registerXPathNamespace('r', $ns['r']);
                            
                            // Get row from anchor
                            $fromRow = $anchor->xpath('xdr:from/xdr:row');
                            $rowNum = $fromRow ? ((int)$fromRow[0] + 1) : 0; // 0-indexed to 1-indexed
                            
                            // Get image reference
                            $blips = $anchor->xpath('.//a:blip/@r:embed');
                            if (!empty($blips) && $rowNum > 0) {
                                $rId = (string)$blips[0];
                                if (isset($imageFiles[$rId])) {
                                    $imgData = $zip->getFromName($imageFiles[$rId]);
                                    if ($imgData) {
                                        $imgExt = strtolower(pathinfo($imageFiles[$rId], PATHINFO_EXTENSION)) ?: 'png';
                                        $filename = 'products/' . $storeId . '/' . uniqid('import_img_') . '.' . $imgExt;
                                        Storage::disk('public')->put($filename, $imgData);
                                        $imageMap[$rowNum] = '/storage/' . $filename;
                                        Log::info("ZIP fallback: extracted image for row {$rowNum}: /storage/{$filename}");
                                    }
                                }
                            }
                        }
                    }
                    $zip->close();
                }
            }
        }
        
        $rowNumber = 0;
        foreach ($worksheet->getRowIterator() as $row) {
            $rowNumber++;
            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false);
            $rowData = [];
            foreach ($cellIterator as $cell) {
                $rowData[] = $cell->getValue();
            }
            // Attach embedded image path to row metadata
            if (isset($imageMap[$rowNumber])) {
                $rowData['_embedded_image'] = $imageMap[$rowNumber];
            }
            $rows[] = $rowData;
        }
        return $rows;
    }

    /**
     * Map CSV headers to product field names.
     */
    private function mapHeaders(array $headers): array
    {
        $map = [];
        foreach ($headers as $index => $header) {
            $h = strtolower(trim($header));
            // Remove (REQUIRED) and other annotations
            $h = preg_replace('/\s*\(.*?\)\s*/', '', $h);
            $h = trim($h);
            
            if (str_contains($h, 'product name') && str_contains($h, 'arabic')) {
                $map['name_ar'] = $index;
            } elseif (str_contains($h, 'product name') || $h === 'name') {
                $map['name'] = $index;
            } elseif ($h === 'sku') {
                $map['sku'] = $index;
            } elseif (str_contains($h, 'category')) {
                $map['category'] = $index;
            } elseif (str_contains($h, 'sale price') || str_contains($h, 'sale_price')) {
                $map['sale_price'] = $index;
            } elseif (str_contains($h, 'price')) {
                $map['price'] = $index;
            } elseif (str_contains($h, 'stock') || str_contains($h, 'quantity')) {
                $map['stock'] = $index;
            } elseif (str_contains($h, 'description') && str_contains($h, 'arabic')) {
                $map['description_ar'] = $index;
            } elseif (str_contains($h, 'description')) {
                $map['description'] = $index;
            } elseif (str_contains($h, 'image') || str_contains($h, 'cover')) {
                $map['cover_image_url'] = $index;
            } elseif (str_contains($h, 'active') || str_contains($h, 'status')) {
                $map['is_active'] = $index;
            }
        }
        return $map;
    }

    /**
     * Extract product data from a CSV row.
     */
    private function extractProductData(array $row, array $headerMap, array &$categoryMap, int $storeId): array
    {
        $data = [];
        
        foreach ($headerMap as $field => $index) {
            $value = isset($row[$index]) ? trim($row[$index]) : '';
            
            if ($field === 'category') {
                if (!empty($value)) {
                    if (isset($categoryMap[$value])) {
                        $data['category_id'] = $categoryMap[$value];
                    } else {
                        // Auto-create new category
                        $slug = \Illuminate\Support\Str::slug($value);
                        if (empty($slug)) {
                            $slug = 'category-' . uniqid();
                        }
                        // Ensure unique slug for this store
                        $originalSlug = $slug;
                        $counter = 1;
                        while (Category::where('store_id', $storeId)->where('slug', $slug)->exists()) {
                            $slug = $originalSlug . '-' . $counter++;
                        }
                        $newCat = Category::create([
                            'name' => $value,
                            'slug' => $slug,
                            'store_id' => $storeId,
                            'is_active' => true,
                        ]);
                        $categoryMap[$value] = $newCat->id;
                        $data['category_id'] = $newCat->id;
                    }
                }
            } elseif ($field === 'is_active') {
                $data['is_active'] = in_array(strtolower($value), ['yes', '1', 'true', 'active', 'نعم']);
            } elseif ($field === 'price' || $field === 'sale_price') {
                $data[$field] = is_numeric($value) ? (float) $value : null;
            } elseif ($field === 'stock') {
                $data[$field] = is_numeric($value) ? (int) $value : 0;
            } else {
                $data[$field] = $value;
            }
        }
        
        return $data;
    }

    /**
     * Download an image from URL and store it locally.
     */
    private function downloadImage(string $url, int $storeId): ?string
    {
        try {
            if (empty($url) || !filter_var($url, FILTER_VALIDATE_URL)) {
                return null;
            }
            
            $context = stream_context_create([
                'http' => [
                    'timeout' => 15,
                    'user_agent' => 'Mozilla/5.0',
                ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ]);
            
            $imageContent = @file_get_contents($url, false, $context);
            
            if ($imageContent === false) {
                return null;
            }
            
            // Determine extension from content type or URL
            $extension = 'jpg';
            $urlPath = parse_url($url, PHP_URL_PATH);
            if ($urlPath) {
                $ext = strtolower(pathinfo($urlPath, PATHINFO_EXTENSION));
                if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    $extension = $ext;
                }
            }
            
            $filename = 'products/' . $storeId . '/' . uniqid('import_') . '.' . $extension;
            
            Storage::disk('public')->put($filename, $imageContent);
            
            return '/storage/' . $filename;
            
        } catch (\Exception $e) {
            Log::warning("Failed to download image from {$url}: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Export products data as CSV.
     */
    public function export()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $products = Product::with('category')
                        ->where('store_id', $currentStoreId)
                        ->get();
        
        $csvData = [];
        $csvData[] = ['Product Name', 'SKU', 'Category', 'Price', 'Sale Price', 'Stock', 'Variants', 'Status', 'Created Date'];
        
        foreach ($products as $product) {
            $variantDetails = 'No variants';
            if ($product->variants && is_array($product->variants) && count($product->variants) > 0) {
                $variantList = [];
                foreach ($product->variants as $variant) {
                    if (is_array($variant) && isset($variant['name'])) {
                        $variantList[] = $variant['name'] . (isset($variant['price']) ? ' (' . formatStoreCurrency($variant['price'], $user->id, $currentStoreId) . ')' : '');
                    }
                }
                $variantDetails = implode('; ', $variantList);
            }
            
            $csvData[] = [
                $product->name,
                $product->sku ?: 'Not set',
                $product->category ? $product->category->name : 'Uncategorized',
                formatStoreCurrency($product->price, $user->id, $currentStoreId),
                $product->sale_price ? formatStoreCurrency($product->sale_price, $user->id, $currentStoreId) : 'Not set',
                $product->stock,
                $variantDetails,
                $product->is_active ? 'Active' : 'Inactive',
                $product->created_at->format('Y-m-d H:i:s')
            ];
        }
        
        $filename = 'products-export-' . now()->format('Y-m-d') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];
        
        $callback = function() use ($csvData) {
            $file = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
}
