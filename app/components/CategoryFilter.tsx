"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react"; // You can replace with any icon
import clsx from "clsx";

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
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Handle mobile responsiveness
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggle = () => setShowFilters(!showFilters);

  const renderButtons = (
    <>
      <button
        onClick={() => onSelect("All")}
        className={clsx(
          "px-4 py-2 rounded-full text-sm font-medium transition",
          selectedCategory === "All"
            ? "bg-blue-600 text-white shadow"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium transition",
            selectedCategory === cat
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {cat}
        </button>
      ))}
    </>
  );

  return (
    <div className="relative w-full">
      {/* Mobile Filter Toggle */}
      {isMobile && (
        <div className="flex justify-center mb-4">
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      )}

      {/* Filter Buttons */}
      <div
        className={clsx(
          "flex justify-center flex-wrap gap-3 transition-all duration-300 ease-in-out",
          isMobile
            ? showFilters
              ? "max-h-[200px] opacity-100 scale-100 mb-6"
              : "max-h-0 opacity-0 scale-95 overflow-hidden"
            : "mb-6"
        )}
      >
        {renderButtons}
      </div>
    </div>
  );
}
