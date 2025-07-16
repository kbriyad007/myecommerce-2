"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle, User } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const dummySuggestions = ["Modern Shop", "Product A", "Product B", "Contact"];

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Navbar onSearch={setSearchTerm} suggestions={dummySuggestions} />

      <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-2">
              Contact Our Team
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Let&apos;s talk! Whether you have questions, ideas, or feedback —
              we&apos;re here to help you.
            </p>
          </div>

          {submitted && (
            <div className="flex items-center gap-3 text-green-600 bg-green-50 border border-green-200 p-4 rounded-md mb-6 max-w-xl mx-auto">
              <CheckCircle className="w-5 h-5" />
              <span>Thank you! We&apos;ll get back to you shortly.</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Contact Info */}
            <div className="space-y-6 text-gray-700">
              <div className="flex items-start gap-4">
                <MapPin className="text-blue-600 w-5 h-5 mt-1" />
                <div>
                  <h4 className="font-semibold text-base text-gray-800">
                    Office Location
                  </h4>
                  <p className="text-sm">123 Next.js Street, Tech City, BD</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-blue-600 w-5 h-5 mt-1" />
                <div>
                  <h4 className="font-semibold text-base text-gray-800">Call Us</h4>
                  <p className="text-sm">+880 1234 567890</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="text-blue-600 w-5 h-5 mt-1" />
                <div>
                  <h4 className="font-semibold text-base text-gray-800">
                    Email Support
                  </h4>
                  <p className="text-sm">help@modernshop.com</p>
                </div>
              </div>

              <div className="mt-10 border-t pt-6">
                <h4 className="text-gray-800 font-semibold mb-2 text-base">
                  Office Hours
                </h4>
                <p className="text-sm text-gray-600">Sun - Thu: 9:00 AM - 6:00 PM</p>
                <p className="text-sm text-gray-600">Friday: Closed</p>
              </div>
            </div>

            {/* Contact Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-4 border border-gray-100"
            >
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows={5}
                  required
                  className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-md text-sm font-medium"
              >
                <Send size={16} />
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
