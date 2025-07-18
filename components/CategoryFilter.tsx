"use client";

import React, { useState } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (category: string) => {
    onSelect(category);
    setMobileOpen(false); // close on mobile after selection
  };

  return (
    <>
      {/* Floating toggle button for mobile */}
      <button
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle category filter"
      >
        {mobileOpen ? "✕" : "⚙️"}
      </button>

      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-56 p-4 border border-gray-200 rounded-md shadow-sm bg-white sticky top-20 self-start">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="flex flex-col space-y-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              className="form-radio"
              checked={selectedCategory === "All"}
              onChange={() => onSelect("All")}
            />
            <span className="ml-2 text-gray-700">All</span>
          </label>
          {categories.map((cat) => (
            <label key={cat} className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                className="form-radio"
                checked={selectedCategory === cat}
                onChange={() => handleSelect(cat)}
              />
              <span className="ml-2 text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      </aside>

      {/* Floating panel for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center px-4">
          <div className="bg-white rounded-md p-6 w-full max-w-xs shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="flex flex-col space-y-3 max-h-64 overflow-y-auto">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="category-mobile"
                  className="form-radio"
                  checked={selectedCategory === "All"}
                  onChange={() => handleSelect("All")}
                />
                <span className="ml-2 text-gray-700">All</span>
              </label>
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="inline-flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category-mobile"
                    className="form-radio"
                    checked={selectedCategory === cat}
                    onChange={() => handleSelect(cat)}
                  />
                  <span className="ml-2 text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md"
              onClick={() => setMobileOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}