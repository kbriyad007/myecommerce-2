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
      <header className="bg-white shadow-md sticky top-0 z-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <h1 className="text-xl font-bold text-blue-600 tracking-tight">
            My<span className="text-gray-800">Store</span>
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search bar */}
          <div className="relative hidden md:block w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchValue && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 z-10">
                {suggestions
                  .filter((s) =>
                    s.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchValue(suggestion);
                        onSearch(suggestion);
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Login + Hamburger */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <button
              onClick={() => setShowLogin(true)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Login
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 border-t border-gray-100">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    onSearch(e.target.value);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchValue && suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 z-10">
                    {suggestions
                      .filter((s) =>
                        s.toLowerCase().includes(searchValue.toLowerCase())
                      )
                      .map((suggestion, index) => (
                        <li
                          key={index}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSearchValue(suggestion);
                            onSearch(suggestion);
                            setMobileMenuOpen(false);
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
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
