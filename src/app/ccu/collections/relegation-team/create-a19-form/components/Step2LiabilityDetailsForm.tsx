"use client";

import React, { useState, useEffect } from "react";

type Account = {
  type: string;
  number: string;
  debtors: string[]; // References to debtor IDs
  limit: { currency: "USD" | "TTD"; value: string };
  expiryDate: string;
  rate: string;
  liabilities: string;
  idcd: string;
  statuteBarred: string;
};

type Debtor = {
  id: string; // Updated to match the new debtor structure
  lastName: string;
  firstName: string;
};

type Calculations = {
  total: number;
  lessIDCD: number;
  subTotal: number;
  lessSecurityHeld: number;
  provision: number;
};

export default function Step2LiabilityDetailsForm({
  accounts,
  setAccounts,
  calculations,
  setCalculations,
  onNext,
  onBack,
  debtors, // Pass dynamic debtor list
}: {
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  calculations: Calculations;
  setCalculations: React.Dispatch<React.SetStateAction<Calculations>>;
  onNext: () => void;
  onBack: () => void;
  debtors: Debtor[];
}) {
  const [newAccount, setNewAccount] = useState<Account>({
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

  const [lessSecurityHeld, setLessSecurityHeld] = useState<number>(0);

  // Maintain calculations for totals
  useEffect(() => {
    const total = accounts.reduce(
      (sum, acc) => sum + parseFloat(acc.liabilities || "0"),
      0
    );
    const lessIDCD = accounts.reduce(
      (sum, acc) => sum + parseFloat(acc.idcd || "0"),
      0
    );
    const subTotal = total - lessIDCD;

    const provision = total - lessSecurityHeld;

    setCalculations({
      total,
      lessIDCD,
      subTotal,
      lessSecurityHeld,
      provision,
    });
  }, [accounts, lessSecurityHeld, setCalculations]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "currency") {
      setNewAccount((prev) => ({
        ...prev,
        limit: { ...prev.limit, currency: value as "USD" | "TTD" },
      }));
    } else if (name === "limitValue") {
      setNewAccount((prev) => ({
        ...prev,
        limit: { ...prev.limit, value },
      }));
    } else {
      setNewAccount((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDebtorChange = (debtorId: string) => {
    setNewAccount((prev) => ({
      ...prev,
      debtors: prev.debtors.includes(debtorId)
        ? prev.debtors.filter((id) => id !== debtorId)
        : [...prev.debtors, debtorId],
    }));
  };

  const addAccount = () => {
    setAccounts((prev) => [...prev, newAccount]);
    setNewAccount({
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
  };

  const handleRemoveAccount = (index: number) => {
    const removedAccount = accounts[index]; // Get the account being removed
    setAccounts((prev) => prev.filter((_, i) => i !== index)); // Remove the account

    // Update calculations after removing the account
    const updatedTotal =
      calculations.total - parseFloat(removedAccount.liabilities || "0");
    const updatedLessIDCD =
      calculations.lessIDCD - parseFloat(removedAccount.idcd || "0");
    const updatedSubTotal = updatedTotal - updatedLessIDCD;
    const updatedProvision = updatedTotal - calculations.lessSecurityHeld;

    setCalculations({
      ...calculations,
      total: updatedTotal,
      lessIDCD: updatedLessIDCD,
      subTotal: updatedSubTotal,
      provision: updatedProvision,
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Facility & Account No.</h2>

      {/* Less: Security Held */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Less: Security Held
        </label>
        <input
          type="number"
          value={lessSecurityHeld}
          onChange={(e) => setLessSecurityHeld(parseFloat(e.target.value) || 0)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Add New Account */}
      <h3 className="text-lg font-bold mb-2">Add Account</h3>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={newAccount.type}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="number"
          placeholder="Account Number"
          value={newAccount.number}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <div className="flex gap-2 items-center">
          <select
            name="currency"
            value={newAccount.limit.currency}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="USD">USD</option>
            <option value="TTD">TTD</option>
          </select>
          <input
            type="text"
            name="limitValue"
            placeholder="Limit Value"
            value={newAccount.limit.value}
            onChange={handleInputChange}
            className="p-2 border rounded flex-grow"
          />
        </div>
        <input
          type="date"
          name="expiryDate"
          value={newAccount.expiryDate}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="rate"
          placeholder="Rate (%)"
          value={newAccount.rate}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="liabilities"
          placeholder="Liabilities"
          value={newAccount.liabilities}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="idcd"
          placeholder="IDCD"
          value={newAccount.idcd}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="statuteBarred"
          value={newAccount.statuteBarred}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        />

        <div>
          <h4 className="font-semibold mb-2">Assign Debtors</h4>
          {debtors.map((debtor) => (
            <label key={debtor.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newAccount.debtors.includes(debtor.id)}
                onChange={() => handleDebtorChange(debtor.id)}
              />
              {debtor.id} - {debtor.lastName}, {debtor.firstName}
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={addAccount}
          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Account
        </button>
      </div>

      {/* List of Existing Accounts */}
      {accounts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">Existing Accounts</h3>
          <ul className="list-disc pl-6">
            {accounts.map((account, index) => (
              <li key={index} className="mb-4 border-b pb-4">
                <p>
                  <strong>Type:</strong> {account.type}
                </p>
                <p>
                  <strong>Account Number:</strong> {account.number}
                </p>
                <p>
                  <strong>Liabilities:</strong> ${account.liabilities}
                </p>
                <p>
                  <strong>IDCD:</strong> ${account.idcd || "N/A"}
                </p>
                <p>
                  <strong>Rate (%):</strong> {account.rate || "N/A"}
                </p>
                <p>
                  <strong>Debtors:</strong>{" "}
                  {account.debtors.length > 0
                    ? account.debtors
                        .map((debtorId) => {
                          const debtor = debtors.find((d) => d.id === debtorId);
                          return debtor
                            ? `${debtor.id} - ${debtor.lastName}, ${debtor.firstName}`
                            : "Unknown";
                        })
                        .join("; ")
                    : "None"}
                </p>
                <button
                  type="button"
                  className="mt-2 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => handleRemoveAccount(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Calculations */}
      <div className="mt-4 bg-gray-100 p-4 rounded">
        <p>
          <strong>Total:</strong> ${calculations.total.toFixed(2)}
        </p>
        <p>
          <strong>Less: IDCD:</strong> ${calculations.lessIDCD.toFixed(2)}
        </p>
        <p>
          <strong>Subtotal:</strong> ${calculations.subTotal.toFixed(2)}
        </p>
        <p>
          <strong>Less: Security Held:</strong> $
          {calculations.lessSecurityHeld.toFixed(2)}
        </p>
        <p>
          <strong>Provision:</strong> ${calculations.provision.toFixed(2)}
        </p>
      </div>

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
          onClick={onNext}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
