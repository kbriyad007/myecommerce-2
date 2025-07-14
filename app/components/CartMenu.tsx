"use client";

import { useCart } from "@/context/CartContext";
import { X, ShoppingCart, CheckCircle, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function CartMenu() {
  const { cart, removeFromCart, addToCart } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close cart on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node) &&
        (event.target as HTMLElement).id !== "cart-toggle-btn"
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleQuantityChange = (name: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const existingItem = cart.find((item) => item.name === name);
    if (!existingItem) return;
    const diff = newQuantity - existingItem.quantity;
    if (diff === 0) return;
    addToCart({ name, price: existingItem.price, quantity: diff });
  };

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0
  );

  return (
    <>
      {/* Floating Cart Button */}
      <button
        id="cart-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle cart"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:scale-105 transition"
      >
        <ShoppingCart className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full shadow">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Slide Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">🛒 Your Cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
            className="text-gray-500 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-grow overflow-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between border-b pb-4"
              >
                {/* Left: Icon + Details */}
                <div className="flex gap-3 items-start">
                  <CheckCircle className="text-green-500 w-5 h-5 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-blue-600 font-semibold text-sm">
                      ${item.price}
                    </p>
                  </div>
                </div>

                {/* Right: Quantity & Remove */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.name, Number(e.target.value))
                    }
                    className="w-16 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <button
                    onClick={() => removeFromCart(item.name)}
                    className="text-red-500 hover:text-red-600 transition"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-5 bg-white sticky bottom-0 left-0 w-full z-50 flex flex-col gap-3">
          <div className="flex justify-between items-center font-semibold text-lg text-gray-800">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="w-full text-center bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 font-semibold shadow-sm transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          aria-hidden="true"
        />
      )}
    </>
  );
}
