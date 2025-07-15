"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginFormSection from "./LoginFormSection";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onSearch: (value: string) => void;
  suggestions: string[];
}

export default function Navbar({ onSearch, suggestions }: NavbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = () => {
    setShowLogin(false);
    router.push("/admin");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-sm shadow-md shadow-black/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            My<span className="text-gray-800">Store</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search bar (desktop only) */}
          <div className="hidden md:block relative w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {searchValue && suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
                {suggestions
                  .filter((s) =>
                    s.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .map((suggestion, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setSearchValue(suggestion);
                        onSearch(suggestion);
                      }}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Right-side buttons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Login
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 border-t border-gray-200 bg-white/90 backdrop-blur-sm shadow-inner">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Search */}
            <div className="relative mt-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {searchValue && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
                  {suggestions
                    .filter((s) =>
                      s.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((suggestion, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setSearchValue(suggestion);
                          onSearch(suggestion);
                          setMobileMenuOpen(false);
                        }}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {suggestion}
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
            >
              ×
            </button>
            <LoginFormSection onSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </>
  );
}
