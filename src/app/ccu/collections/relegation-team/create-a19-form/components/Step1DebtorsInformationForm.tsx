"use client";

import React, { useState } from "react";

type Debtor = {
  id: string; // Add a unique ID for each debtor (e.g., D1, D2, D3)
  lastName: string;
  firstName: string;
  role: string;
  identification: {
    passport?: string;
    driversPermit?: string;
    nationalID?: string;
  };
  employer: string;
  occupation: string;
};

export default function Step1DebtorsInformationForm({
  data,
  setData,
  onNext,
  onBack,
}: {
  data: Debtor[];
  setData: React.Dispatch<React.SetStateAction<Debtor[]>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const [debtor, setDebtor] = useState<Omit<Debtor, "id">>({
    lastName: "",
    firstName: "",
    role: "",
    identification: {},
    employer: "",
    occupation: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (
      name === "passport" ||
      name === "driversPermit" ||
      name === "nationalID"
    ) {
      setDebtor((prev) => ({
        ...prev,
        identification: { ...prev.identification, [name]: value },
      }));
    } else {
      setDebtor((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateDebtor = () => {
    if (!debtor.lastName.trim()) return "Last Name is required.";
    if (!debtor.firstName.trim()) return "First Name is required.";
    if (!debtor.role.trim()) return "Role is required.";
    if (
      !debtor.identification.passport?.trim() &&
      !debtor.identification.driversPermit?.trim() &&
      !debtor.identification.nationalID?.trim()
    ) {
      return "At least one form of identification (Passport, Driver's Permit, or National ID) is required.";
    }
    if (
      debtor.identification.nationalID &&
      debtor.identification.nationalID.length !== 11
    ) {
      return "National ID must be exactly 11 digits long.";
    }
    return null;
  };

  const handleAddDebtor = () => {
    const validationError = validateDebtor();
    if (validationError) {
      setError(validationError);
    } else {
      setError(null);
      const newDebtor = { ...debtor, id: `D${data.length + 1}` }; // Assign a unique ID (D1, D2, ...)
      setData((prev) => [...prev, newDebtor]);
      setDebtor({
        lastName: "",
        firstName: "",
        role: "",
        identification: {},
        employer: "",
        occupation: "",
      });
    }
  };

  const handleRemoveDebtor = (index: number) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (data.length === 0) {
      setError("Please add at least one debtor before proceeding.");
    } else {
      setError(null);
      onNext();
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Debtors Information</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={debtor.lastName}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={debtor.firstName}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={debtor.role}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="employer"
          placeholder="Employer"
          value={debtor.employer}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="occupation"
          placeholder="Occupation"
          value={debtor.occupation}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        {/* Identification Inputs */}
        <input
          type="text"
          name="passport"
          placeholder="Passport"
          value={debtor.identification.passport || ""}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="driversPermit"
          placeholder="Driver's Permit"
          value={debtor.identification.driversPermit || ""}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="nationalID"
          placeholder="National ID"
          value={debtor.identification.nationalID || ""}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <button
          type="button"
          onClick={handleAddDebtor}
          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Debtor
        </button>
      </div>

      {data.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">Existing Debtors</h3>
          <ul className="list-disc pl-6">
            {data.map((debtor, index) => (
              <li key={index} className="mb-4">
                <p>
                  <strong>ID:</strong> {debtor.id}
                </p>
                <p>
                  <strong>Name:</strong> {debtor.lastName}, {debtor.firstName}
                </p>
                <p>
                  <strong>Role:</strong> {debtor.role}
                </p>
                <p>
                  <strong>Employer:</strong> {debtor.employer || "N/A"}
                </p>
                <p>
                  <strong>Occupation:</strong> {debtor.occupation || "N/A"}
                </p>
                <p>
                  <strong>Passport:</strong>{" "}
                  {debtor.identification.passport || "N/A"}
                </p>
                <p>
                  <strong>Drivers Permit:</strong>{" "}
                  {debtor.identification.driversPermit || "N/A"}
                </p>
                <p>
                  <strong>National ID:</strong>{" "}
                  {debtor.identification.nationalID || "N/A"}
                </p>
                <button
                  type="button"
                  onClick={() => handleRemoveDebtor(index)}
                  className="mt-2 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

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
          onClick={handleNext}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
