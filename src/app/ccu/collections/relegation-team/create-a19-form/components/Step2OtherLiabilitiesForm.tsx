"use client";

import React, { useState } from "react";

type Account = {
  id?: string; // For editing
  debtors: string[]; // References to debtor IDs
  branch: string;
  type: string; // "CHQ", "SAV", or "CC"
  accountNumber: string; // Must start with C or a digit
  balance: string; // Comma formatted currency
};

type Debtor = {
  id: string;
  lastName: string;
  firstName: string;
};

export default function Step2OtherLiabilitiesForm({
  accounts,
  setAccounts,
  onNext,
  onBack,
  debtors,
}: {
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  onNext: () => void;
  onBack: () => void;
  debtors: Debtor[];
}) {
  // For editing an existing account or adding a new one
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Local form state
  const [formData, setFormData] = useState<Account>({
    debtors: [],
    branch: "",
    type: "",
    accountNumber: "",
    balance: "",
  });

  // Field-level errors
  const [errors, setErrors] = useState<{
    debtors?: string;
    branch?: string;
    type?: string;
    accountNumber?: string;
    balance?: string;
  }>({});

  // --------------------------
  //  Format & Validation
  // --------------------------

  // Insert commas for the integer part, up to 2 decimals
  function formatCurrency(input: string): string {
    let val = input.replace(/[^0-9.]/g, "");
    // If the user types ".", assume "0."
    if (val === ".") return "0.";

    // Keep only the first dot
    const dotIndex = val.indexOf(".");
    if (dotIndex !== -1) {
      val =
        val.slice(0, dotIndex + 1) + val.slice(dotIndex + 1).replace(/\./g, "");
    }
    // Up to unlimited digits, but only 2 decimals
    const match = val.match(/^(\d*)(\.\d{0,2})?/);
    if (!match) return "";
    let integerPart = match[1] || "";
    const decimalPart = match[2] || "";

    // Remove leading zeros from integer part, keep one if fully zero
    integerPart = integerPart.replace(/^0+/, "");
    if (integerPart === "") integerPart = "0";

    // Insert commas
    integerPart = addCommas(integerPart);
    return integerPart + decimalPart;
  }

  function addCommas(intPart: string): string {
    let result = "";
    let count = 0;
    for (let i = intPart.length - 1; i >= 0; i--) {
      result = intPart[i] + result;
      count++;
      if (count === 3 && i > 0) {
        result = "," + result;
        count = 0;
      }
    }
    return result;
  }

  // Must start with 'C' or a digit
  // If it starts with 'C', the rest are digits
  // If starts with digit, all must be digits
  function formatAccountNumber(input: string): string {
    let val = input.toUpperCase();

    // Remove invalid chars
    val = val.replace(/[^0-9C]/g, "");
    if (!val) return "";

    // if the first character is neither C nor digit, remove it
    if (!val[0].match(/[0-9C]/)) {
      val = val.slice(1);
    }
    if (!val) return "";

    if (val[0] === "C") {
      // rest must be digits
      const rest = val.slice(1).replace(/\D/g, "");
      return "C" + rest;
    } else {
      // first char is digit => all digits
      return val.replace(/\D/g, "");
    }
  }

  // --------------------------
  //  Handlers
  // --------------------------

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    if (name === "branch") {
      setFormData((prev) => ({ ...prev, branch: value.toUpperCase() }));
    } else if (name === "type") {
      setFormData((prev) => ({ ...prev, type: value }));
    } else if (name === "accountNumber") {
      setFormData((prev) => ({
        ...prev,
        accountNumber: formatAccountNumber(value),
      }));
    } else if (name === "balance") {
      setFormData((prev) => ({ ...prev, balance: formatCurrency(value) }));
    } else {
      // fallback
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleDebtorChange(debtorId: string) {
    setFormData((prev) => ({
      ...prev,
      debtors: prev.debtors.includes(debtorId)
        ? prev.debtors.filter((id) => id !== debtorId)
        : [...prev.debtors, debtorId],
    }));
  }

  function validateForm() {
    const e: {
      debtors?: string;
      branch?: string;
      type?: string;
      accountNumber?: string;
      balance?: string;
    } = {};

    if (formData.debtors.length < 1) {
      e.debtors = "At least one debtor must be assigned.";
    }
    if (!formData.branch.trim()) {
      e.branch = "Branch is required.";
    }
    if (!formData.type.trim()) {
      e.type = "Account type is required.";
    }
    if (!formData.accountNumber.trim()) {
      e.accountNumber = "Account Number is required.";
    }
    if (!formData.balance.trim()) {
      e.balance = "Balance is required.";
    }

    return e;
  }

  function handleAddOrSave() {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
    } else {
      setErrors({});
      if (editingIndex === null) {
        // Add new
        const newAcct = {
          ...formData,
          id: `ACC${accounts.length + 1}`,
        };
        setAccounts((prev) => [...prev, newAcct]);
      } else {
        // Save changes
        setAccounts((prev) => {
          const updated = [...prev];
          updated[editingIndex] = { ...updated[editingIndex], ...formData };
          return updated;
        });
      }
      // Reset
      setFormData({
        id: "",
        debtors: [],
        branch: "",
        type: "",
        accountNumber: "",
        balance: "",
      });
      setEditingIndex(null);
    }
  }

  function handleEdit(index: number) {
    setEditingIndex(index);
    setFormData({ ...accounts[index] });
  }

  function handleRemove(index: number) {
    setAccounts((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setFormData({
        id: "",
        debtors: [],
        branch: "",
        type: "",
        accountNumber: "",
        balance: "",
      });
    }
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded shadow">
      {/* Top bar: Back & Next on left */}
      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
        >
          Next
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">
        Other Liabilities/Connected Accounts
      </h2>

      <div className="flex flex-wrap md:flex-nowrap gap-4">
        {/* Left Column: Form */}
        <div className="w-full max:w-[600px]">
          <h3 className="text-lg font-bold mb-2">
            {editingIndex === null ? "Add Account" : "Edit Account"}
          </h3>

          <div className="flex flex-col gap-4">
            {/* Debtors */}
            <div>
              <h4 className="font-semibold mb-2">Assign Debtors</h4>
              {debtors.map((debtor) => (
                <label key={debtor.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.debtors.includes(debtor.id)}
                    onChange={() => handleDebtorChange(debtor.id)}
                  />
                  {`${debtor.id} - ${debtor.lastName}, ${debtor.firstName}`}
                </label>
              ))}
              {errors.debtors && (
                <p className="text-red-500 text-sm mt-1">{errors.debtors}</p>
              )}
            </div>

            {/* Branch */}
            <div>
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.branch && (
                <p className="text-red-500 text-sm mt-1">{errors.branch}</p>
              )}
            </div>

            {/* Type (Dropdown) */}
            <div>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              >
                <option value="">-- SELECT TYPE --</option>
                <option value="CHQ">CHQ</option>
                <option value="SAV">SAV</option>
                <option value="CC">CC</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountNumber}
                </p>
              )}
            </div>

            {/* Balance */}
            <div>
              <input
                type="text"
                name="balance"
                placeholder="Balance"
                value={formData.balance}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.balance && (
                <p className="text-red-500 text-sm mt-1">{errors.balance}</p>
              )}
            </div>

            {/* Add / Save */}
            <button
              type="button"
              onClick={handleAddOrSave}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editingIndex === null ? "Add Account" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Right Column: Table */}
        <div className="w-full">
          {accounts.length > 0 && (
            <div className="mt-6 md:mt-0">
              <h3 className="text-lg font-bold mb-4">Existing Accounts</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Branch</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Account #</th>
                      <th className="p-2 text-left">Balance</th>
                      <th className="p-2 text-left">Debtors</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc, index) => (
                      <tr key={acc.id || index} className="border-b">
                        <td className="p-2">{acc.branch}</td>
                        <td className="p-2">{acc.type}</td>
                        <td className="p-2">{acc.accountNumber}</td>
                        <td className="p-2">{acc.balance}</td>
                        <td className="p-2">
                          {acc.debtors.length
                            ? acc.debtors
                                .map((did) => {
                                  const d = debtors.find((db) => db.id === did);
                                  return d
                                    ? `${d.id} - ${d.lastName}, ${d.firstName}`
                                    : "Unknown";
                                })
                                .join(" | ")
                            : "None"}
                        </td>
                        <td className="p-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(index)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
