"use client";

import Link from "next/link";

export default function Dashboard() {
  const units = [
    { name: "Business Support Services (BSS)", link: "/bss", disabled: true },
    { name: "Account and Trade Services (ATS)", link: "/ats", disabled: true },
    { name: "Centralised Securities Unit (CSU)", link: "/csu", disabled: true },
    { name: "Customer Care and Support Centre (CC&SC)", link: "/ccsc", disabled: true },
    { name: "Data Processing Services (DPS)", link: "/dps", disabled: true },
    { name: "Electronic Channels Support Services (ECSS)", link: "/ecss", disabled: true },
    { name: "Centralized Credit Unit (CCU)", link: "/ccu", disabled: false },
    { name: "Loan Delivery Centre (LDC)", link: "/ldc", disabled: true },
  ];

  return (
    <>
      {/* Global styles for a simple no-move fadeIn */}
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
        {/* Header with link to Dashboard (self) and Home - you can adjust links as needed */}
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between animate-fadeInNoMove">
            <h2 className="text-xl font-bold text-gray-800">
              Shared Services Division
            </h2>
            <nav className="space-x-4">
              {/* “Home” or any other global link */}
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Home
              </Link>
              {/* “Dashboard” - though we’re already on Dashboard, it’s in the spec. */}
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        {/* Main content fades in with no movement */}
        <main className="flex-1 max-w-6xl mx-auto py-10 px-4 animate-fadeInNoMove">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {units.map((unit) => {
              if (unit.disabled) {
                return (
                  <div
                    key={unit.name}
                    className="rounded-lg shadow bg-white p-5 opacity-60 cursor-not-allowed"
                  >
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">
                      {unit.name}
                    </h3>
                    <p className="text-xs text-gray-400">In Development</p>
                  </div>
                );
              }
              // Active link (CCU)
              return (
                <Link
                  key={unit.name}
                  href={unit.link}
                  className="rounded-lg shadow bg-white p-5 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-[#1e99c6]">
                    {unit.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Republic Bank Limited
          </div>
        </footer>
      </div>
    </>
  );
}
