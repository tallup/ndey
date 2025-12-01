<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|max:20',
            'shipping_address.address' => 'required|string|max:500',
            'billing_address' => 'nullable|array',
            'payment_method' => 'required|string|max:50',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Calculate totals
            $subtotal = 0;
            $items = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                if (!$product->is_active) {
                    throw new \Exception("Product {$product->name} is not available");
                }

                if ($product->quantity < $item['quantity']) {
                    throw new \Exception("Insufficient quantity for {$product->name}");
                }

                $itemPrice = $product->price * $item['quantity'];
                $subtotal += $itemPrice;

                $items[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ];
            }

            $tax = 0; // No tax
            $shipping = 0; // Free shipping or calculate based on address
            $total = $subtotal + $tax + $shipping;

            // Create order
            $order = Order::create([
                'user_id' => $request->user()?->id ?? null,
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping' => $shipping,
                'total' => $total,
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address ?? $request->shipping_address,
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
            ]);

            // Attach products to order
            foreach ($items as $item) {
                $order->products()->attach($item['product']->id, [
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);

                // Update product quantity
                $item['product']->decrement('quantity', $item['quantity']);
            }

            // Load products relationship for response
            $order->load('products');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'order' => $order,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show($id)
    {
        $order = Order::with('products')->findOrFail($id);

        return response()->json([
            'success' => true,
            'order' => $order,
        ]);
    }
}

