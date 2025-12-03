"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { fadeIn } from "@/lib/animations";

interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Event Planner",
        content: "The quality of the products is outstanding! Perfect for all my events. The transparent bowls and cups are exactly what I needed for my catering business.",
        rating: 5,
        avatar: "SJ"
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Restaurant Owner",
        content: "Fast delivery and excellent customer service. The bulk pricing is very competitive. I've been ordering from them for over a year now.",
        rating: 5,
        avatar: "MC"
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Party Organizer",
        content: "Love the variety of colors and sizes! Makes party planning so much easier. The colorful sets are always a hit with my clients.",
        rating: 5,
        avatar: "ER"
    },
    {
        id: 4,
        name: "David Thompson",
        role: "Cafe Manager",
        content: "Reliable products at great prices. Will definitely order again! The premium plastic line is perfect for our takeaway service.",
        rating: 5,
        avatar: "DT"
    }
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => {
            const next = prev + newDirection;
            if (next < 0) return testimonials.length - 1;
            if (next >= testimonials.length) return 0;
            return next;
        });
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4">
                        What Our <span className="gradient-text">Customers Say</span>
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Don't just take our word for it - hear from our satisfied customers
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto relative">
                    <div className="relative h-96 flex items-center justify-center">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="absolute w-full"
                            >
                                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative">
                                    {/* Quote icon */}
                                    <div className="absolute top-8 left-8 text-purple-200">
                                        <Quote className="w-12 h-12" />
                                    </div>

                                    <div className="relative z-10">
                                        {/* Rating */}
                                        <div className="flex justify-center gap-1 mb-6">
                                            {[...Array(currentTestimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>

                                        {/* Content */}
                                        <p className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed">
                                            "{currentTestimonial.content}"
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                                {currentTestimonial.avatar}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-gray-900">{currentTestimonial.name}</p>
                                                <p className="text-gray-600 text-sm">{currentTestimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={() => paginate(-1)}
                            className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <button
                            onClick={() => paginate(1)}
                            className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>

                    {/* Dots indicator */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setDirection(index > currentIndex ? 1 : -1);
                                    setCurrentIndex(index);
                                }}
                                className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-purple-600" : "w-2 bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
