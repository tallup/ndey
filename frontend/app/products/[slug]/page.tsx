"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus, MessageCircle } from "lucide-react";
import { Product } from "@/types/product";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import Header from "@/components/Header";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${slug}`);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setSelectedImage(0);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      // Show notification (you can add a toast library later)
      alert(`${product.name} added to cart!`);
    }
  };

  const handleWhatsAppClick = () => {
    if (!product) return;
    
    // WhatsApp numbers from backend config (3740280, 3569074)
    // Use first number as primary contact
    const whatsappNumber = "3740280"; // Primary WhatsApp number
    
    // Format message with product details
    const message = encodeURIComponent(
      `Hello! I'm interested in:\n\n` +
      `*${product.name}*\n` +
      `Price: D${product.price}\n` +
      `Quantity: ${quantity}\n` +
      `${product.size ? `Size: ${product.size}\n` : ''}` +
      `${product.capacity ? `Capacity: ${product.capacity}\n` : ''}` +
      `${product.material ? `Material: ${product.material}\n` : ''}` +
      `${product.color ? `Color: ${product.color}\n` : ''}` +
      `\nPlease let me know about availability and delivery options.`
    );
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 aspect-square rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products" className="text-blue-600 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
              {images.length > 0 ? (
                <Image
                  src={`http://localhost:8000/storage/${images[selectedImage]}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-black"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={`http://localhost:8000/storage/${img}`}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {product.category && (
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="text-sm text-blue-600 hover:underline mb-2 inline-block"
                >
                  {product.category.name}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold">D{product.price}</span>
                {product.compare_price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      D{product.compare_price}
                    </span>
                    {product.discount_percentage && (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                        Save {product.discount_percentage}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-3 mb-6">
                {product.product_type && (
                  <div className="flex">
                    <span className="font-semibold w-24">Type:</span>
                    <span className="capitalize">{product.product_type.replace('_', ' ')}</span>
                  </div>
                )}
                {product.size && (
                  <div className="flex">
                    <span className="font-semibold w-24">Size:</span>
                    <span className="capitalize">{product.size}</span>
                  </div>
                )}
                {product.capacity && (
                  <div className="flex">
                    <span className="font-semibold w-24">Capacity:</span>
                    <span>{product.capacity}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex">
                    <span className="font-semibold w-24">Material:</span>
                    <span>{product.material}</span>
                  </div>
                )}
                {product.color && (
                  <div className="flex">
                    <span className="font-semibold w-24">Color:</span>
                    <span>{product.color}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="font-semibold w-24">Stock:</span>
                  <span className={product.quantity > 0 ? "text-green-600" : "text-red-600"}>
                    {product.quantity > 0 ? `In Stock (${product.quantity})` : "Out of Stock"}
                  </span>
                </div>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h2 className="font-semibold mb-2">Description</h2>
                  <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                </div>
              )}

              {/* Add to Cart & WhatsApp */}
              {product.quantity > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">Quantity:</span>
                    <div className="flex items-center gap-2 border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                        className="p-2 hover:bg-gray-100"
                        disabled={quantity >= product.quantity}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={handleWhatsAppClick}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                      title="Contact via WhatsApp"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    disabled
                    className="w-full px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-semibold"
                  >
                    Out of Stock
                  </button>
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Contact via WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

