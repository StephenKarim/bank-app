"use client";

import { useState } from "react";
import Step1GeneralInformationForm from "./components/Step1GeneralInformationForm";
import Step1DebtorsInformationForm from "./components/Step1DebtorsInformationForm";
// Updated import:
import Step2LiabilityDetailsForm from "./components/Step2LiabilityDetailsForm";

import Step2UnchargedCreditBalancesForm from "./components/Step2UnchargedCreditBalancesForm";
import Step2OtherLiabilitiesForm from "./components/Step2OtherLiabilitiesForm";
import Step3SecuritiesForm, {
  Security,
} from "./components/Step3SecuritiesForm";
import SummaryPage from "./components/SummaryPage";

// ----------------- Types ------------------

export type GeneralInformation = {
  rimNumber: string;
  date: string;
  branch: string;
  address1: string;
  address2: string;
  country: string;
  cautionCategory: string;
  cautionDate: string;
};

export type Debtor = {
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

// Add an optional `id` so we can edit each liability by ID
export type Liability = {
  id?: string;
  type: string;
  number: string;
  debtors: string[]; // Debtor IDs assigned to the liability
  limit: { currency: string; value: string };
  expiryDate: string;
  rate: string;
  liabilities: string;
  idcd: string;
  statuteBarred: string;
};

export type Calculations = {
  total: number;
  lessIDCD: number;
  subTotal: number;
  lessSecurityHeld: number;
  provision: number;
};

export type Account = {
  branch: string;
  type: string;
  accountNumber: string;
  balance: string;
  debtors: string[];
};

// ----------------- Main Component ------------------

export default function CreateA19Form() {
  const [step, setStep] = useState(1);

  // ----------------- Step 1: General Info ------------------
  const [generalInformation, setGeneralInformation] =
    useState<GeneralInformation>({
      rimNumber: "",
      date: "",
      branch: "",
      address1: "",
      address2: "",
      country: "",
      cautionCategory: "",
      cautionDate: "",
    });

  // ----------------- Step 1: Debtors ------------------
  const [debtors, setDebtors] = useState<Debtor[]>([]);

  // ----------------- Step 2: Liabilities ------------------
  const [liabilities, setLiabilities] = useState<Liability[]>([]);

  // We store Less: Security Held in "calculations.lessSecurityHeld"
  // so it persists across steps.
  const [calculations, setCalculations] = useState<Calculations>({
    total: 0,
    lessIDCD: 0,
    subTotal: 0,
    lessSecurityHeld: 0,
    provision: 0,
  });

  // ----------------- Step 2: Uncharged / Other Liabilities ------------------
  const [unchargedAccounts, setUnchargedAccounts] = useState<Account[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<Account[]>([]);

  // ----------------- Step 3: Securities ------------------
  const [securities, setSecurities] = useState<Security[]>([]);

  // Common Next/Back
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  // Final Submit (Step 7 -> Summary)
  const handleSubmit = () => {
    console.log("General Information:", generalInformation);
    console.log("Debtors:", debtors);
    console.log("Liabilities:", liabilities);
    console.log("Calculations:", calculations);
    console.log("Uncharged Credit Balances:", unchargedAccounts);
    console.log("Other Liabilities:", connectedAccounts);
    console.log("Securities:", securities);
    alert("A19 Form Submitted!");
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Create A19 Form</h1>

      {step === 1 && (
        <Step1GeneralInformationForm
          data={generalInformation}
          setData={setGeneralInformation}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <Step1DebtorsInformationForm
          data={debtors}
          setData={setDebtors}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {/* Step 3: Liability Details */}
      {step === 3 && (
        <Step2LiabilityDetailsForm
          accounts={liabilities} // <--- We pass liabilities here
          setAccounts={setLiabilities} // <--- so the child can modify them
          calculations={calculations}
          setCalculations={setCalculations}
          onNext={handleNext}
          onBack={handleBack}
          debtors={debtors}
        />
      )}

      {/* Step 4: Uncharged Credit Balances */}
      {step === 4 && (
        <Step2UnchargedCreditBalancesForm
          accounts={unchargedAccounts}
          setAccounts={setUnchargedAccounts}
          onNext={handleNext}
          onBack={handleBack}
          debtors={debtors}
        />
      )}

      {/* Step 5: Other Liabilities */}
      {step === 5 && (
        <Step2OtherLiabilitiesForm
          accounts={connectedAccounts}
          setAccounts={setConnectedAccounts}
          onNext={handleNext}
          onBack={handleBack}
          debtors={debtors}
        />
      )}

      {/* Step 6: Securities */}
      {step === 6 && (
        <Step3SecuritiesForm
          data={securities}
          setData={setSecurities}
          onSubmit={handleSubmit}
          onNext={handleNext}
          onBack={handleBack}
          debtors={debtors}
        />
      )}

      {/* Step 7: Summary */}
      {step === 7 && (
        <SummaryPage
          generalInformation={generalInformation}
          debtors={debtors}
          liabilities={liabilities}
          unchargedAccounts={unchargedAccounts}
          connectedAccounts={connectedAccounts}
          securities={securities}
          calculations={calculations}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
