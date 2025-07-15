"use client";

import { useState } from "react";
import LoginFormSection from "./LoginFormSection";

interface NavbarProps {
  onSearch: (value: string) => void;
  suggestions: string[];
}

export default function Navbar({ onSearch, suggestions }: NavbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const handleInput = (value: string) => {
    setSearchValue(value);
    onSearch(value); // Update search term in page
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">My Store</h1>

          <div className="relative flex-1 mx-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => handleInput(e.target.value)}
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
                        handleInput(suggestion);
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => setShowLogin(true)}
            className="text-blue-600 font-medium text-sm hover:underline"
          >
            Login
          </button>
        </div>
      </header>

      {/* ✅ Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
            <LoginFormSection />
          </div>
        </div>
      )}
    </>
  );
}


