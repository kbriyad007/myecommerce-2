"use client";

import { useCart } from "@/context/CartContext"; // ✅ adjust path if needed

interface Props {
  product: {
    name: string;
    Price?: number | string;
    image?: string;
  };
}

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();

  const handleClick = () => {
    const price =
      typeof product.Price === "string"
        ? parseFloat(product.Price)
        : product.Price ?? 0;

    addToCart({
      name: product.name,
      price,
      quantity: 1,
      image: product.image ?? "", // ✅ assuming CartItem type allows this
    });
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-sm bg-black text-white py-2 rounded hover:bg-gray-800 transition"
    >
      Add to Cart
    </button>
  );
}
