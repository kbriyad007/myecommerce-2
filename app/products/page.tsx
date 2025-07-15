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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg font-semibold px-4">
        Loading products...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold px-4">
        ❌ {errorMsg}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg font-semibold px-4">
        No products found.
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-b from-white to-gray-100 min-h-screen font-sans">
      <Navbar
        onSearch={setSearchTerm}
        suggestions={products.map((p) => p.name || "")}
      />
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-16 drop-shadow-sm">
          ✨ Featured Products
        </h1>

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
          "
        >
          {filteredProducts.map((product, i) => {
            const slug = product.slug || slugify(product.name || `product-${i}`);
            const imageUrl = getImageUrl(product.image, product._version);
            return (
              <Link key={slug} href={`/products/${slug}`} passHref>
                <article
                  tabIndex={0}
                  className="
                    bg-white
                    rounded-xl
                    shadow-lg
                    cursor-pointer
                    flex
                    flex-col
                    overflow-hidden
                    focus:outline-none
                    focus:ring-4
                    focus:ring-blue-400
                  "
                  aria-label={`View details for ${product.name}`}
                >
                  <div className="relative w-full pt-[75%] bg-gray-100">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name || "Product image"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                        No image available
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 truncate">
                        {product.name || "Unnamed Product"}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                        {product.description}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <p className="text-blue-600 font-bold text-lg mb-3">
                        ${product.price ?? "N/A"}
                      </p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product, i);
                        }}
                        className={`
                          w-full
                          py-3
                          rounded-2xl
                          text-sm
                          font-semibold
                          text-white
                          shadow-md
                          bg-blue-600
                          hover:bg-blue-700
                          focus:outline-none
                          focus:ring-2
                          focus:ring-offset-2
                          focus:ring-blue-400
                        `}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        {addedToCartIndex === i ? "✔ Added" : "🛒 Add to Cart"}
                      </button>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center drop-shadow-sm">
          Why Shop With Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-6 bg-white rounded-xl shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              Fast Shipping
            </h3>
            <p className="text-gray-600 text-sm">
              We ensure quick delivery to your doorstep, always on time.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              Quality Products
            </h3>
            <p className="text-gray-600 text-sm">
              All our products are carefully selected to ensure the best quality.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              24/7 Support
            </h3>
            <p className="text-gray-600 text-sm">
              Our team is here to assist you anytime, anywhere.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-20 mb-10 px-4 max-w-7xl mx-auto">
        <CartMenu />
      </div>
    </main>
  );
}
