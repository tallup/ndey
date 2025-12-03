"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface Stat {
    icon: any;
    value: number;
    label: string;
    suffix: string;
    color: string;
}

const stats: Stat[] = [
    { icon: Package, value: 70, label: "Products", suffix: "+", color: "from-blue-500 to-cyan-500" },
    { icon: Users, value: 500, label: "Happy Customers", suffix: "+", color: "from-purple-500 to-pink-500" },
    { icon: ShoppingCart, value: 1000, label: "Orders Delivered", suffix: "+", color: "from-orange-500 to-red-500" },
    { icon: TrendingUp, value: 99, label: "Satisfaction Rate", suffix: "%", color: "from-green-500 to-emerald-500" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
        <div ref={ref} className="text-4xl md:text-5xl font-bold">
            {count}{suffix}
        </div>
    );
}

export default function StatsCounter() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                className="text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br mb-4 group-hover:scale-110 transition-transform duration-300"
                                    style={{ backgroundImage: `linear-gradient(135deg, var(--primary-500), var(--accent-500))` }}
                                >
                                    <Icon className="w-8 h-8 text-white" />
                                </div>

                                <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                    <Counter value={stat.value} suffix={stat.suffix} />
                                </div>

                                <p className="text-gray-600 font-medium">{stat.label}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
