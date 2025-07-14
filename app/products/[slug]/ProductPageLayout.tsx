"use client";

import Image from "next/image";
import ProductDetailsClient from "./ProductDetailsClient";
import CartWrapper from "./CartWrapper";
import SimilarProducts from "@/components/SimilarProducts";

interface StoryblokProduct {
  uuid: string;
  full_slug: string;
  content: {
    name?: string;
    Price?: number | string;
    image?: string | { filename?: string };
    Category?: string | object | null;
  };
}

interface MyProduct {
  name: string;
  description: string;
  Price?: number | string;
  image?: { filename: string } | string;
}

interface Props {
  product: MyProduct;
  imageUrl: string | null;
  similarProducts: StoryblokProduct[];
}

export default function ProductPageLayout({ product, imageUrl, similarProducts }: Props) {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-50 py-12 px-6 sm:px-12 lg:px-24 xl:px-32">
      <div className="max-w-screen-lg mx-auto grid lg:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-300 hover:shadow-3xl transition-shadow duration-500 ease-in-out">
          <div className="aspect-[4/3] relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name || "Product"}
                fill
                className="object-cover transform transition-transform duration-500 hover:scale-110"
                unoptimized
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg font-semibold">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <section className="flex flex-col justify-between h-full space-y-6">
          <ProductDetailsClient
            name={product.name}
            description={product.description}
            price={product.Price}
          />
        </section>
      </div>

      {/* Cart */}
      <div className="mt-16 max-w-screen-lg mx-auto">
        <CartWrapper />
      </div>

      {/* Similar Products */}
      <div className="mt-20 max-w-screen-lg mx-auto">
        <SimilarProducts products={similarProducts} />
      </div>
    </main>
  );
}
