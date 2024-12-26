"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface GeneralInformation {
  id: number;
  date: string;
  branch: string;
  address1: string;
  address2: string;
  country: string;
  cautionCategory: string;
  status?: string;
}
interface Debtor {
  id: number;
  firstName: string;
  lastName: string;
}
interface Liability {
  id: number;
  liabilities: number;
}
interface RelegatedGroup {
  rimNumber: string;
  generalInformation?: GeneralInformation;
  debtors?: Debtor[];
  liabilities?: Liability[];
  totalLiabilities?: number;
}

export default function PortfoliosPage() {
  const [groups, setGroups] = useState<RelegatedGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("/api/ccuClassifiedDebts");
        const json = await res.json();
        if (json.success) {
          setGroups(json.data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  if (loading) {
    return <div className="p-4">Loading data...</div>;
  }

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
            <h1 className="text-xl font-bold text-gray-800">
              Classified Debts (Portfolios)
            </h1>
            <nav className="space-x-4">
              {/* Link back to Classified Debts */}
              <Link
                href="/ccu/recoveries/classified-debts"
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Classified Debts
              </Link>
              {/* Dashboard */}
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
          <table className="table-auto w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 border">RIM Number</th>
                <th className="px-2 py-1 border">Branch</th>
                <th className="px-2 py-1 border">Status</th>
                <th className="px-2 py-1 border">Date</th>
                <th className="px-2 py-1 border">Address</th>
                <th className="px-2 py-1 border">Caution Category</th>
                <th className="px-2 py-1 border">First Debtor</th>
                <th className="px-2 py-1 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => {
                const info = group.generalInformation;
                const firstDebtor = group.debtors?.[0];
                const displayDate = info?.date
                  ? new Date(info.date).toISOString().slice(0, 10)
                  : "N/A";
                const fullAddress = info
                  ? `${info.address1}, ${info.address2}`
                  : "N/A";
                const total = group.totalLiabilities ?? 0;

                return (
                  <tr key={group.rimNumber} className="border-b">
                    <td className="px-2 py-1 border">{group.rimNumber}</td>
                    <td className="px-2 py-1 border">
                      {info?.branch || "N/A"}
                    </td>
                    <td className="px-2 py-1 border">
                      {info?.status || "N/A"}
                    </td>
                    <td className="px-2 py-1 border">{displayDate}</td>
                    <td className="px-2 py-1 border">{fullAddress}</td>
                    <td className="px-2 py-1 border">
                      {info?.cautionCategory || "N/A"}
                    </td>
                    <td className="px-2 py-1 border">
                      {firstDebtor
                        ? `${firstDebtor.firstName} ${firstDebtor.lastName}`
                        : "No Debtor"}
                    </td>
                    <td className="px-2 py-1 border text-right">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </main>
      </div>
    </>
  );
}
