"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, Package, History } from "lucide-react";
import { useRouter } from "next/navigation";

// Setup Supabase client
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
        router.push("/"); // redirect to home if not logged in
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/"); // redirect after logout
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 font-sans">
      {/* Header */}
      <header className="bg-white rounded-xl shadow-md px-6 py-4 flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Logged in as <span className="font-medium">{userEmail}</span></p>
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
      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Confirmation Section */}
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="text-blue-500 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-800">Order Confirmations</h2>
          </div>
          <p className="text-sm text-gray-600">
            Manage and confirm new customer orders. This section will later include real-time order data.
          </p>
        </section>

        {/* Order History Section */}
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <History className="text-green-500 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-800">Order History</h2>
          </div>
          <p className="text-sm text-gray-600">
            View past orders and customer activity. You can implement filtering by date, product, or status here.
          </p>
        </section>
      </main>
    </div>
  );
}
