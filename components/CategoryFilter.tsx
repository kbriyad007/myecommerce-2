"use client";

import React, { useState } from "react";
import { Filter } from "lucide-react"; // modern and minimal icon

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onSelect: (categories: string[]) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  onSelect,
}: CategoryFilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCategory = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onSelect(updated);
  };

  return (
    <>
      {/* Mobile Floating Button */}
      <div className="fixed left-4 bottom-6 z-50 md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-full shadow-xl hover:bg-blue-700 transition-all"
          aria-label="Toggle Category Filter"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium text-sm">Filter</span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 p-6 border border-gray-200 rounded-xl shadow bg-white sticky top-24 self-start">
        <h3 className="text-xl font-semibold mb-5 text-gray-800">Categories</h3>
        <div className="flex flex-col gap-4">
          {categories.map((cat) => (
            <CategoryCheckbox
              key={cat}
              label={cat}
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleCategory(cat)}
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
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        ></div>

        {/* Slide-in Panel from Left */}
        <div
          className={`absolute top-0 bottom-0 left-0 bg-white w-72 rounded-r-2xl shadow-xl p-6 transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
            Filter by Category
          </h3>
          <div className="flex flex-col gap-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {categories.map((cat) => (
              <CategoryCheckbox
                key={cat}
                label={cat}
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
            ))}
          </div>
          <button
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => setMobileOpen(false)}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

interface CategoryCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function CategoryCheckbox({ label, checked, onChange }: CategoryCheckboxProps) {
  return (
    <label className="inline-flex items-center space-x-3 cursor-pointer select-none">
      <input
        type="checkbox"
        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-0"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-gray-700 capitalize text-sm">{label}</span>
    </label>
  );
}
