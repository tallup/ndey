"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { Category, Product } from "@/types/product";
import ProductGrid from "./ProductGrid";

// Component to display limited products for a category
function CategoryProducts({ categorySlug, limit = 4 }: { categorySlug: string; limit?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products", {
          params: {
            category: categorySlug,
            per_page: limit,
            sort_by: "created_at",
            sort_order: "desc",
          },
        });
        const productsData = response.data.data || response.data;
        setProducts(Array.isArray(productsData) ? productsData.slice(0, limit) : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(limit)].map((_, i) => (
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
        <p className="text-gray-500">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="group relative"
        >
          <Link href={`/products/${product.slug}`}>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
              {product.image ? (
                <img
                  src={product.image.startsWith('http') 
                    ? product.image 
                    : `http://localhost:8000/storage${product.image.startsWith('/') ? product.image : '/' + product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-sm">No Image</span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                D{parseFloat(product.price).toFixed(2)}
              </span>
              {product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price) && (
                <span className="text-sm text-gray-500 line-through">
                  D{parseFloat(product.compare_price).toFixed(2)}
                </span>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export default function CategorySections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        const categoriesData = response.data.data || response.data;
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-16">
              <div className="h-12 bg-gray-200 rounded w-64 mb-8 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: categoryIndex * 0.1,
                  duration: 0.6,
                },
              },
            }}
            className={`mb-20 ${categoryIndex !== categories.length - 1 ? 'border-b border-gray-200 pb-20' : ''}`}
          >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-gray-600 text-lg">{category.description}</p>
                )}
              </div>
              <Link
                href={`/products?category=${category.slug}`}
                className="hidden md:flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors group"
              >
                View All
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Products Grid for this Category */}
            <CategoryProducts categorySlug={category.slug} limit={4} />

            {/* Mobile View All Link */}
            <div className="mt-8 md:hidden text-center">
              <Link
                href={`/products?category=${category.slug}`}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors group"
              >
                View All {category.name}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

