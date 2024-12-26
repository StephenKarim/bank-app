"use client";

import Link from "next/link";

export default function RelegationTeamPage() {
  const subcategories = [
    {
      name: "Create A19 Form",
      link: "/ccu/collections/relegation-team/create-a19-form",
    },
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
            <h1 className="text-xl font-bold text-gray-800">Relegation Team</h1>
            <nav className="space-x-4">
              {/* Link back to Collections */}
              <Link
                href="/ccu/collections"
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Collections
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
                className="block px-6 py-3 rounded bg-[#1e99c6] text-white text-lg font-semibold hover:bg-[#95348D] transition"
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
