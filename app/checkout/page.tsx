"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { FaUser, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function CheckoutPage() {
  const { cart } = useCart();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = () => {
    const newErrors = {
      name: form.name.trim() ? "" : "Name is required",
      address: form.address.trim() ? "" : "Address is required",
      phone: form.phone.trim() ? "" : "Phone number is required",
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((e) => e !== "");
    if (hasErrors) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderConfirmed(true);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (cart.length === 0 && !orderConfirmed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100 p-6">
        <div className="text-center bg-white shadow-md rounded-lg p-10 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500">Add items to begin checkout.</p>
        </div>
      </main>
    );
  }

  if (orderConfirmed) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-4 py-10 flex items-center justify-center print:bg-white print:p-0">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8 text-gray-800 print:shadow-none print:rounded-none print:p-4">
          <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Thank you for your order!</h1>
          <p className="text-gray-600 mb-6">Your order has been received and is being processed.</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">🧾 Order Summary</h2>
            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto print:overflow-visible">
              {cart.map((item) => (
                <li key={item.name} className="flex justify-between py-3">
                  <span className="font-medium">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-lg pt-4 border-t mt-4">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">📦 Shipping Info</h2>
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Address:</strong> {form.address}</p>
            <p><strong>Phone:</strong> {form.phone}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-md font-semibold transition"
            >
              🖨️ Print Order Summary
            </button>
            <button
              onClick={() => setOrderConfirmed(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition"
            >
              📦 Place Another Order
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 flex justify-center">
      <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 Your Order</h1>
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-gray-100 uppercase tracking-wider border-b text-xs">
              <tr>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-center px-4 py-3">Qty</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => {
                const subtotal = Number(item.price) * item.quantity;
                return (
                  <tr
                    key={item.name}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">{item.name}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">${Number(item.price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-bold">
                      ${subtotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-8 flex justify-end text-lg font-semibold text-gray-700">
            Total:
            <span className="text-blue-600 ml-2">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Form */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🚚 Shipping Info</h2>

          <div className="space-y-5 text-sm">
            {[
              { name: "name", label: "Name", icon: <FaUser /> },
              { name: "address", label: "Address", icon: <FaMapMarkerAlt /> },
              { name: "phone", label: "Phone", icon: <FaPhoneAlt /> },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    {field.icon} {field.label}
                  </div>
                </label>
                <input
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  type="text"
                  className={`w-full border ${
                    errors[field.name as keyof typeof errors]
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
                {errors[field.name as keyof typeof errors] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.name as keyof typeof errors]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`mt-8 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:to-blue-600 text-white text-sm font-semibold py-3 rounded-md shadow transition-all duration-200 ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg"
            }`}
          >
            {isSubmitting ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </main>
  );
}
