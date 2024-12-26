"use client";

import Link from "next/link";

export default function CCUPage() {
  const subcategories = [
    { name: "Collections", link: "/ccu/collections" },
    { name: "Recoveries", link: "/ccu/recoveries" },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInNoMove {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fadeInNoMove {
          animation: fadeInNoMove 0.8s ease-in forwards;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between animate-fadeInNoMove">
            <h2 className="text-xl font-bold text-gray-800">
              CCU - Centralized Credit Unit
            </h2>
            <nav className="space-x-4">
              {/* Link back to Dashboard */}
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 max-w-6xl mx-auto py-10 px-4 animate-fadeInNoMove">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {subcategories.map((sub) => (
              <Link
                key={sub.name}
                href={sub.link}
                className="block px-6 py-3 rounded bg-[#1e99c6] text-white text-lg font-semibold hover:bg-blue-700 transition"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
