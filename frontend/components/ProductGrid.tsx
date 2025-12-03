"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Package } from "lucide-react";
import { Product } from "@/types/product";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";

interface ProductGridProps {
  featured?: boolean;
  category?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default function ProductGrid({ featured, category, sortBy = 'created_at', sortOrder = 'desc' }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (featured) params.featured = true;
        if (category) params.category = category;
        if (sortBy) params.sort_by = sortBy;
        if (sortOrder) params.sort_order = sortOrder;

        // Get search query from URL
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const search = urlParams.get('search');
          if (search) params.search = search;
        }

        const response = await api.get("/products", { params });
        const productsData = response.data.data || response.data;
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [featured, category, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative"
        >
          <Link href={`/products/${product.slug}`}>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
              {product.image && !imageErrors.has(product.id) ? (
                (() => {
                  const imageUrl = product.image.startsWith('http') 
                    ? product.image 
                    : `http://localhost:8000/storage${product.image.startsWith('/') ? product.image : '/' + product.image}`;
                  return (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={() => {
                        console.error('Image failed to load:', imageUrl);
                        setImageErrors(prev => new Set(prev).add(product.id));
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', imageUrl);
                      }}
                    />
                  );
                })()
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Package className="w-16 h-16" />
                </div>
              )}

              {product.discount_percentage && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  -{product.discount_percentage}%
                </div>
              )}

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-1 group-hover:text-gray-600 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold">D{product.price}</span>
                {product.compare_price && (
                  <span className="text-sm text-gray-500 line-through">
                    D{product.compare_price}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem(product, 1);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

