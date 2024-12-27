"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// -- Types from your Prisma schema (partial, for demonstration) --
interface GeneralInformation {
  id: number;
  branch: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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

interface Security {
  id: number;
  mv: number;
}

interface Account {
  id: number;
  accountNumber: string;
}

interface RelegatedGroup {
  rimNumber: string;
  generalInformation?: GeneralInformation;
  debtors?: Debtor[];
  liabilities?: Liability[];
  securities?: Security[];
  unchargedAccounts?: Account[];
  connectedAccounts?: Account[];
  totalLiabilities?: number;
  totalSecuritiesValue?: number;
  totalAccounts?: number;
  createdAt: string;
  updatedAt: string;
}

export default function ClassifiedDebtsPage() {
  const [groups, setGroups] = useState<RelegatedGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // For pagination
  const [page, setPage] = useState(1);
  // We use setPageSize in a dropdown => no ESLint error
  const [pageSize, setPageSize] = useState(10);

  // For sorting
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // For filtering
  const [filter, setFilter] = useState("");

  // Metadata from server response
  const [, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data whenever page, pageSize, sortBy, sortOrder, or filter changes
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);

      const query = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        sortBy,
        sortOrder,
        filter,
      });

      try {
        const res = await fetch(`/api/ccuClassifiedDebts?${query.toString()}`);
        const json = await res.json();

        if (json.success) {
          setGroups(json.data);
          setTotalCount(json.meta.totalCount);
          setTotalPages(json.meta.totalPages);
        } else {
          console.error("API Error:", json.error);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [page, pageSize, sortBy, sortOrder, filter]);

  // Handle a table-header click to toggle or set sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle asc/desc
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // New sort field, default to ascending
      setSortBy(field);
      setSortOrder("asc");
    }
    // Reset to page 1 when changing sort
    setPage(1);
  };

  function formatDate(dateString?: string) {
    if (!dateString) return "N/A";
    return new Date(dateString).toISOString().slice(0, 10);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            Classified Debts (Advanced)
          </h1>
          <nav className="space-x-4">
            <Link
              href="/ccu/recoveries/classified-debts"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Classified Debts
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Filters & Pagination Controls */}
      <div className="max-w-6xl mx-auto py-4 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        {/* Search Filter */}
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <label htmlFor="filter" className="text-sm text-gray-600">
            Search:
          </label>
          <input
            id="filter"
            type="text"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Pagination */}
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            className="px-2 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={page >= totalPages}
            className="px-2 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Page size dropdown */}
        <div className="flex items-center space-x-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            Page Size:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              // usually reset to page 1 when changing page size
              setPage(1);
            }}
            className="border border-gray-300 rounded px-1 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Main Content: Table */}
      <main className="flex-1 max-w-6xl mx-auto px-4 pb-10">
        {loading ? (
          <div className="p-4">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 bg-white text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <Th
                    label="RIM Number"
                    field="rimNumber"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <Th
                    label="Branch"
                    field="branch"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <Th
                    label="Status"
                    field="status"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <Th
                    label="Created At"
                    field="createdAt"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <th className="px-2 py-1 border text-center">Debtors</th>
                  <th className="px-2 py-1 border text-right">Liabilities</th>
                  <th className="px-2 py-1 border text-right">Securities</th>
                  <th className="px-2 py-1 border text-center">Accounts</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => {
                  const info = group.generalInformation;
                  const debtorCount = group.debtors?.length || 0;
                  const liabilities = group.totalLiabilities || 0;
                  const securitiesVal = group.totalSecuritiesValue || 0;
                  const accounts = group.totalAccounts || 0;

                  return (
                    <tr
                      key={group.rimNumber}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-2 py-1 border">{group.rimNumber}</td>
                      <td className="px-2 py-1 border">
                        {info?.branch ?? "N/A"}
                      </td>
                      <td className="px-2 py-1 border">
                        {info?.status ?? "N/A"}
                      </td>
                      <td className="px-2 py-1 border">
                        {formatDate(group.createdAt)}
                      </td>
                      <td className="px-2 py-1 border text-center">
                        {debtorCount}
                      </td>
                      <td className="px-2 py-1 border text-right">
                        {liabilities.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-2 py-1 border text-right">
                        {securitiesVal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-2 py-1 border text-center">
                        {accounts}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper component for sortable headers
type ThProps = {
  label: string;
  field: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
};

function Th({ label, field, sortBy, sortOrder, onSort }: ThProps) {
  const isActive = sortBy === field;

  const handleClick = () => {
    onSort(field);
  };

  return (
    <th
      onClick={handleClick}
      className="px-2 py-1 border cursor-pointer select-none hover:bg-gray-200 whitespace-nowrap"
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {isActive && <span>{sortOrder === "asc" ? "▲" : "▼"}</span>}
      </div>
    </th>
  );
}
