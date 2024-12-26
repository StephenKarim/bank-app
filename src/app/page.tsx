"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Global style for custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-in-out forwards;
        }

        @keyframes fadeInSlow {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 1.2s ease-in-out forwards;
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          60% {
            opacity: 1;
            transform: scale(1.05);
          }
          80% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out forwards;
        }
      `}</style>

      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header / Nav Bar */}
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-2xl font-extrabold text-[#1e99c6] animate-fadeIn">
              Republic Bank Limited
            </div>
            <nav className="hidden sm:block">
              {/* Example Nav Link */}
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 ml-6 transition"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800 animate-fadeIn">
              Internal Banking App
            </h1>
            <p className="text-gray-700 mb-8 text-lg max-w-md mx-auto animate-fadeInSlow">
              Streamline department workflows, manage customer data, and keep
              operations running smoothly—all within our secure internal system.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-[#1e99c6] text-white py-3 px-8 rounded-full font-semibold hover:bg-[#1681a8] transition animate-bounceIn shadow-md"
            >
              Enter Dashboard
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Republic Bank Limited. Internal
            Use Only.
          </div>
        </footer>
      </div>
    </>
  );
}
