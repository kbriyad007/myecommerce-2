"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import AuthModal from "./AuthModal"; // ✅ Import the modal

interface NavbarProps {
  onSearch: (val: string) => void;
  suggestions: string[];
}

export default function Navbar({ onSearch, suggestions }: NavbarProps) {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-90 transition-opacity duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 8h14l-1.5 9h-11L5 8zM7 8V6a5 5 0 0110 0v2"
              />
            </svg>
            <span>MyShop</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex gap-6 text-sm font-medium text-gray-700 items-center">
              {["Home", "Products", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    <span className="hover:underline underline-offset-4 decoration-2 decoration-blue-500">
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hover:text-blue-600 transition-colors"
                >
                  <span className="hover:underline underline-offset-4 decoration-2 decoration-blue-500">
                    Login
                  </span>
                </button>
              </li>
            </ul>

            {/* Search */}
            <div className="relative flex items-center w-64">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <SearchBar onSearch={onSearch} suggestions={suggestions} />
            </div>
          </div>

          {/* Cart + Hamburger */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link
              href="/checkout"
              className="relative hover:text-blue-600 transition"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full px-1.5 font-semibold select-none">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600 transition"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t px-4 pb-4 pt-2 bg-white shadow-sm">
            <ul className="flex flex-col gap-3 text-sm font-medium text-gray-700">
              {["Home", "Products", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                    className="block hover:text-blue-600 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowAuthModal(true);
                  }}
                  className="text-left w-full hover:text-blue-600 transition"
                >
                  Login
                </button>
              </li>
            </ul>
            <div className="mt-4 flex items-center border rounded-lg px-3 py-2 bg-gray-100">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <SearchBar onSearch={onSearch} suggestions={suggestions} />
            </div>
          </div>
        )}
      </header>

      {/* ✅ Reusable AuthModal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
