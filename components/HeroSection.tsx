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

      {/* ✅ Glass Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />

      {/* ✅ Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 py-16 text-center text-white">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
          Shop Smarter with{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            ShopVerse
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto mb-10">
          Unbeatable deals, premium products, lightning-fast delivery. Your perfect shopping experience starts now.
        </p>

        {/* ✅ Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" passHref>
            <button className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden text-base font-semibold text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 shadow-lg hover:scale-105">
              <span className="z-10">🛒 Shop Now</span>
              <span className="absolute inset-0 bg-white opacity-10 blur-lg"></span>
            </button>
          </Link>

          <Link href="#" passHref>
            <button className="relative px-8 py-3 text-base font-semibold text-white border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:scale-105">
              🔍 Learn More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}