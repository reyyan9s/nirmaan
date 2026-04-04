import React, { createContext, useContext, useState, ReactNode } from "react";
import { Worker, PayrollFilter, initialWorkers, materials, Material } from "../data/mockData";

type AppContextType = {
  workers: Worker[];
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
  toggleWorker: (workerId: string) => void;
  payrollFilter: PayrollFilter;
  setPayrollFilter: React.Dispatch<React.SetStateAction<PayrollFilter>>;
  materialsData: Material[];
  
  voiceOpen: boolean;
  setVoiceOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  invoiceOpen: boolean;
  setInvoiceOpen: React.Dispatch<React.SetStateAction<boolean>>;
  supplierName: string;
  setSupplierName: React.Dispatch<React.SetStateAction<string>>;
  invoiceItems: string;
  setInvoiceItems: React.Dispatch<React.SetStateAction<string>>;
  invoiceQuantity: string;
  setInvoiceQuantity: React.Dispatch<React.SetStateAction<string>>;
  invoiceTotal: string;
  setInvoiceTotal: React.Dispatch<React.SetStateAction<string>>;
  
  toast: string;
  showToast: (message: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [payrollFilter, setPayrollFilter] = useState<PayrollFilter>("labour");
  
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [toast, setToast] = useState("");
  
  const [supplierName, setSupplierName] = useState("Sharma Steel");
  const [invoiceItems, setInvoiceItems] = useState(
    "TMT Steel Fe500D - 8 tons\nBinding wire - 120 kg\nTransport to Nashik Ring Road site"
  );
  const [invoiceQuantity, setInvoiceQuantity] = useState("8 tons + 120 kg wire");
  const [invoiceTotal, setInvoiceTotal] = useState("₹6,48,500");

  const materialsData: Material[] = materials;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const toggleWorker = (workerId: string) => {
    setWorkers((current) =>
      current.map((w) => (w.id === workerId ? { ...w, present: !w.present } : w))
    );
  };

  return (
    <AppContext.Provider
      value={{
        workers,
        setWorkers,
        toggleWorker,
        payrollFilter,
        setPayrollFilter,
        materialsData,
        voiceOpen,
        setVoiceOpen,
        invoiceOpen,
        setInvoiceOpen,
        supplierName,
        setSupplierName,
        invoiceItems,
        setInvoiceItems,
        invoiceQuantity,
        setInvoiceQuantity,
        invoiceTotal,
        setInvoiceTotal,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
