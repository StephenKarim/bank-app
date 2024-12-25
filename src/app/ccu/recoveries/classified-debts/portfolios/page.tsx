/* File: /src/app/recoveries/classified-debts/portfolios/page.tsx */
"use client";

import React, { useState, useEffect } from "react";

interface GeneralInformation {
  id: number;
  date: string; // e.g. "2024-12-25T06:23:52.237Z"
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
  // etc. if needed
}
interface RelegatedGroup {
  rimNumber: string;
  generalInformation?: GeneralInformation;
  debtors?: Debtor[];
  liabilities?: Liability[];
  totalLiabilities?: number; // from server
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
    return <div>Loading data...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Classified Debts (Portfolios)</h1>
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
            // Display date as "YYYY-MM-DD"
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
                <td className="px-2 py-1 border">{info?.branch || "N/A"}</td>
                <td className="px-2 py-1 border">{info?.status || "N/A"}</td>
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
    </div>
  );
}
