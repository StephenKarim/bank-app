"use client";

import { useState } from "react";
import Step1GeneralInformationForm from "./components/Step1GeneralInformationForm";
import Step1DebtorsInformationForm from "./components/Step1DebtorsInformationForm";
import Step2LiabilityDetailsForm from "./components/Step2LiabilityDetailsForm";
import Step2UnchargedCreditBalancesForm from "./components/Step2UnchargedCreditBalancesForm";
import Step2OtherLiabilitiesForm from "./components/Step2OtherLiabilitiesForm";
import Step3SecuritiesForm from "./components/Step3SecuritiesForm";
import { Security } from "./components/Step3SecuritiesForm";
import SummaryPage from "./components/SummaryPage";

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

export type Liability = {
  type: string;
  number: string;
  debtors: string[]; // Debtor IDs assigned to the liability
  limit: { currency: "USD" | "TTD"; value: string };
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
  debtors: string[]; // Debtor IDs assigned to the account
};

export default function CreateA19Form() {
  const [step, setStep] = useState(1);

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

  const [debtors, setDebtors] = useState<Debtor[]>([]);

  const [liabilities, setLiabilities] = useState<Liability[]>([]);

  const [calculations, setCalculations] = useState<Calculations>({
    total: 0,
    lessIDCD: 0,
    subTotal: 0,
    lessSecurityHeld: 0,
    provision: 0,
  });

  const [unchargedAccounts, setUnchargedAccounts] = useState<Account[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<Account[]>([]);

  const [securities, setSecurities] = useState<Security[]>([]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

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

      {step === 3 && (
        <Step2LiabilityDetailsForm
          accounts={liabilities}
          setAccounts={setLiabilities}
          calculations={calculations}
          setCalculations={setCalculations}
          onNext={handleNext}
          onBack={handleBack} // Pass the back handler
          debtors={debtors}
        />
      )}

      {step === 4 && (
        <Step2UnchargedCreditBalancesForm
          accounts={unchargedAccounts} // Passes uncharged accounts
          setAccounts={setUnchargedAccounts}
          onNext={handleNext}
          onBack={handleBack}
          debtors={debtors} // Pass debtors dynamically
        />
      )}

      {step === 5 && (
        <Step2OtherLiabilitiesForm
          accounts={connectedAccounts} // Passes connected accounts
          setAccounts={setConnectedAccounts}
          onNext={handleNext}
          onBack={handleBack}
          debtors={debtors} // Pass debtors dynamically
        />
      )}

      {step === 6 && (
        <Step3SecuritiesForm
          data={securities}
          setData={setSecurities}
          onSubmit={handleSubmit}
          onNext={handleNext}
          onBack={handleBack}
          debtors={debtors} // Pass debtors dynamically
        />
      )}

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
