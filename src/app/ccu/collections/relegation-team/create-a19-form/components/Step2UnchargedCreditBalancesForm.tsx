"use client";

import React, { useState } from "react";

type Account = {
  debtors: string[]; // References to debtor IDs
  branch: string;
  type: string;
  accountNumber: string;
  balance: string;
};

type Debtor = {
  id: string; // Updated to match the new debtor structure
  lastName: string;
  firstName: string;
};

export default function Step2UnchargedCreditBalancesForm({
  accounts,
  setAccounts,
  onNext,
  onBack,
  debtors, // Pass dynamic debtor list
}: {
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  onNext: () => void;
  onBack: () => void;
  debtors: Debtor[];
}) {
  const [newAccount, setNewAccount] = useState<Account>({
    debtors: [],
    branch: "",
    type: "",
    accountNumber: "",
    balance: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({ ...prev, [name]: value }));
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
      debtors: [],
      branch: "",
      type: "",
      accountNumber: "",
      balance: "",
    });
  };

  const removeAccount = (index: number) => {
    setAccounts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Uncharged Credit Balances</h2>

      {/* Add New Account */}
      <h3 className="text-lg font-bold mb-2">Add Account</h3>
      <div className="flex flex-col gap-4">
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
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={newAccount.branch}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="type"
          placeholder="Type (e.g., CHQ, SAV)"
          value={newAccount.type}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          value={newAccount.accountNumber}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="balance"
          placeholder="Balance"
          value={newAccount.balance}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
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
                  <strong>Branch:</strong> {account.branch}
                </p>
                <p>
                  <strong>Type:</strong> {account.type}
                </p>
                <p>
                  <strong>Account Number:</strong> {account.accountNumber}
                </p>
                <p>
                  <strong>Balance:</strong> ${account.balance}
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
                  onClick={() => removeAccount(index)}
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
          onClick={onNext}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
