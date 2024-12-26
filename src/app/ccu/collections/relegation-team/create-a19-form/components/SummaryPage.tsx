"use client";
import React, { useState } from "react";
import { GeneralInformation, Debtor, Liability, Account } from "../page";
import { Security } from "../components/Step3SecuritiesForm.jsx";

interface SummaryPageProps {
  generalInformation: GeneralInformation;
  debtors: Debtor[];
  liabilities: Liability[];
  unchargedAccounts: Account[];
  connectedAccounts: Account[];
  securities: Security[];
  calculations: {
    total: number;
    lessIDCD: number;
    lessSecurityHeld: number;
    subTotal: number;
    provision: number;
  };
  onBack: () => void;
  // New prop for clearing the form data
  onResetForm?: () => void;
}

export default function SummaryPage({
  generalInformation,
  debtors,
  liabilities,
  unchargedAccounts,
  connectedAccounts,
  securities,
  calculations,
  onBack,
}: SummaryPageProps) {
  // Local state to track success/error message after POST
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  /**
   * Helper: Convert string or number to a real number (e.g. "123" -> 123).
   * Returns 0 if parsing fails.
   */
  const toNumber = (val: string | number): number => {
    const parsed = parseFloat(String(val));
    return isNaN(parsed) ? 0 : parsed;
  };

  /**
   * Helper: Convert arrays like ["D1", "2"] into [1, 2].
   */
  const parseDebtors = (debtorArray: Array<string | number>): number[] => {
    return debtorArray.map((d) => {
      if (typeof d === "string") {
        if (d.startsWith("D")) {
          // "D1" -> 1
          return parseInt(d.slice(1), 10) || 0;
        }
        // If it's just "2", parse to 2
        return parseInt(d, 10) || 0;
      }
      // It's already a number
      return d;
    });
  };

  // Handle POST to /api/relegatedGroups
  const handlePost = async () => {
    try {
      const payload = {
        generalInformation: {
          rimNumber: generalInformation.rimNumber,
          branch: generalInformation.branch,
          address1: generalInformation.address1,
          address2: generalInformation.address2,
          country: generalInformation.country,
          cautionCategory: generalInformation.cautionCategory,
          cautionDate: generalInformation.cautionDate,
        },
        debtors: debtors.map((debtor) => ({
          lastName: debtor.lastName,
          firstName: debtor.firstName,
          role: debtor.role,
          employer: debtor.employer,
          occupation: debtor.occupation,
          identification: {
            passport: debtor.identification.passport || undefined,
            driversPermit: debtor.identification.driversPermit || undefined,
            nationalID: debtor.identification.nationalID || undefined,
          },
        })),
        liabilities: liabilities.map((liab) => ({
          type: liab.type,
          number: liab.number,
          limitCurrency: liab.limit.currency,
          limitValue: toNumber(liab.limit.value),
          expiryDate: liab.expiryDate,
          rate: toNumber(liab.rate),
          liabilities: toNumber(liab.liabilities),
          idcd: toNumber(liab.idcd),
          statuteBarred: liab.statuteBarred,
          debtors: parseDebtors(liab.debtors),
        })),
        securities: securities.map((sec) => ({
          description: sec.description,
          rstc: toNumber(sec.rstc),
          mv: toNumber(sec.mv),
          use: sec.use,
          demand: sec.demand,
          secures: sec.secures,
          advertised: sec.advertised,
          dateAdvertised: sec.dateAdvertised,
          valuation: toNumber(sec.valuation),
          debtors: parseDebtors(sec.debtors),
        })),
        unchargedAccounts: unchargedAccounts.map((acct) => ({
          branch: acct.branch,
          type: acct.type,
          accountNumber: acct.accountNumber,
          balance: toNumber(acct.balance),
          debtors: parseDebtors(acct.debtors),
        })),
        connectedAccounts: connectedAccounts.map((acct) => ({
          branch: acct.branch,
          type: acct.type,
          accountNumber: acct.accountNumber,
          balance: toNumber(acct.balance),
          debtors: parseDebtors(acct.debtors),
        })),
      };

      const response = await fetch("/api/relegatedGroups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          success: true,
          message: "Data saved successfully!",
        });
      } else {
        setSubmitStatus({
          success: false,
          message: "Error saving data: " + (result.error || ""),
        });
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      setSubmitStatus({
        success: false,
        message: "An unexpected error occurred.",
      });
    }
  };

  /**
   * Use the browser's print -> Save as PDF. We'll hide buttons with CSS.
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * Add Another: if you only want to refresh the page instead of calling
   * onResetForm, just do a window.location.reload() below.
   */
  const handleAddAnother = () => {
    // CHANGED to simply reload the page
    window.location.reload();
  };

  // Helper for displaying a list of D# debtors
  const mapDebtorsToDisplay = (debtorArray: string[] = []) => {
    if (debtorArray.length === 0) return "";
    return debtorArray.join(", ");
  };

  return (
    <>
      {/* 
        Global style: .no-print elements don't show in print previews
      */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .overflow-x-auto {
            overflow: visible !important;
          }
        }
      `}</style>

      <div className="min-h-screen p-8 bg-white text-left">
        {/* Buttons at top-left (hide in print with .no-print) */}
        <div className="no-print flex items-center gap-4 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>

          {/* Post button (was Confirm and Submit) */}
          <button
            type="button"
            onClick={handlePost}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Post
          </button>

          {/* Add Another: now simply reloads the page */}
          <button
            type="button"
            onClick={handleAddAnother}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Add Another
          </button>

          {/* Print -> Save as PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Print or Save as PDF
          </button>
        </div>

        <h1 className="no-print text-3xl font-bold mb-6">Create A19 Form</h1>

        <h2 className="text-2xl font-bold mb-4">Summary</h2>

        {/* General Information */}
        <section className="mb-6">
          <h3 className="text-xl font-bold">General Information</h3>
          <table className="w-full table-auto border-collapse">
            <tbody>
              <tr>
                <td className="font-bold pr-4">RIM Number:</td>
                <td>{generalInformation.rimNumber}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Date:</td>
                <td>{generalInformation.date}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Branch:</td>
                <td>{generalInformation.branch}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Address:</td>
                <td>
                  {generalInformation.address1}, {generalInformation.address2}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Country:</td>
                <td>{generalInformation.country}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Caution Category:</td>
                <td>{generalInformation.cautionCategory}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Caution Date:</td>
                <td>{generalInformation.cautionDate}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Debtors */}
        <section className="mb-6">
          <h3 className="text-xl font-bold">Debtors</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Role</th>
                  <th className="border border-gray-300 px-4 py-2">Employer</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Occupation
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Identification
                  </th>
                </tr>
              </thead>
              <tbody>
                {debtors.map((debtor, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">
                      D{index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {debtor.firstName} {debtor.lastName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {debtor.role}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {debtor.employer}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {debtor.occupation}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {debtor.identification.passport && (
                        <p>PP# {debtor.identification.passport}</p>
                      )}
                      {debtor.identification.driversPermit && (
                        <p>DP# {debtor.identification.driversPermit}</p>
                      )}
                      {debtor.identification.nationalID && (
                        <p>ID# {debtor.identification.nationalID}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Liabilities */}
        <section className="mb-6">
          <h3 className="text-xl font-bold">Liabilities</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">
                    Debtor(s)
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Type</th>
                  <th className="border border-gray-300 px-4 py-2">Number</th>
                  <th className="border border-gray-300 px-4 py-2">Limit</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Liabilities
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Rate (%)</th>
                  <th className="border border-gray-300 px-4 py-2">IDCD</th>
                </tr>
              </thead>
              <tbody>
                {liabilities.map((liability, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">
                      {mapDebtorsToDisplay(liability.debtors)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {liability.type}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {liability.number}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {liability.limit.currency} {liability.limit.value}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {liability.liabilities}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {liability.rate}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {liability.idcd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <p>
              <strong>Total:</strong> ${calculations.total}
            </p>
            <p>
              <strong>Less: Security Held:</strong> $
              {calculations.lessSecurityHeld}
            </p>
            <p>
              <strong>Less: IDCD:</strong> ${calculations.lessIDCD}
            </p>
            <p>
              <strong>Subtotal:</strong> ${calculations.subTotal}
            </p>
            <p>
              <strong>Provision:</strong> ${calculations.provision}
            </p>
          </div>
        </section>

        {/* Uncharged Credit Balances */}
        <section className="mb-6">
          <h3 className="text-xl font-bold">Uncharged Credit Balances</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">
                    Debtor(s)
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Branch</th>
                  <th className="border border-gray-300 px-4 py-2">Type</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Account Number
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {unchargedAccounts.map((account, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">
                      {mapDebtorsToDisplay(account.debtors)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {account.branch}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {account.type}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {account.accountNumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {account.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Connected Accounts */}
        <section className="mb-6">
          <h3 className="text-xl font-bold">Other Liabilities</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">
                    Debtor(s)
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Branch</th>
                  <th className="border border-gray-300 px-4 py-2">Type</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Account Number
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {connectedAccounts.map((account, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">
                      {mapDebtorsToDisplay(account.debtors)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {account.branch}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {account.type}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {account.accountNumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {account.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Securities */}
        <section className="mb-6">
          <h3 className="text-xl font-bold">Securities</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">
                    DESCRIPTION
                  </th>
                  <th className="border border-gray-300 px-4 py-2">RSTC</th>
                  <th className="border border-gray-300 px-4 py-2">MV</th>
                  <th className="border border-gray-300 px-4 py-2">USE</th>
                  <th className="border border-gray-300 px-4 py-2">DEMAND</th>
                  <th className="border border-gray-300 px-4 py-2">
                    PPTY SECURES
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Advertised
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Date Advertised
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Valuation/Adv8
                  </th>
                </tr>
              </thead>
              <tbody>
                {securities.map((security, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {security.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {security.rstc}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {security.mv}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {security.use}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {security.demand}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {security.secures}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {security.advertised ? "Yes" : "No"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {security.dateAdvertised}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {security.valuation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Submission status message */}
        {submitStatus && (
          <div
            className={`mt-4 p-2 rounded ${
              submitStatus.success
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {submitStatus.message}
          </div>
        )}
      </div>
    </>
  );
}
