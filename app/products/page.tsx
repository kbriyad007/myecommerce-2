"use client";

import React, { useEffect, useState } from "react";
import { getStoryblokData } from "@/lib/storyblok"; // Your Storyblok fetch
import { ProductCard } from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

interface Product {
  name: string;
  price: number;
  image: string;
  category?: string;
  [key: string]: any; // In case more fields exist
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getStoryblokData("products");
      const rawProducts = data?.products || [];

      const productList: Product[] = rawProducts.map((item: any) => ({
        name: item.name,
        price: item.price,
        image:
          typeof item.image === "string"
            ? item.image
            : item.image?.filename || "",
        category: item.category,
        ...item,
      }));

      setProducts(productList);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(productList.map((p) => p.category).filter(Boolean))
      );

      setCategories(uniqueCategories);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category || "");

      return matchesCategory;
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategories]);

  return (
    <div className="px-4 md:px-8 py-6">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        onSelect={setSelectedCategories}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {filteredProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
