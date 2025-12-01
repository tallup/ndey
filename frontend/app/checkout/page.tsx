"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { api } from "@/lib/api";
import Header from "@/components/Header";

interface DeliveryLocation {
  id: number;
  name: string;
  region: string;
  delivery_fee: number | null;
  is_active: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const subtotal = getTotalPrice();
  const [requiresDelivery, setRequiresDelivery] = useState(false);
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [loadingLocations, setLoadingLocations] = useState(false);
  
  const total = subtotal + Number(deliveryFee || 0);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    payment_method: "cash", // Always cash payment
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDeliveryLocations = async () => {
      setLoadingLocations(true);
      try {
        const response = await api.get("/delivery-locations");
        setDeliveryLocations(response.data);
      } catch (error) {
        console.error("Error fetching delivery locations:", error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchDeliveryLocations();
  }, []);

  useEffect(() => {
    const calculateFee = async () => {
      if (!requiresDelivery || !selectedLocationId) {
        setDeliveryFee(0);
        return;
      }

      try {
        const response = await api.get(`/delivery-locations/${selectedLocationId}/fee`);
        const fee = response.data.fee || 0;
        setDeliveryFee(typeof fee === 'number' ? fee : parseFloat(fee) || 0);
      } catch (error) {
        console.error("Error calculating delivery fee:", error);
        setDeliveryFee(0);
      }
    };

    calculateFee();
  }, [selectedLocationId, requiresDelivery]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (requiresDelivery && !selectedLocationId) {
      newErrors.deliveryLocation = "Please select a delivery location";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // WhatsApp number from backend config
    const whatsappNumber = "3740280";
    
    // Create checkout link (current page URL with order summary)
    const checkoutLink = typeof window !== 'undefined' 
      ? `${window.location.origin}/checkout?name=${encodeURIComponent(formData.name)}&phone=${encodeURIComponent(formData.phone)}&address=${encodeURIComponent(formData.address)}`
      : '';

    // Format order items
    const orderItems = items.map((item) => {
      const itemTotal = parseFloat(item.product.price) * item.quantity;
      return `• ${item.product.name} x ${item.quantity} - D${itemTotal.toFixed(2)}`;
    }).join('\n');

    // Get selected location name
    const selectedLocation = deliveryLocations.find(loc => loc.id.toString() === selectedLocationId);
    const locationName = selectedLocation?.name || '';

    // Format WhatsApp message
    let message = `🛒 *New Order Request*\n\n` +
      `*Customer Details:*\n` +
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Address: ${formData.address}\n`;
    
    if (requiresDelivery && locationName) {
      message += `Delivery Location: ${locationName}\n`;
      if (deliveryFee > 0) {
        message += `Delivery Fee: D${Number(deliveryFee).toFixed(2)}\n`;
      } else {
        message += `Delivery Fee: Free\n`;
      }
    } else {
      message += `Delivery: Pickup Only\n`;
    }
    
    message += `\n*Order Items:*\n${orderItems}\n\n` +
      `*Subtotal: D${subtotal.toFixed(2)}*\n`;
    
    if (requiresDelivery && deliveryFee > 0) {
      message += `*Delivery Fee: D${Number(deliveryFee).toFixed(2)}*\n`;
    }
    
    message += `*Total: D${total.toFixed(2)}*\n\n` +
      `Payment Method: Cash on Delivery\n\n` +
      `View full order: ${checkoutLink}`;

    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow-sm space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Delivery Checkbox */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requiresDelivery}
                        onChange={(e) => {
                          setRequiresDelivery(e.target.checked);
                          if (!e.target.checked) {
                            setSelectedLocationId("");
                            setDeliveryFee(0);
                          }
                        }}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="text-sm font-medium">With Delivery</span>
                    </label>
                  </div>

                  {/* Village Dropdown - Only show when delivery is checked */}
                  {requiresDelivery && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Select Village <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedLocationId}
                        onChange={(e) => setSelectedLocationId(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.deliveryLocation ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loadingLocations}
                      >
                        <option value="">Select a village...</option>
                        {deliveryLocations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.name}
                          </option>
                        ))}
                      </select>
                      {errors.deliveryLocation && (
                        <p className="text-red-500 text-sm mt-1">{errors.deliveryLocation}</p>
                      )}
                      {selectedLocationId && deliveryFee === 0 && (
                        <p className="text-green-600 text-sm mt-1">Free delivery to this location</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Payment Information</h3>
                    <p className="text-sm text-blue-700">
                      Payment will be made in cash upon delivery. Our team will contact you to confirm your order and delivery details.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Place Order via WhatsApp
              </button>
            </motion.form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>D{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>D{subtotal.toFixed(2)}</span>
                </div>
                {requiresDelivery && selectedLocationId && (
                  <div className="flex justify-between">
                    <span>
                      Delivery Fee
                      {deliveryLocations.find(loc => loc.id.toString() === selectedLocationId) && (
                        <span className="text-gray-500 text-sm ml-1">
                          ({deliveryLocations.find(loc => loc.id.toString() === selectedLocationId)?.name})
                        </span>
                      )}
                    </span>
                    <span>
                      {deliveryFee > 0 ? `D${Number(deliveryFee).toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>D{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

