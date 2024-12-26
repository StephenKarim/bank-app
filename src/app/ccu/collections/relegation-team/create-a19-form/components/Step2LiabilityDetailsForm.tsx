"use client";

import React, { useState, useEffect } from "react";
// Adjust imports as needed to match your project structure/types
import { Debtor, Liability, Calculations } from "../page";

export default function Step2LiabilityDetailsForm({
  accounts, // Liabilities array from parent
  setAccounts, // setter for Liabilities
  calculations,
  setCalculations,
  onNext,
  onBack,
  debtors,
}: {
  accounts: Liability[];
  setAccounts: React.Dispatch<React.SetStateAction<Liability[]>>;
  calculations: Calculations;
  setCalculations: React.Dispatch<React.SetStateAction<Calculations>>;
  onNext: () => void;
  onBack: () => void;
  debtors: Debtor[];
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Local text for "Less: Security Held"
  const [lessSecurityHeldInput, setLessSecurityHeldInput] = useState(
    formatCurrency(calculations.lessSecurityHeld.toString())
  );

  // Liability form for add/edit
  const [liabilityForm, setLiabilityForm] = useState<Liability>({
    id: "",
    type: "",
    number: "",
    debtors: [],
    limit: { currency: "USD", value: "" },
    expiryDate: "",
    rate: "",
    liabilities: "",
    idcd: "",
    statuteBarred: "",
  });

  // Field-level errors
  const [errors, setErrors] = useState<{
    type?: string;
    number?: string;
    limitValue?: string;
    expiryDate?: string;
    rate?: string;
    liabilities?: string;
    statuteBarred?: string;
    debtors?: string; // For "at least one debtor"
  }>({});

  // Recalculate totals whenever accounts or "lessSecurityHeldInput" changes
  useEffect(() => {
    const lessSecHeldNum = parseCurrency(lessSecurityHeldInput) || 0;

    const total = accounts.reduce(
      (sum, acc) => sum + parseCurrency(acc.liabilities || "0"),
      0
    );
    const lessIDCD = accounts.reduce(
      (sum, acc) => sum + parseCurrency(acc.idcd || "0"),
      0
    );

    const subTotal = total - lessIDCD;
    const provision = total - lessSecHeldNum;

    setCalculations({
      total,
      lessIDCD,
      subTotal,
      lessSecurityHeld: lessSecHeldNum,
      provision,
    });
  }, [accounts, lessSecurityHeldInput, setCalculations]);

  // ---------------------------
  //      Formatting Helpers
  // ---------------------------

  function parseCurrency(str: string): number {
    const withoutCommas = str.replace(/,/g, "");
    return parseFloat(withoutCommas) || 0;
  }

  /**
   * formatCurrency:
   * - Allows one dot anywhere.
   * - Up to 2 digits after the decimal.
   * - Inserts commas every 3 digits in the integer part.
   * - If user types ".", becomes "0." if empty in front.
   */
  function formatCurrency(input: string): string {
    // remove non-digits/dots
    let val = input.replace(/[^0-9.]/g, "");
    // if it's just "."
    if (val === ".") {
      return "0.";
    }
    // keep only first dot
    const dotIndex = val.indexOf(".");
    if (dotIndex !== -1) {
      val =
        val.slice(0, dotIndex + 1) + val.slice(dotIndex + 1).replace(/\./g, "");
    }
    // match: integer part (any length) + optional dot + up to 2 digits
    const match = val.match(/^(\d*)(\.\d{0,2})?/);
    if (!match) return "";
    let integerPart = match[1] || "";
    const decimalPart = match[2] || "";

    // remove leading zeros, but keep one if fully zero
    integerPart = integerPart.replace(/^0+/, "");
    if (integerPart === "") {
      integerPart = "0";
    }
    // insert commas
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

  /**
   * formatRate:
   * - Up to 2 digits total in the integer part, and up to 2 decimals => max "99.99"
   * - If user types ".", assume "0."
   */
  function formatRate(input: string): string {
    let val = input.replace(/[^0-9.]/g, "");
    if (val === ".") return "0.";

    // keep only the first dot
    const dotIndex = val.indexOf(".");
    if (dotIndex !== -1) {
      val =
        val.slice(0, dotIndex + 1) + val.slice(dotIndex + 1).replace(/\./g, "");
    }
    // match up to 2 digits for integer part, then . then up to 2 decimals
    const match = val.match(/^(\d{0,2})(\.\d{0,2})?/);
    if (!match) return "";

    let integerPart = match[1] || "";
    const decimalPart = match[2] || "";

    // remove leading zeros from integer part, keep at least one
    integerPart = integerPart.replace(/^0+/, "");
    if (integerPart === "") {
      integerPart = "0";
    }

    return integerPart + decimalPart;
  }

  /**
   * formatAccountNumber:
   * - Must start with 'C' or a digit.
   * - If it starts with 'C', the rest are digits only.
   * - If it starts with a digit, all must be digits only.
   * - No other letters or symbols.
   */
  function formatAccountNumber(input: string): string {
    let val = input.toUpperCase();

    // if empty, nothing to do
    if (!val) return "";

    // force only digits or 'C'
    val = val.replace(/[^0-9C]/g, "");

    // if the first character is not 'C' or digit => remove it
    if (val.length > 0 && !val[0].match(/[0-9C]/)) {
      val = val.slice(1);
    }
    if (!val) return "";

    // check if first char is 'C'
    if (val[0] === "C") {
      // the rest must be digits
      const rest = val.slice(1).replace(/\D/g, "");
      return "C" + rest;
    } else {
      // first char is digit => all must be digits
      return val.replace(/\D/g, "");
    }
  }

  // ---------------------------
  //    onChange Handlers
  // ---------------------------
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name } = e.target;
    let value = e.target.value;

    // date fields
    if (name === "expiryDate" || name === "statuteBarred") {
      setLiabilityForm((prev) => ({ ...prev, [name]: value }));
      return;
    }

    // less: security held
    if (name === "lessSecurityHeld") {
      setLessSecurityHeldInput(formatCurrency(value));
      return;
    }

    // currency fields
    if (name === "limitValue" || name === "liabilities" || name === "idcd") {
      const formatted = formatCurrency(value);
      if (name === "limitValue") {
        setLiabilityForm((prev) => ({
          ...prev,
          limit: { ...prev.limit, value: formatted },
        }));
      } else {
        setLiabilityForm((prev) => ({ ...prev, [name]: formatted }));
      }
      return;
    }

    // rate
    if (name === "rate") {
      setLiabilityForm((prev) => ({ ...prev, rate: formatRate(value) }));
      return;
    }

    // currency selection
    if (name === "currency") {
      setLiabilityForm((prev) => ({
        ...prev,
        limit: { ...prev.limit, currency: value },
      }));
      return;
    }

    // account number
    if (name === "number") {
      const acct = formatAccountNumber(value);
      setLiabilityForm((prev) => ({ ...prev, number: acct }));
      return;
    }

    // otherwise => uppercase text fields
    value = value.toUpperCase();
    setLiabilityForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleDebtorChange(debtorId: string) {
    setLiabilityForm((prev) => ({
      ...prev,
      debtors: prev.debtors.includes(debtorId)
        ? prev.debtors.filter((id) => id !== debtorId)
        : [...prev.debtors, debtorId],
    }));
  }

  // ---------------------------
  //     Validate & Save
  // ---------------------------
  function validateForm() {
    const e: {
      type?: string;
      number?: string;
      limitValue?: string;
      expiryDate?: string;
      rate?: string;
      liabilities?: string;
      statuteBarred?: string;
      debtors?: string;
    } = {};

    if (!liabilityForm.type.trim()) e.type = "Type is required.";
    if (!liabilityForm.number.trim()) {
      e.number = "Account Number is required.";
    }
    if (!liabilityForm.limit.value.trim())
      e.limitValue = "Limit Value is required.";
    if (!liabilityForm.expiryDate.trim())
      e.expiryDate = "Expiry Date is required.";
    if (!liabilityForm.rate.trim()) e.rate = "Rate is required.";
    if (!liabilityForm.liabilities.trim())
      e.liabilities = "Liabilities is required.";
    if (!liabilityForm.statuteBarred.trim())
      e.statuteBarred = "Statute Barred date is required.";

    // Must have at least 1 debtor
    if (liabilityForm.debtors.length < 1) {
      e.debtors = "At least one debtor must be assigned.";
    }

    return e;
  }

  function handleAddOrSave() {
    const e = validateForm();
    if (Object.keys(e).length > 0) {
      setErrors(e);
    } else {
      setErrors({});
      if (editingIndex === null) {
        const newLiability = {
          ...liabilityForm,
          id: `L${accounts.length + 1}`,
        };
        setAccounts((prev) => [...prev, newLiability]);
      } else {
        setAccounts((prev) => {
          const updated = [...prev];
          updated[editingIndex] = {
            ...updated[editingIndex],
            ...liabilityForm,
          };
          return updated;
        });
      }
      // Reset
      setLiabilityForm({
        id: "",
        type: "",
        number: "",
        debtors: [],
        limit: { currency: "USD", value: "" },
        expiryDate: "",
        rate: "",
        liabilities: "",
        idcd: "",
        statuteBarred: "",
      });
      setEditingIndex(null);
    }
  }

  function handleRemove(index: number) {
    setAccounts((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setLiabilityForm({
        id: "",
        type: "",
        number: "",
        debtors: [],
        limit: { currency: "USD", value: "" },
        expiryDate: "",
        rate: "",
        liabilities: "",
        idcd: "",
        statuteBarred: "",
      });
    }
  }

  function handleEdit(index: number) {
    setEditingIndex(index);
    const liab = accounts[index];
    setLiabilityForm({ ...liab, limit: { ...liab.limit } });
  }

  // ---------------------------
  //       Render
  // ---------------------------
  return (
    <div className="p-4 md:p-6 bg-white rounded shadow">
      {/* Top bar with Back/Next only */}
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

      <div className="flex flex-wrap md:flex-nowrap gap-4">
        {/* Left Column: Less: Security Held + Form */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-bold mb-2">FACILITY &amp; ACCOUNT NO.</h2>

          {/* Less: Security Held */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              LESS: SECURITY HELD
            </label>
            <input
              type="text"
              name="lessSecurityHeld"
              value={lessSecurityHeldInput}
              onChange={handleInputChange}
              className="p-2 border rounded w-full"
              placeholder="0.00"
            />
          </div>

          {/* Add/Edit Account */}
          <h3 className="text-lg font-bold mb-2">
            {editingIndex === null ? "ADD ACCOUNT" : "EDIT ACCOUNT"}
          </h3>

          <div className="flex flex-col gap-4">
            {/* Type (ML, PL, CC) */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                TYPE (ML, PL, CC)
              </label>
              <select
                name="type"
                value={liabilityForm.type}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              >
                <option value="">-- SELECT TYPE --</option>
                <option value="ML">ML</option>
                <option value="PL">PL</option>
                <option value="CC">CC</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                ACCOUNT NUMBER
              </label>
              <input
                type="text"
                name="number"
                value={liabilityForm.number}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">{errors.number}</p>
              )}
            </div>

            {/* Limit (currency + value) */}
            <div className="flex gap-2 items-center">
              <select
                name="currency"
                value={liabilityForm.limit.currency}
                onChange={handleInputChange}
                className="p-2 border rounded"
              >
                <option value="USD">USD</option>
                <option value="TTD">TTD</option>
                <option value="XCD">XCD</option>
                <option value="ANG">ANG</option>
              </select>
              <input
                type="text"
                name="limitValue"
                placeholder="LIMIT VALUE"
                value={liabilityForm.limit.value}
                onChange={handleInputChange}
                className="p-2 border rounded flex-grow"
              />
            </div>
            {errors.limitValue && (
              <p className="text-red-500 text-sm mt-1">{errors.limitValue}</p>
            )}

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                EXPIRY DATE
              </label>
              <input
                type="date"
                name="expiryDate"
                value={liabilityForm.expiryDate}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                RATE (%)
              </label>
              <input
                type="text"
                name="rate"
                value={liabilityForm.rate}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.rate && (
                <p className="text-red-500 text-sm mt-1">{errors.rate}</p>
              )}
            </div>

            {/* Liabilities */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                LIABILITIES
              </label>
              <input
                type="text"
                name="liabilities"
                placeholder="LIABILITIES"
                value={liabilityForm.liabilities}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.liabilities && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.liabilities}
                </p>
              )}
            </div>

            {/* IDCD */}
            <div>
              <label className="block text-sm font-semibold mb-1">IDCD</label>
              <input
                type="text"
                name="idcd"
                placeholder="IDCD"
                value={liabilityForm.idcd}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {/* optional => no error */}
            </div>

            {/* Statute Barred */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                STATUTE BARRED
              </label>
              <input
                type="date"
                name="statuteBarred"
                value={liabilityForm.statuteBarred}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.statuteBarred && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.statuteBarred}
                </p>
              )}
            </div>

            {/* Debtors */}
            <div>
              <h4 className="font-semibold mb-2">ASSIGN DEBTORS</h4>
              {debtors.map((d) => (
                <label key={d.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={liabilityForm.debtors.includes(d.id)}
                    onChange={() => handleDebtorChange(d.id)}
                  />
                  {`${d.id} - ${d.lastName}, ${d.firstName}`}
                </label>
              ))}
              {errors.debtors && (
                <p className="text-red-500 text-sm mt-1">{errors.debtors}</p>
              )}
            </div>

            {/* Add / Save */}
            <button
              type="button"
              onClick={handleAddOrSave}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editingIndex === null ? "ADD ACCOUNT" : "SAVE CHANGES"}
            </button>
          </div>
        </div>

        {/* Right Column: Table + Summary Underneath */}
        <div className="w-full md:w-1/2">
          {accounts.length > 0 && (
            <div className="mt-6 md:mt-0">
              <h3 className="text-lg font-bold mb-4">EXISTING ACCOUNTS</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">TYPE</th>
                      <th className="p-2 text-left">NUMBER</th>
                      <th className="p-2 text-left">LIMIT</th>
                      <th className="p-2 text-left">LIAB</th>
                      <th className="p-2 text-left">IDCD</th>
                      <th className="p-2 text-left">RATE</th>
                      <th className="p-2 text-left">DEBTORS</th>
                      <th className="p-2 text-left">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc, idx) => (
                      <tr
                        key={acc.id || idx}
                        className="border-b last:border-b-0"
                      >
                        <td className="p-2">{acc.type}</td>
                        <td className="p-2">{acc.number}</td>
                        <td className="p-2">
                          {acc.limit.currency} {acc.limit.value}
                        </td>
                        <td className="p-2">{acc.liabilities || "0.00"}</td>
                        <td className="p-2">{acc.idcd || "N/A"}</td>
                        <td className="p-2">{acc.rate}</td>
                        <td className="p-2">
                          {acc.debtors.length
                            ? acc.debtors
                                .map((did) => {
                                  const dd = debtors.find((x) => x.id === did);
                                  return dd
                                    ? `${dd.id} - ${dd.lastName}, ${dd.firstName}`
                                    : "Unknown";
                                })
                                .join("; ")
                            : "None"}
                        </td>
                        <td className="p-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(idx)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            EDIT
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemove(idx)}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            REMOVE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Box below the table, left aligned */}
          <div className="mt-4 bg-gray-100 p-4 rounded text-sm w-full sm:w-auto space-y-1">
            <p className="ml-2">
              <strong>Total:</strong> ${calculations.total.toFixed(2)}
            </p>
            <p className="ml-2">
              <strong>Less: IDCD:</strong> ${calculations.lessIDCD.toFixed(2)}
            </p>
            <p className="ml-2">
              <strong>Subtotal:</strong> ${calculations.subTotal.toFixed(2)}
            </p>
            <p className="ml-2">
              <strong>Less: Security Held:</strong> $
              {calculations.lessSecurityHeld.toFixed(2)}
            </p>
            <p className="ml-2">
              <strong>Provision:</strong> ${calculations.provision.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
