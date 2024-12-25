"use client";

import React, { useState } from "react";

type GeneralInformation = {
  rimNumber: string;
  date: string; // General Information Date
  branch: string;
  address1: string;
  address2: string;
  country: string;
  cautionCategory: string;
  cautionDate: string; // Caution Date
};

export default function Step1GeneralInformationForm({
  data,
  setData,
  onNext,
}: {
  data: GeneralInformation;
  setData: React.Dispatch<React.SetStateAction<GeneralInformation>>;
  onNext: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!data.rimNumber.trim()) return "RIM Number is required.";
    if (!data.date.trim()) return "Relegated Date is required.";
    if (!data.branch.trim()) return "Branch is required.";
    if (!data.country.trim()) return "Country is required.";
    if (!data.cautionCategory.trim()) return "Caution Category is required.";
    if (!data.cautionDate.trim()) return "Caution Date is required.";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
    } else {
      setError(null);
      onNext();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">General Information</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="rimNumber"
          placeholder="RIM Number"
          value={data.rimNumber}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        <label htmlFor="date" className="text-sm font-semibold">
          Relegated Date
        </label>
        <input
          type="date"
          name="date"
          id="date"
          value={data.date}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={data.branch}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        <input
          type="text"
          name="address1"
          placeholder="Address 1"
          value={data.address1}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        <input
          type="text"
          name="address2"
          placeholder="Address 2"
          value={data.address2}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        <label htmlFor="country" className="text-sm font-semibold">
          Country
        </label>
        <select
          name="country"
          id="country"
          value={data.country}
          onChange={handleInputChange}
          className="p-2 border rounded"
        >
          <option value="">Select Country</option>
          <option value="ANGUILLA">ANGUILLA</option>
          <option value="BRITISH VIRGIN ISLANDS">BRITISH VIRGIN ISLANDS</option>
          <option value="DOMINICA">DOMINICA</option>
          <option value="ST. KITTS & NEVIS">ST. KITTS & NEVIS</option>
          <option value="ST. LUCIA">ST. LUCIA</option>
          <option value="ST. MAARTEN">ST. MAARTEN</option>
          <option value="ST. VINCENT & THE GRENADINES">
            ST. VINCENT & THE GRENADINES
          </option>
          <option value="TRINIDAD">TRINIDAD</option>
          <option value="TOBAGO">TOBAGO</option>
        </select>

        <select
          name="cautionCategory"
          value={data.cautionCategory}
          onChange={handleInputChange}
          className="p-2 border rounded"
        >
          <option value="">Select Caution Category</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>

        <label htmlFor="cautionDate" className="text-sm font-semibold">
          Caution Date
        </label>
        <input
          type="date"
          name="cautionDate"
          id="cautionDate"
          value={data.cautionDate}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </form>
  );
}
