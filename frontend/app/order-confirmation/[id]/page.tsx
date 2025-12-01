"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

interface Order {
  id: number;
  order_number: string;
  total: string;
  status: string;
  shipping_address: any;
  products: Array<{
    id: number;
    name: string;
    pivot: {
      quantity: number;
      price: string;
    };
  }>;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link href="/products" className="text-blue-600 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your order. We've received your order and will begin processing it right
              away.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-xl font-bold">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold">D{parseFloat(order.total).toFixed(2)}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-3">Order Items</h2>
              <div className="space-y-3">
                {order.products.map((product) => (
                  <div key={product.id} className="flex justify-between">
                    <span>
                      {product.name} x {product.pivot.quantity}
                    </span>
                    <span>D{(parseFloat(product.pivot.price) * product.pivot.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {order.shipping_address && (
              <div className="mb-6">
                <h2 className="font-semibold mb-3">Shipping Address</h2>
                <p className="text-gray-600">
                  {order.shipping_address.name}
                  <br />
                  {order.shipping_address.address}
                  <br />
                  {order.shipping_address.city}
                  {order.shipping_address.state && `, ${order.shipping_address.state}`}
                  {order.shipping_address.postal_code && ` ${order.shipping_address.postal_code}`}
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold mb-2">Payment Method</h2>
              <p className="text-gray-700">
                <strong>Cash on Delivery</strong> - Payment will be collected when your order is delivered.
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            You will receive a confirmation email shortly. WhatsApp notifications have been sent to
            our team.
          </p>
        </div>
      </div>
    </div>
  );
}

