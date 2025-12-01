"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Header from "@/components/Header";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Start adding some products to your cart!</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse Products
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                    {item.product.image ? (
                      <Image
                        src={`http://localhost:8000/storage/${item.product.image}`}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex-grow">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-semibold hover:text-gray-600 mb-1">
                      {item.product.name}
                    </h3>
                  </Link>
                  {item.product.product_type && (
                    <p className="text-sm text-gray-500 capitalize mb-2">
                      {item.product.product_type.replace('_', ' ')}
                    </p>
                  )}
                  <p className="text-lg font-bold">D{item.product.price}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2 border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[60px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-lg font-bold mt-2">
                    D{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 p-6 border rounded-lg bg-gray-50">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>D{total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full block text-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold mb-3"
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={clearCart}
                className="w-full text-center px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

