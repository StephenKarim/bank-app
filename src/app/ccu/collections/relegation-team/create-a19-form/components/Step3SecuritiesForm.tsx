"use client";

import React, { useState } from "react";

export type Security = {
  id?: string; // for editing
  description: string; // all caps
  rstc: string; // currency
  mv: string; // currency
  use: string; // all caps
  demand: string; // all caps
  secures: string; // all caps
  advertised: boolean;
  dateAdvertised: string; // only enabled if advertised = true
  valuation: string; // date
  debtors: number[]; // store 1-based indexes
};

interface Step3SecuritiesFormProps {
  data: Security[];
  setData: React.Dispatch<React.SetStateAction<Security[]>>;
  onSubmit: () => void;
  onNext: () => void;
  onBack: () => void;
  debtors: { lastName: string; firstName: string }[]; // Pass dynamic debtors list
}

export default function Step3SecuritiesForm({
  data,
  setData,
  onNext,
  onBack,
  debtors,
}: Step3SecuritiesFormProps) {
  // For editing an existing security or adding a new one
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Local form state
  const [securityForm, setSecurityForm] = useState<Security>({
    description: "",
    rstc: "",
    mv: "",
    use: "",
    demand: "",
    secures: "",
    advertised: false,
    dateAdvertised: "",
    valuation: "",
    debtors: [],
  });

  // Field-level errors
  const [errors, setErrors] = useState<{
    description?: string;
    rstc?: string;
    mv?: string;
    debtors?: string;
  }>({});

  // --------------------------
  //  Formatting Helpers
  // --------------------------

  /**
   * formatCurrency:
   *  - Allows 1 dot, up to 2 decimals
   *  - Up to 8 digits before decimal
   *  - Inserts commas every 3 digits in the integer part
   *  - If user types ".", becomes "0."
   */
  function formatCurrency(raw: string): string {
    let val = raw.replace(/[^0-9.]/g, "");
    // if it's just "."
    if (val === ".") return "0.";

    // keep only the first dot
    const dotIndex = val.indexOf(".");
    if (dotIndex !== -1) {
      val =
        val.slice(0, dotIndex + 1) + val.slice(dotIndex + 1).replace(/\./g, "");
    }

    // match up to 8 digits + optional . + up to 2 digits
    const match = val.match(/^(\d{0,8})(\.\d{0,2})?/);
    if (!match) return "";
    let integerPart = match[1] || "";
    const decimalPart = match[2] || "";

    // remove leading zeros, keep one if fully zero
    integerPart = integerPart.replace(/^0+/, "");
    if (integerPart === "") integerPart = "0";

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

  // For all-caps text fields
  function toAllCaps(value: string) {
    return value.toUpperCase();
  }

  // --------------------------
  //  onChange Handlers
  // --------------------------

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name } = e.target;
    let value = e.target.value;

    if (name === "advertised") {
      // checkbox
      setSecurityForm((prev) => ({
        ...prev,
        advertised: !prev.advertised,
      }));
      return;
    }

    // RSTC or MV => currency
    if (name === "rstc" || name === "mv") {
      const formatted = formatCurrency(value);
      setSecurityForm((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    // For text fields that must be uppercase
    if (
      name === "description" ||
      name === "use" ||
      name === "demand" ||
      name === "secures"
    ) {
      value = toAllCaps(value);
      setSecurityForm((prev) => ({ ...prev, [name]: value }));
      return;
    }

    // everything else
    setSecurityForm((prev) => ({ ...prev, [name]: value }));
  }

  // handleDebtorChange => store 1-based IDs
  function handleDebtorChange(debtorIndex: number) {
    const realId = debtorIndex + 1;
    setSecurityForm((prev) => {
      const already = prev.debtors.includes(realId);
      const updated = already
        ? prev.debtors.filter((x) => x !== realId)
        : [...prev.debtors, realId];
      return { ...prev, debtors: updated };
    });
  }

  // --------------------------
  // Validate & Save
  // --------------------------
  function validateForm() {
    const e: {
      description?: string;
      rstc?: string;
      mv?: string;
      debtors?: string;
    } = {};

    if (!securityForm.description.trim()) {
      e.description = "Description is required.";
    }
    if (!securityForm.rstc.trim()) {
      e.rstc = "RSTC is required.";
    }
    if (!securityForm.mv.trim()) {
      e.mv = "MV is required.";
    }
    if (securityForm.debtors.length < 1) {
      e.debtors = "At least one debtor must be selected.";
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
        // add new
        const newSec = {
          ...securityForm,
          id: `SEC${data.length + 1}`,
        };
        setData((prev) => [...prev, newSec]);
      } else {
        // update existing
        setData((prev) => {
          const updated = [...prev];
          updated[editingIndex] = { ...updated[editingIndex], ...securityForm };
          return updated;
        });
      }
      // reset
      setSecurityForm({
        id: "",
        description: "",
        rstc: "",
        mv: "",
        use: "",
        demand: "",
        secures: "",
        advertised: false,
        dateAdvertised: "",
        valuation: "",
        debtors: [],
      });
      setEditingIndex(null);
    }
  }

  function handleEdit(index: number) {
    setEditingIndex(index);
    setSecurityForm({ ...data[index] });
  }

  function handleRemove(index: number) {
    setData((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setSecurityForm({
        id: "",
        description: "",
        rstc: "",
        mv: "",
        use: "",
        demand: "",
        secures: "",
        advertised: false,
        dateAdvertised: "",
        valuation: "",
        debtors: [],
      });
    }
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded shadow">
      {/* Top bar with Back & Submit on left */}
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
          onClick={onNext} // or onSubmit if final?
          className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-4">
        {/* Left Column: Form */}
        <div className="w-full max:w-[600px]">
          <h2 className="text-xl font-bold mb-4">
            {editingIndex === null ? "ADD SECURITY" : "EDIT SECURITY"}
          </h2>

          <div className="flex flex-col gap-4">
            {/* Description */}
            <div>
              <input
                type="text"
                name="description"
                placeholder="DESCRIPTION"
                value={securityForm.description}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* RSTC */}
            <div>
              <input
                type="text"
                name="rstc"
                placeholder="REALIZABLE VALUE (RSTC)"
                value={securityForm.rstc}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.rstc && (
                <p className="text-red-500 text-sm mt-1">{errors.rstc}</p>
              )}
            </div>

            {/* MV */}
            <div>
              <input
                type="text"
                name="mv"
                placeholder="MARKET VALUE (MV)"
                value={securityForm.mv}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
              {errors.mv && (
                <p className="text-red-500 text-sm mt-1">{errors.mv}</p>
              )}
            </div>

            {/* Use */}
            <div>
              <input
                type="text"
                name="use"
                placeholder="USE"
                value={securityForm.use}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
            </div>

            {/* Demand */}
            <div>
              <input
                type="text"
                name="demand"
                placeholder="DEMAND"
                value={securityForm.demand}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
            </div>

            {/* Secures */}
            <div>
              <input
                type="text"
                name="secures"
                placeholder="SECURES"
                value={securityForm.secures}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
            </div>

            {/* Advertised */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="advertised"
                checked={securityForm.advertised}
                onChange={handleInputChange}
              />
              <span>ADVERTISED</span>
            </label>

            {/* Date Advertised (disabled if not advertised) */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                ADVERTISED DATE
              </label>
              <input
                type="date"
                name="dateAdvertised"
                value={securityForm.dateAdvertised}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
                disabled={!securityForm.advertised}
              />
            </div>

            {/* Valuation Date */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                VALUATION DATE
              </label>
              <input
                type="date"
                name="valuation"
                value={securityForm.valuation}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
            </div>

            {/* Linked Debtors */}
            <div>
              <h4 className="font-semibold mb-2">LINKED DEBTORS</h4>
              {debtors.map((debtor, index) => {
                const realId = index + 1;
                return (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={securityForm.debtors.includes(realId)}
                      onChange={() => handleDebtorChange(index)}
                    />
                    {`${debtor.lastName}, ${debtor.firstName}`}
                  </label>
                );
              })}
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
              {editingIndex === null ? "ADD SECURITY" : "SAVE CHANGES"}
            </button>
          </div>
        </div>

        {/* Right Column: Existing Securities Table */}
        <div className="w-full">
          {data.length > 0 && (
            <div className="mt-6 md:mt-0">
              <h3 className="text-lg font-bold mb-4">EXISTING SECURITIES</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">DESCRIPTION</th>
                      <th className="p-2 text-left">RSTC</th>
                      <th className="p-2 text-left">MV</th>
                      <th className="p-2 text-left">DEBTORS</th>
                      <th className="p-2 text-left">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item.id || index} className="border-b">
                        <td className="p-2">{item.description}</td>
                        <td className="p-2">{item.rstc}</td>
                        <td className="p-2">{item.mv}</td>
                        <td className="p-2">
                          {item.debtors.length
                            ? item.debtors
                                .map((rid) => {
                                  const i = rid - 1;
                                  const d = debtors[i];
                                  return d
                                    ? `${d.lastName}, ${d.firstName}`
                                    : "(invalid)";
                                })
                                .join("; ")
                            : "None"}
                        </td>
                        <td className="p-2 flex gap-2">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleEdit(index)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            EDIT
                          </button>
                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => handleRemove(index)}
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
        </div>
      </div>
    </div>
  );
}
