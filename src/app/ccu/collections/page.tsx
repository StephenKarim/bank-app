"use client";

import Link from "next/link";

export default function CollectionsPage() {
  const subcategories = [
    { name: "Relegation Team", link: "/ccu/collections/relegation-team" },
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
            <h1 className="text-xl font-bold text-gray-800">Collections</h1>
            <nav className="space-x-4">
              {/* Link back to CCU */}
              <Link
                href="/ccu"
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                CCU
              </Link>
              {/* Link to Dashboard */}
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 max-w-6xl mx-auto py-10 px-4 animate-fadeInNoMove">
          <div className="grid gap-4">
            {subcategories.map((sub) => (
              <Link
                key={sub.name}
                href={sub.link}
                className="block px-6 py-3 rounded bg-green-600 text-white text-lg font-semibold hover:bg-green-700 transition"
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
