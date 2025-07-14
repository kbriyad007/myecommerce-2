"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

interface ProductContent {
  name?: string;
  Price?: number | string;
  image?: string | { filename?: string };
}

interface StoryblokStory {
  uuid: string;
  full_slug: string;
  content: ProductContent;
}

interface Props {
  products: StoryblokStory[];
}

export default function SimilarProducts({ products }: Props) {
  if (!products || products.length === 0) {
    return <p className="text-gray-400 text-sm">No similar products found.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => {
          const { content } = p;

          const imageUrl =
            typeof content.image === "string"
              ? content.image.startsWith("//")
                ? `https:${content.image}`
                : content.image
              : content.image?.filename
              ? `https:${content.image.filename}`
              : "";

          const name = content.name || "Unnamed Product";
          const price = content.Price || "—";

          return (
            <div key={p.uuid} className="border rounded-lg p-4 hover:shadow transition bg-white">
              <Link href={`/${p.full_slug}`} className="block">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={name}
                    width={300}
                    height={200}
                    className="object-cover w-full h-40 mb-2 rounded"
                  />
                )}
                <div className="font-medium truncate">{name}</div>
                <div className="text-gray-600 text-sm mb-2">৳ {price}</div>
              </Link>

              <AddToCartButton
                product={{
                  name,
                  Price: price,
                  image: imageUrl,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
