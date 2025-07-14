"use client";

import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  suggestions: string[]; // receive product names from parent
}

export default function SearchBar({ onSearch, suggestions }: SearchBarProps) {
  const [term, setTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (term.trim() === "") {
      setFiltered([]);
      return;
    }

    const matches = suggestions.filter((item) =>
      item.toLowerCase().includes(term.toLowerCase())
    );
    setFiltered(matches.slice(0, 5)); // limit to 5 suggestions
  }, [term, suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    onSearch(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (value: string) => {
    setTerm(value);
    onSearch(value);
    setShowSuggestions(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-96" ref={inputRef}>
      <input
        type="text"
        value={term}
        onChange={handleInputChange}
        placeholder="🔍 Search products..."
        className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
      />
      {showSuggestions && filtered.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg overflow-hidden">
          {filtered.map((item, idx) => (
            <li
              key={idx}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
              onClick={() => handleSuggestionClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
