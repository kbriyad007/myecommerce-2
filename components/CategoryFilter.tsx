"use client";

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react"; // modern icon

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
    setMobileOpen(false); // Close after selecting on mobile
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-full shadow-xl hover:bg-blue-700 transition-all"
          aria-label="Toggle Category Filter"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-60 p-5 border border-gray-200 rounded-xl shadow bg-white sticky top-24 self-start">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
        <div className="flex flex-col space-y-3">
          <CategoryRadio
            name="category"
            label="All"
            checked={selectedCategory === "All"}
            onChange={() => onSelect("All")}
          />
          {categories.map((cat) => (
            <CategoryRadio
              key={cat}
              name="category"
              label={cat}
              checked={selectedCategory === cat}
              onChange={() => onSelect(cat)}
            />
          ))}
        </div>
      </aside>

      {/* Mobile Overlay Panel */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        {/* Background dim */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        ></div>

        {/* Slide-up Panel */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl p-6 transform transition-transform duration-300 ${
            mobileOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
            Filter by Category
          </h3>
          <div className="flex flex-col space-y-4 max-h-64 overflow-y-auto">
            <CategoryRadio
              name="category-mobile"
              label="All"
              checked={selectedCategory === "All"}
              onChange={() => handleSelect("All")}
            />
            {categories.map((cat) => (
              <CategoryRadio
                key={cat}
                name="category-mobile"
                label={cat}
                checked={selectedCategory === cat}
                onChange={() => handleSelect(cat)}
              />
            ))}
          </div>
          <button
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => setMobileOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

interface CategoryRadioProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function CategoryRadio({ name, label, checked, onChange }: CategoryRadioProps) {
  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      <input
        type="radio"
        name={name}
        className="form-radio h-5 w-5 text-blue-600"
        checked={checked}
        onChange={onChange}
      />
      <span className="ml-3 text-gray-700 capitalize">{label}</span>
    </label>
  );
}
