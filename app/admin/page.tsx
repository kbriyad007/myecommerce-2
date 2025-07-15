"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LogOut,
  Package,
  History,
  Users,
  BarChart2,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setUserEmail(user.email);
      } else {
        router.push("/");
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border border-gray-100 rounded-2xl shadow-lg px-6 py-5 flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Logged in as <span className="font-medium">{userEmail}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-md text-sm font-medium transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Order Confirmations */}
        <Card
          icon={<Package className="text-blue-500 w-5 h-5" />}
          title="Order Confirmations"
          desc="Manage and confirm customer orders. Add realtime data here later."
        />

        {/* Order History */}
        <Card
          icon={<History className="text-green-500 w-5 h-5" />}
          title="Order History"
          desc="View past orders and statuses. Filter by product, date, or user."
        />

        {/* Products */}
        <Card
          icon={<ShoppingBag className="text-indigo-500 w-5 h-5" />}
          title="Products"
          desc="Manage your product catalog, pricing, and stock availability."
        />

        {/* Customers */}
        <Card
          icon={<Users className="text-pink-500 w-5 h-5" />}
          title="Customers"
          desc="Access customer information and communication history."
        />

        {/* Analytics */}
        <Card
          icon={<BarChart2 className="text-yellow-500 w-5 h-5" />}
          title="Analytics"
          desc="Track sales, user activity, and business performance visually."
        />
      </main>
    </div>
  );
}

// 🔹 Reusable card component
function Card({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <section className="bg-white rounded-2xl shadow hover:shadow-md transition-all p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">{icon}<h2 className="text-lg font-semibold text-gray-800">{title}</h2></div>
      <p className="text-sm text-gray-600">{desc}</p>
    </section>
  );
}
