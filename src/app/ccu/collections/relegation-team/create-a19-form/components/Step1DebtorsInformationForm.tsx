"use client";

import React, { useState } from "react";

type Debtor = {
  id: string;
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
  // Track whether we are adding a new debtor or editing an existing one
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [debtor, setDebtor] = useState<Omit<Debtor, "id">>({
    lastName: "",
    firstName: "",
    role: "",
    identification: {},
    employer: "",
    occupation: "",
  });

  // Field-level errors
  const [debtorErrors, setDebtorErrors] = useState<{
    lastName?: string;
    firstName?: string;
    role?: string;
    identification?: string;
    nationalID?: string;
  }>({});

  // Handle changes on any input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // We never reassign `name`, so it can be const
    const name = e.target.name;
    // We'll reassign `value` as we manipulate it
    let value = e.target.value;

    // Force uppercase for all text fields
    value = value.toUpperCase();

    // Special rules for certain fields:
    if (name === "lastName" || name === "firstName") {
      // Letters only after uppercase
      value = value.replace(/[^A-Z]/g, "");
    } else if (name === "nationalID") {
      // Digits only, max length 11
      value = value.replace(/\D/g, "").slice(0, 11);
    } else if (name === "passport") {
      // Max 12 characters
      value = value.slice(0, 12);
    } else if (name === "driversPermit") {
      // Max 12 characters
      value = value.slice(0, 12);
    }

    // Identification fields
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
      // Non-identification fields
      setDebtor((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Return an object of errors for each field
  const validateDebtor = () => {
    const errors: {
      lastName?: string;
      firstName?: string;
      role?: string;
      identification?: string;
      nationalID?: string;
    } = {};

    if (!debtor.lastName.trim()) {
      errors.lastName = "Last Name is required (letters only).";
    }
    if (!debtor.firstName.trim()) {
      errors.firstName = "First Name is required (letters only).";
    }
    if (!debtor.role.trim()) {
      errors.role = "Role is required.";
    }

    const hasPassport = debtor.identification.passport?.trim();
    const hasDriversPermit = debtor.identification.driversPermit?.trim();
    const hasNationalID = debtor.identification.nationalID?.trim();

    if (!hasPassport && !hasDriversPermit && !hasNationalID) {
      errors.identification =
        "At least one form of ID (Passport, Drivers Permit, or National ID) is required.";
    }

    // Check National ID length
    if (
      debtor.identification.nationalID &&
      debtor.identification.nationalID.length !== 11
    ) {
      errors.nationalID = "National ID must be exactly 11 digits.";
    }

    return errors;
  };

  // Handle Add or Save Changes
  const handleAddOrSave = () => {
    const errorsObj = validateDebtor();
    if (Object.keys(errorsObj).length > 0) {
      setDebtorErrors(errorsObj);
    } else {
      setDebtorErrors({});
      if (editingIndex === null) {
        // Adding a new Debtor
        const newDebtor = { ...debtor, id: `D${data.length + 1}` };
        setData((prev) => [...prev, newDebtor]);
      } else {
        // Save changes to existing debtor
        setData((prev) => {
          const updated = [...prev];
          updated[editingIndex] = { ...updated[editingIndex], ...debtor };
          return updated;
        });
      }
      // Reset form
      setDebtor({
        lastName: "",
        firstName: "",
        role: "",
        identification: {},
        employer: "",
        occupation: "",
      });
      setEditingIndex(null);
    }
  };

  // Editing an existing debtor
  const handleEditDebtor = (index: number) => {
    const existing = data[index];
    setEditingIndex(index);
    // Populate the state with the existing debtor's info (omit the "id")
    setDebtor({
      lastName: existing.lastName,
      firstName: existing.firstName,
      role: existing.role,
      identification: { ...existing.identification },
      employer: existing.employer,
      occupation: existing.occupation,
    });
  };

  // Remove an existing debtor
  const handleRemoveDebtor = (index: number) => {
    setData((prev) => prev.filter((_, i) => i !== index));
    // If we're editing the same debtor, reset form
    if (editingIndex === index) {
      setEditingIndex(null);
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

  // Validate at least one debtor before Next
  const handleNext = () => {
    if (data.length === 0) {
      setDebtorErrors({
        identification: "Please add at least one debtor before proceeding.",
      });
      return;
    }
    setDebtorErrors({});
    onNext();
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded text-black shadow">
      {/* Top Nav Buttons side by side (left) */}
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
          onClick={handleNext}
          className={`px-4 py-2 rounded text-white ${
            data.length === 0 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={data.length === 0}
        >
          Next
        </button>
      </div>

      {/* Main Container: Form on left, Table on right (responsive) */}
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        {/* Left Column: Debtor Form */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-bold mb-4">Debtors Information</h2>
          {/* Possibly display the "Please add at least one debtor" error if it exists */}
          {debtorErrors.identification ===
            "Please add at least one debtor before proceeding." && (
            <p className="text-red-500 mb-4">{debtorErrors.identification}</p>
          )}

          <div className="flex flex-col gap-4">
            {/* Last Name */}
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="LAST NAME (LETTERS ONLY)"
                value={debtor.lastName}
                onChange={handleInputChange}
                className="p-2 border rounded w-full text-sm"
              />
              {debtorErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {debtorErrors.lastName}
                </p>
              )}
            </div>

            {/* First Name */}
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="FIRST NAME (LETTERS ONLY)"
                value={debtor.firstName}
                onChange={handleInputChange}
                className="p-2 border rounded w-full text-sm"
              />
              {debtorErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {debtorErrors.firstName}
                </p>
              )}
            </div>

            {/* Role (Dropdown) */}
            <div>
              <select
                name="role"
                value={debtor.role}
                onChange={handleInputChange}
                className="p-2 border rounded w-full text-sm"
              >
                <option value="">-- SELECT ROLE --</option>
                <option value="DIRECTOR">DIRECTOR</option>
                <option value="GUARANTOR">GUARANTOR</option>
              </select>
              {debtorErrors.role && (
                <p className="text-red-500 text-sm mt-1">{debtorErrors.role}</p>
              )}
            </div>

            {/* Employer */}
            <div>
              <input
                type="text"
                name="employer"
                placeholder="EMPLOYER"
                value={debtor.employer}
                onChange={handleInputChange}
                className="p-2 border rounded w-full text-sm"
              />
            </div>

            {/* Occupation */}
            <div>
              <input
                type="text"
                name="occupation"
                placeholder="OCCUPATION"
                value={debtor.occupation}
                onChange={handleInputChange}
                className="p-2 border rounded w-full text-sm"
              />
            </div>

            {/* Identification section */}
            <div>
              <p className="font-semibold mb-2">IDENTIFICATION</p>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                {/* Passport (max 12) */}
                <input
                  type="text"
                  name="passport"
                  placeholder="PASSPORT (MAX 12)"
                  value={debtor.identification.passport || ""}
                  onChange={handleInputChange}
                  className="p-2 border rounded text-sm"
                />

                {/* Drivers Permit (max 12) */}
                <input
                  type="text"
                  name="driversPermit"
                  placeholder="DRIVERS PERMIT (MAX 12)"
                  value={debtor.identification.driversPermit || ""}
                  onChange={handleInputChange}
                  className="p-2 border rounded text-sm"
                />

                {/* National ID (max 11 digits) */}
                <input
                  type="text"
                  name="nationalID"
                  placeholder="NATIONAL ID (MAX 11 DIGITS)"
                  value={debtor.identification.nationalID || ""}
                  onChange={handleInputChange}
                  className="p-2 border rounded text-sm"
                />
              </div>

              {/* At least one ID required error */}
              {debtorErrors.identification &&
                debtorErrors.identification !==
                  "Please add at least one debtor before proceeding." && (
                  <p className="text-red-500 text-sm mt-1">
                    {debtorErrors.identification}
                  </p>
                )}

              {/* Specific National ID error */}
              {debtorErrors.nationalID && (
                <p className="text-red-500 text-sm mt-1">
                  {debtorErrors.nationalID}
                </p>
              )}
            </div>

            {/* Add Debtor or Save Changes Button */}
            <button
              type="button"
              onClick={handleAddOrSave}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              {editingIndex === null ? "ADD DEBTOR" : "SAVE CHANGES"}
            </button>
          </div>
        </div>

        {/* Right Column: Existing Debtors Table */}
        <div className="w-full md:w-1/2">
          {data.length > 0 && (
            <div className="mt-6 md:mt-0">
              <h3 className="text-lg font-bold mb-4">EXISTING DEBTORS</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">ID</th>
                      <th className="p-2 text-left">NAME</th>
                      <th className="p-2 text-left">ROLE</th>
                      <th className="p-2 text-left">EMPLOYER</th>
                      <th className="p-2 text-left">OCCUPATION</th>
                      <th className="p-2 text-left">PASSPORT</th>
                      <th className="p-2 text-left">DRIVERS PERMIT</th>
                      <th className="p-2 text-left">NATIONAL ID</th>
                      <th className="p-2 text-left">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((debtorItem, index) => (
                      <tr key={debtorItem.id} className="border-b">
                        <td className="p-2">{debtorItem.id}</td>
                        <td className="p-2">{`${debtorItem.lastName}, ${debtorItem.firstName}`}</td>
                        <td className="p-2">{debtorItem.role}</td>
                        <td className="p-2">{debtorItem.employer || "N/A"}</td>
                        <td className="p-2">
                          {debtorItem.occupation || "N/A"}
                        </td>
                        <td className="p-2">
                          {debtorItem.identification.passport || "N/A"}
                        </td>
                        <td className="p-2">
                          {debtorItem.identification.driversPermit || "N/A"}
                        </td>
                        <td className="p-2">
                          {debtorItem.identification.nationalID || "N/A"}
                        </td>
                        <td className="p-2">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleEditDebtor(index)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                          >
                            EDIT
                          </button>
                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveDebtor(index)}
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
