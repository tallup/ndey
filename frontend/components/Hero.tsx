"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Zap, Star } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Product } from "@/types/product";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products", { params: { featured: true } });
        const productsData = response.data.data || response.data;
        setProducts(Array.isArray(productsData) ? productsData.slice(0, 6) : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white min-h-[700px] md:min-h-[800px]">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 animate-gradient" style={{ backgroundSize: "200% 200%" }} />

      {/* Floating shapes */}
      <motion.div
        className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-pink-400/30 to-purple-400/30 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Premium Quality Products</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
            >
              Discover Your
              <span className="block bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Perfect Style
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-purple-100 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Explore our curated collection of premium products designed for the modern lifestyle. Quality meets affordability.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-purple-900 font-bold rounded-full hover:bg-purple-50 transition-all shadow-xl"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/categories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/50 text-white font-bold rounded-full hover:bg-white/10 backdrop-blur-sm transition-all"
                >
                  Browse Categories
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-purple-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>70+ Products</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Secure Payment</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Animated Product Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[500px] hidden lg:block"
          >
            {!loading && products.length > 0 && (
              <div className="relative w-full h-full">
                {/* Product 1 - Top Left */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute top-0 left-0 w-48 h-48"
                >
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative w-full h-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 group-hover:opacity-0 transition-opacity" />
                    {products[0]?.image && (
                      <Image
                        src={products[0].image.startsWith('http') ? products[0].image : `http://localhost:8000/storage${products[0].image.startsWith('/') ? products[0].image : '/' + products[0].image}`}
                        alt={products[0].name}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    )}
                  </motion.div>
                </motion.div>

                {/* Product 2 - Top Right */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="absolute top-12 right-0 w-40 h-40"
                >
                  <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="relative w-full h-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:opacity-0 transition-opacity" />
                    {products[1]?.image && (
                      <Image
                        src={products[1].image.startsWith('http') ? products[1].image : `http://localhost:8000/storage${products[1].image.startsWith('/') ? products[1].image : '/' + products[1].image}`}
                        alt={products[1].name}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    )}
                  </motion.div>
                </motion.div>

                {/* Product 3 - Middle Left */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="absolute top-52 left-8 w-44 h-44"
                >
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    whileHover={{ scale: 1.1, rotate: 8 }}
                    className="relative w-full h-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:opacity-0 transition-opacity" />
                    {products[2]?.image && (
                      <Image
                        src={products[2].image.startsWith('http') ? products[2].image : `http://localhost:8000/storage${products[2].image.startsWith('/') ? products[2].image : '/' + products[2].image}`}
                        alt={products[2].name}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    )}
                  </motion.div>
                </motion.div>

                {/* Product 4 - Middle Right */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  className="absolute top-64 right-12 w-36 h-36"
                >
                  <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    whileHover={{ scale: 1.1, rotate: -8 }}
                    className="relative w-full h-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 group-hover:opacity-0 transition-opacity" />
                    {products[3]?.image && (
                      <Image
                        src={products[3].image.startsWith('http') ? products[3].image : `http://localhost:8000/storage${products[3].image.startsWith('/') ? products[3].image : '/' + products[3].image}`}
                        alt={products[3].name}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    )}
                  </motion.div>
                </motion.div>

                {/* Product 5 - Bottom Left */}
                {products[4] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.6 }}
                    className="absolute bottom-8 left-16 w-32 h-32"
                  >
                    <motion.div
                      animate={{ y: [0, -18, 0] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative w-full h-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 group-hover:opacity-0 transition-opacity" />
                      {products[4].image && (
                        <Image
                          src={products[4].image.startsWith('http') ? products[4].image : `http://localhost:8000/storage${products[4].image.startsWith('/') ? products[4].image : '/' + products[4].image}`}
                          alt={products[4].name}
                          fill
                          className="object-cover"
                          unoptimized={true}
                        />
                      )}
                    </motion.div>
                  </motion.div>
                )}

                {/* Product 6 - Bottom Right */}
                {products[5] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="absolute bottom-0 right-4 w-38 h-38"
                  >
                    <motion.div
                      animate={{ y: [0, 12, 0] }}
                      transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="relative w-full h-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:opacity-0 transition-opacity" />
                      {products[5].image && (
                        <Image
                          src={products[5].image.startsWith('http') ? products[5].image : `http://localhost:8000/storage${products[5].image.startsWith('/') ? products[5].image : '/' + products[5].image}`}
                          alt={products[5].name}
                          fill
                          className="object-cover"
                          unoptimized={true}
                        />
                      )}
                    </motion.div>
                  </motion.div>
                )}

                {/* Decorative floating icons */}
                <motion.div
                  className="absolute top-1/4 left-1/3 text-white/10"
                  animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
                <motion.div
                  className="absolute bottom-1/4 right-1/3 text-white/10"
                  animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                >
                  <Star className="w-10 h-10" />
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

