"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Package, Utensils, Coffee, Gift, Droplet, ShoppingBag, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: any;
    color: string;
    gradient: string;
}

const categoryIcons: Record<string, any> = {
    bowls: Utensils,
    cups: Coffee,
    spoons: Utensils,
    plates: Package,
    "lunch-bowls": ShoppingBag,
    bottles: Droplet,
    "gift-bags": Gift,
};

const categoryColors: Record<string, { color: string; gradient: string }> = {
    bowls: { color: "from-purple-500 to-pink-500", gradient: "bg-gradient-to-br from-purple-100 to-pink-100" },
    cups: { color: "from-blue-500 to-cyan-500", gradient: "bg-gradient-to-br from-blue-100 to-cyan-100" },
    spoons: { color: "from-green-500 to-emerald-500", gradient: "bg-gradient-to-br from-green-100 to-emerald-100" },
    plates: { color: "from-orange-500 to-red-500", gradient: "bg-gradient-to-br from-orange-100 to-red-100" },
    "lunch-bowls": { color: "from-indigo-500 to-purple-500", gradient: "bg-gradient-to-br from-indigo-100 to-purple-100" },
    bottles: { color: "from-cyan-500 to-blue-500", gradient: "bg-gradient-to-br from-cyan-100 to-blue-100" },
    "gift-bags": { color: "from-pink-500 to-rose-500", gradient: "bg-gradient-to-br from-pink-100 to-rose-100" },
};



export default function CategoryShowcase() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        // Fetch categories from API
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");
                const categoriesData = response.data.data || response.data;

                const enrichedCategories = categoriesData.map((cat: any) => ({
                    ...cat,
                    icon: categoryIcons[cat.slug] || Sparkles,
                    ...categoryColors[cat.slug] || { color: "from-gray-500 to-gray-600", gradient: "bg-gradient-to-br from-gray-100 to-gray-200" }
                }));

                setCategories(enrichedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="text-center mb-12"
                >
                    <motion.h2 variants={staggerItem} className="text-4xl font-bold mb-4">
                        Shop by <span className="gradient-text">Category</span>
                    </motion.h2>
                    <motion.p variants={staggerItem} className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover our wide range of products organized for your convenience
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <motion.div key={category.id} variants={staggerItem}>
                                <Link href={`/products?category=${category.slug}`}>
                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`${category.gradient} rounded-2xl p-6 hover-lift cursor-pointer group relative overflow-hidden`}
                                    >
                                        {/* Animated gradient overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                        <div className="relative z-10">
                                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>

                                            <h3 className="font-semibold text-lg mb-1 text-gray-800 group-hover:text-gray-900 transition-colors">
                                                {category.name}
                                            </h3>

                                            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                                                Explore collection →
                                            </p>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
