"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartMenu from "@/app/components/CartMenu";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

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

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");

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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterMsg("Please enter a valid email.");
      return;
    }
    setNewsletterMsg("Thanks for subscribing!");
    setNewsletterEmail("");
  };

  if (loading || errorMsg || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg font-medium px-4">
        {errorMsg ? `❌ ${errorMsg}` : "Loading products..."}
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen font-sans pt-[70px]">
      <Navbar
        onSearch={setSearchTerm}
        suggestions={products.map((p) => p.name || "")}
      />
      <HeroSection />

      {/* Featured Deals Banner */}
      <section className="max-w-7xl mx-auto mt-12 px-6 py-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">
            🔥 Limited Time Deals!
          </h2>
          <p className="text-lg max-w-xl">
            Shop the best discounts of the season on select products. Hurry, while stocks last!
          </p>
        </div>
        <button
          onClick={() => {
            if (products.length) setSearchTerm(products[0].name || "");
          }}
          className="mt-4 md:mt-0 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          Start Shopping
        </button>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          ✨ Featured Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, i) => {
            const slug = product.slug || slugify(product.name || `product-${i}`);
            const imageUrl = getImageUrl(product.image, product._version);
            return (
              <Link key={slug} href={`/products/${slug}`} className="group block rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name || "Product image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg truncate mb-1">
                      {product.name || "Unnamed Product"}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-blue-600 font-semibold text-lg">
                      ${product.price ?? "N/A"}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product, i);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium text-white transition ${
                        addedToCartIndex === i
                          ? "bg-green-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {addedToCartIndex === i ? "✔ Added" : "🛒 Add to Cart"}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg mt-24 p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Subscribe to our Newsletter</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Get updates on new products and exclusive offers. No spam, we promise!
        </p>

        <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            required
            className="flex-grow border border-gray-300 rounded-l-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-r-lg px-6 py-3 transition"
          >
            Subscribe
          </button>
        </form>

        {newsletterMsg && (
          <p className="mt-4 text-green-600 font-medium">{newsletterMsg}</p>
        )}
      </section>

      {/* Cart Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-12">
        <CartMenu />
      </div>
    </main>
  );
}
