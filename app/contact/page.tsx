"use client";

import { useState } from "react";
import { Mail, User, MessageSquare, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });

    setTimeout(() => setSubmitted(false), 5000); // auto-hide message after 5s
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-50 to-white px-4 py-16 font-sans">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 relative">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-4">📨 Contact Us</h1>
        <p className="text-center text-gray-600 mb-8">We're here to help. Let's talk!</p>

        {submitted && (
          <div className="flex items-center gap-3 text-green-600 bg-green-50 border border-green-200 p-4 rounded-md mb-6">
            <CheckCircle className="w-5 h-5" />
            <span>Thank you! We&apos;ll get back to you shortly.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <MessageSquare className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}
