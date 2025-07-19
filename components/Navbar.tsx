"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import LoginFormSection from "./LoginFormSection";

interface NavbarProps {
  onSearch: (value: string) => void;
  suggestions: string[];
}

export default function Navbar({ onSearch, suggestions }: NavbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = () => {
    setShowLogin(false);
    router.push("/admin"); // Or your dashboard route
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-md shadow shadow-black/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Modern<span className="text-gray-900">Shop</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search bar (desktop) */}
          <div className="hidden lg:block relative w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {searchValue && suggestions.length > 0 && (
              <ul className="absolute mt-1 bg-white w-full shadow-lg border rounded-md z-10 max-h-60 overflow-auto">
                {suggestions
                  .filter((s) =>
                    s.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .map((s, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setSearchValue(s);
                        onSearch(s);
                      }}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {s}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Login
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-gray-700"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden px-4 pb-4 pt-2 bg-white/90 backdrop-blur-md shadow-inner border-t border-gray-200">
            <nav className="flex flex-col gap-3 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-800 font-medium hover:text-blue-600 transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {searchValue && suggestions.length > 0 && (
                <ul className="absolute mt-1 bg-white w-full shadow-lg border rounded-md z-10 max-h-60 overflow-auto">
                  {suggestions
                    .filter((s) =>
                      s.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((s, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setSearchValue(s);
                          onSearch(s);
                          setMobileOpen(false);
                        }}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        {s}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
              aria-label="Close login modal"
            >
              ×
            </button>
            <LoginFormSection
              onSuccess={handleLoginSuccess}
              onClose={() => setShowLogin(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
