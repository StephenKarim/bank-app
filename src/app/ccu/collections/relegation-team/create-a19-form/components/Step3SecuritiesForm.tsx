"use client";

import React, { useState } from "react";

export type Security = {
  description: string;
  rstc: string;
  mv: string;
  use: string;
  demand: string;
  secures: string;
  advertised: boolean;
  dateAdvertised: string;
  valuation: string;
  debtors: number[]; // We'll store 1-based indexes here
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
  const [security, setSecurity] = useState<Security>({
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

  // Any input fields except checkboxes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      // It's the "advertised" checkbox
      setSecurity((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      // Normal text or select
      setSecurity((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // We store debtor indices as 1-based so that the route sees [1,2], etc., not [0,1].
  const handleDebtorChange = (debtorIndex: number): void => {
    const realId = debtorIndex + 1; // So the first Debtor => 1, second => 2, etc.

    setSecurity((prev) => {
      // If we already have that ID in the array, remove it; else add
      const alreadyChecked = prev.debtors.includes(realId);
      const updatedDebtors = alreadyChecked
        ? prev.debtors.filter((num) => num !== realId)
        : [...prev.debtors, realId];

      return {
        ...prev,
        debtors: updatedDebtors,
      };
    });
  };

  const addSecurity = (): void => {
    // Add the new security to the existing array
    setData((prev) => [...prev, security]);
    // Reset the form
    setSecurity({
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
  };

  const removeSecurity = (index: number): void => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Security</h2>
      <div className="flex flex-col gap-4">
        {/* Security Inputs */}
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={security.description}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="rstc"
          placeholder="Realizable Value (RSTC)"
          value={security.rstc}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="mv"
          placeholder="Market Value (MV)"
          value={security.mv}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="use"
          placeholder="Use"
          value={security.use}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="demand"
          placeholder="Demand"
          value={security.demand}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="secures"
          placeholder="Secures"
          value={security.secures}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            name="advertised"
            checked={security.advertised}
            onChange={handleInputChange}
            className="mr-2"
          />
          Advertised
        </label>
        <input
          type="date"
          name="dateAdvertised"
          value={security.dateAdvertised}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="valuation"
          placeholder="Valuation"
          value={security.valuation}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />

        {/* Linked Debtors checkboxes */}
        <div>
          <h4 className="font-semibold mb-2">Linked Debtors</h4>
          {debtors.map((debtor, index) => {
            const realId = index + 1; // If first Debtor => realId=1
            return (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={security.debtors.includes(realId)}
                  onChange={() => handleDebtorChange(index)}
                />
                {debtor.lastName}, {debtor.firstName}
              </label>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addSecurity}
          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Security
        </button>
      </div>

      {/* List of Existing Securities */}
      {data.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">Existing Securities</h3>
          <ul className="list-disc pl-6">
            {data.map((item, index) => (
              <li key={index} className="mb-4 border-b pb-4">
                <p>
                  <strong>Description:</strong> {item.description}
                </p>
                <p>
                  <strong>Valuation:</strong> {item.valuation}
                </p>
                <p>
                  <strong>Debtors:</strong>{" "}
                  {item.debtors
                    .map((realId) => {
                      // realId was stored as 1-based
                      const i = realId - 1; // so we map back to array index
                      const d = debtors[i];
                      return d ? `${d.lastName}, ${d.firstName}` : "(invalid)";
                    })
                    .join(", ")}
                </p>
                <button
                  type="button"
                  className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => removeSecurity(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext} // Navigate to the summary page
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
