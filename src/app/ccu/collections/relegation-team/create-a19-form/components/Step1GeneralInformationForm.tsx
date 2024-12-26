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
  // Field-level errors stored here
  const [generalInfoErrors, setGeneralInfoErrors] = useState<{
    rimNumber?: string;
    date?: string;
    branch?: string;
    country?: string;
    cautionCategory?: string;
    cautionDate?: string;
  }>({});

  // Handle all input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // Use const for name, let for value
    const name = e.target.name;
    let value = e.target.value;

    // Convert RIM Number to digits only (max 12)
    if (name === "rimNumber") {
      value = value.replace(/\D/g, "").slice(0, 12);
    } else if (
      name === "branch" ||
      name === "address1" ||
      name === "address2"
    ) {
      // As per your previous pattern, uppercase certain text fields
      value = value.toUpperCase();
    }

    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate all required fields; return an object with field-level errors
  const validateForm = () => {
    const errors: {
      rimNumber?: string;
      date?: string;
      branch?: string;
      country?: string;
      cautionCategory?: string;
      cautionDate?: string;
    } = {};

    if (!data.rimNumber.trim()) {
      errors.rimNumber = "RIM Number is required (digits only, max 12).";
    }
    if (!data.date.trim()) {
      errors.date = "Relegated Date is required.";
    }
    if (!data.branch.trim()) {
      errors.branch = "Branch is required.";
    }
    if (!data.country.trim()) {
      errors.country = "Country is required.";
    }
    if (!data.cautionCategory.trim()) {
      errors.cautionCategory = "Caution Category is required.";
    }
    if (!data.cautionDate.trim()) {
      errors.cautionDate = "Caution Date is required.";
    }

    return errors;
  };

  // On form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errorsObj = validateForm();

    if (Object.keys(errorsObj).length > 0) {
      setGeneralInfoErrors(errorsObj);
    } else {
      setGeneralInfoErrors({});
      onNext();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">General Information</h2>

      {/* RIM Number */}
      <div className="flex flex-col mb-2">
        <input
          type="text"
          name="rimNumber"
          placeholder="RIM Number (digits only, max 12)"
          value={data.rimNumber}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        {generalInfoErrors.rimNumber && (
          <p className="text-red-500 text-sm mt-1">
            {generalInfoErrors.rimNumber}
          </p>
        )}
      </div>

      {/* Date */}
      <label htmlFor="date" className="text-sm font-semibold">
        Relegated Date
      </label>
      <div className="flex flex-col mb-2">
        <input
          type="date"
          name="date"
          id="date"
          value={data.date}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        {generalInfoErrors.date && (
          <p className="text-red-500 text-sm mt-1">{generalInfoErrors.date}</p>
        )}
      </div>

      {/* Branch */}
      <div className="flex flex-col mb-2">
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={data.branch}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        {generalInfoErrors.branch && (
          <p className="text-red-500 text-sm mt-1">
            {generalInfoErrors.branch}
          </p>
        )}
      </div>

      {/* Address1 */}
      <div className="flex flex-col mb-2">
        <input
          type="text"
          name="address1"
          placeholder="Address 1"
          value={data.address1}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        {/* address1 is optional, so no error displayed */}
      </div>

      {/* Address2 */}
      <div className="flex flex-col mb-2">
        <input
          type="text"
          name="address2"
          placeholder="Address 2"
          value={data.address2}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        {/* address2 is optional, so no error displayed */}
      </div>

      {/* Country */}
      <label htmlFor="country" className="text-sm font-semibold">
        Country
      </label>
      <div className="flex flex-col mb-2">
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
        {generalInfoErrors.country && (
          <p className="text-red-500 text-sm mt-1">
            {generalInfoErrors.country}
          </p>
        )}
      </div>

      {/* Caution Category */}
      <div className="flex flex-col mb-2">
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
        {generalInfoErrors.cautionCategory && (
          <p className="text-red-500 text-sm mt-1">
            {generalInfoErrors.cautionCategory}
          </p>
        )}
      </div>

      {/* Caution Date */}
      <label htmlFor="cautionDate" className="text-sm font-semibold">
        Caution Date
      </label>
      <div className="flex flex-col mb-4">
        <input
          type="date"
          name="cautionDate"
          id="cautionDate"
          value={data.cautionDate}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        {generalInfoErrors.cautionDate && (
          <p className="text-red-500 text-sm mt-1">
            {generalInfoErrors.cautionDate}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Next
      </button>
    </form>
  );
}
