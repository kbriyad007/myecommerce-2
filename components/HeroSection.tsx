"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* ✅ Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80"
        alt="Hero Background"
        fill
        className="object-cover object-center z-0"
        priority
      />

      {/* ✅ Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* ✅ Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-12 text-center text-white">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] tracking-tight">
          Shop Smarter with <span className="text-blue-400">ShopVerse</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto mb-10 drop-shadow-sm">
          Discover unbeatable deals on quality products. Fast shipping, easy returns, and world-class support.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" passHref>
            <button className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-200 transition-all duration-300 shadow-lg hover:scale-105">
              🛒 Shop Now
            </button>
          </Link>
          <Link href="#" passHref>
            <button className="border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:scale-105">
              🔍 Learn More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
