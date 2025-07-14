"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartMenu from "@/app/components/CartMenu";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import LoginFormSection from "@/components/LoginFormSection"; // 👈 Separated wrapper for login

interface MyProduct {
  component: string;
  name: string;
  description: string;
  image?: { filename: string } | string;
  price?: number | string;
  Price?: number | string;
  slug?: string;
  _version?: number;
}
interface StoryblokStory {
  slug: string;
  content: MyProduct;
  _version?: number;
}
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export default function Page() {
  const [products, setProducts] = useState<MyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<MyProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [addedToCartIndex, setAddedToCartIndex] = useState<number | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;
    if (!token) {
      setErrorMsg("❌ Storyblok token not found.");
      setLoading(false);
      return;
    }
    const url = `https://api.storyblok.com/v2/cdn/stories?starts_with=product&version=draft&token=${token}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const stories: StoryblokStory[] = data.stories || [];
        const productList: MyProduct[] = stories.map((story) => ({
          ...story.content,
          price: story.content.Price,
          slug: story.slug,
          _version: story._version,
        }));
        setProducts(productList);
        setFilteredProducts(productList);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleAddToCart = (product: MyProduct, index: number) => {
    const price =
      typeof product.Price === "string"
        ? parseFloat(product.Price)
        : product.Price;
    if (price === undefined || isNaN(price)) {
      alert("Invalid price");
      return;
    }
    addToCart({
      name: product.name || "Unnamed Product",
      price,
      quantity: 1,
    });
    setAddedToCartIndex(index);
    setTimeout(() => setAddedToCartIndex(null), 1500);
  };

  const getImageUrl = (
    image: MyProduct["image"],
    version?: number
  ): string | null => {
    if (typeof image === "string") {
      return image.startsWith("//") ? `https:${image}` : image;
    } else if (image?.filename) {
      return `https://a.storyblok.com${image.filename}?v=${version || "1"}`;
    }
    return null;
  };

  if (loading || errorMsg || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg font-medium px-4">
        {errorMsg ? `❌ ${errorMsg}` : "Loading products..."}
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen font-sans">
      <Navbar
        onSearch={setSearchTerm}
        suggestions={products.map((p) => p.name || "")}
      />
      <HeroSection />

      {/* ✅ Modular login section */}
      <LoginFormSection />

      <div className="px-2 py-2 lg:px-4 lg:py-16 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          ✨ Featured Products
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {filteredProducts.map((product, i) => {
            const slug = product.slug || slugify(product.name || `product-${i}`);
            const imageUrl = getImageUrl(product.image, product._version);
            return (
              <Link key={slug} href={`/products/${slug}`}>
                <div className="bg-white rounded-md shadow-lg hover:shadow-xl transition overflow-hidden group border border-gray-100">
                  <div className="relative w-full pt-[75%] bg-gray-100">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name || "Product image"}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-2 lg:p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                        {product.name || "Unnamed Product"}
                      </h2>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-blue-600 font-semibold text-base mb-2">
                        ${product.price ?? "N/A"}
                      </p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product, i);
                        }}
                        className={`w-full py-2 rounded-xl text-sm font-medium text-white transition ${
                          addedToCartIndex === i
                            ? "bg-green-600"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {addedToCartIndex === i ? "✔ Added" : "🛒 Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16">
          <CartMenu />
        </div>
      </div>
    </main>
  );
}
