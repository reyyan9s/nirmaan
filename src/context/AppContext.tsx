// src/context/AppContext.tsx
// Drop-in replacement for the mock-data context.
// All state is synced with Firebase via service-layer calls.
// UI components call the SAME hooks/values — zero UI changes needed.

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";

import { onAuthChange, signIn, signOut } from "../services/authService";
import { subscribeToWorkers, toggleWorkerAttendance } from "../services/workerService";
import { subscribeToMaterials } from "../services/inventoryService";
import {
  saveInvoice,
  draftInvoice,
  uploadInvoice,
} from "../services/invoiceService";

import {
  AppUser,
  Worker,
  Material,
  Invoice,
  PayrollFilter,
} from "../types";

// ─── Context shape ────────────────────────────────────────────────────────────
type AppContextType = {
  // Auth
  user: AppUser | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // Workers
  workers: Worker[];
  workersLoading: boolean;
  toggleWorker: (workerId: string) => void;
  payrollFilter: PayrollFilter;
  setPayrollFilter: React.Dispatch<React.SetStateAction<PayrollFilter>>;

  // Materials
  materialsData: Material[];
  materialsLoading: boolean;

  // Invoices
  invoices: Invoice[];
  invoicesLoading: boolean;

  // Invoice modal state (preserved from original API)
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

  // Confirm & draft actions wired to Firebase
  confirmInvoice: () => Promise<void>;
  saveDraftInvoice: () => Promise<void>;

  // Toast
  toast: string;
  showToast: (message: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // ── Auth state ──────────────────────────────────────────────────────────────
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Workers ─────────────────────────────────────────────────────────────────
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workersLoading, setWorkersLoading] = useState(true);
  const [payrollFilter, setPayrollFilter] = useState<PayrollFilter>("labour");

  // ── Materials ────────────────────────────────────────────────────────────────
  const [materialsData, setMaterialsData] = useState<Material[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);

  // ── Invoices ─────────────────────────────────────────────────────────────────
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  // ── Invoice modal form (original context API preserved) ──────────────────────
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [supplierName, setSupplierName] = useState("Sharma Steel");
  const [invoiceItems, setInvoiceItems] = useState(
    "TMT Steel Fe500D - 8 tons\nBinding wire - 120 kg\nTransport to Nashik Ring Road site"
  );
  const [invoiceQuantity, setInvoiceQuantity] = useState("8 tons + 120 kg wire");
  const [invoiceTotal, setInvoiceTotal] = useState("₹6,48,500");

  // ── Toast ────────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState("");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = setTimeout(() => setToast(""), 2200);
  }, []);

  // ── Auth listener (persistent session) ───────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthChange((appUser) => {
      setUser(appUser);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // ── Real-time workers listener ────────────────────────────────────────────────
  useEffect(() => {
    setWorkersLoading(true);
    const unsub = subscribeToWorkers(
      (data) => {
        setWorkers(data);
        setWorkersLoading(false);
      },
      (err) => {
        console.error(err);
        showToast("Failed to sync workers.");
        setWorkersLoading(false);
      }
    );
    return unsub;
  }, []);

  // ── Real-time materials listener ──────────────────────────────────────────────
  useEffect(() => {
    setMaterialsLoading(true);
    const unsub = subscribeToMaterials(
      (data) => {
        setMaterialsData(data);
        setMaterialsLoading(false);
      },
      (err) => {
        console.error(err);
        showToast("Failed to sync inventory.");
        setMaterialsLoading(false);
      }
    );
    return unsub;
  }, []);

  // ── Toggle attendance (optimistic + Firebase write) ───────────────────────────
  const toggleWorker = useCallback((workerId: string) => {
    // Optimistic update
    setWorkers((current) =>
      current.map((w) =>
        w.id === workerId ? { ...w, present: !w.present } : w
      )
    );
    // Persist
    const target = workers.find((w) => w.id === workerId);
    if (target) {
      toggleWorkerAttendance(workerId, !target.present).catch((err) => {
        console.error(err);
        showToast("Attendance sync failed. Please retry.");
        // Rollback optimistic update on failure
        setWorkers((current) =>
          current.map((w) =>
            w.id === workerId ? { ...w, present: target.present } : w
          )
        );
      });
    }
  }, [workers, showToast]);

  // ── Auth actions ───────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const appUser = await signIn(email, password);
    setUser(appUser);
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  // ── Invoice confirm → Firebase ─────────────────────────────────────────────────
  const confirmInvoice = useCallback(async () => {
    try {
      const totalNum = parseFloat(
        invoiceTotal.replace(/[^0-9.]/g, "")
      ) || 0;
      await saveInvoice({
        supplierName,
        itemsDescription: invoiceItems,
        totalAmount: totalNum,
        status: "Pending",
        fileUrl: undefined,
      });
      showToast(`Expense added: ${supplierName} invoice booked for ${invoiceTotal}.`);
    } catch (err: any) {
      showToast(err.message ?? "Failed to save invoice.");
    }
  }, [supplierName, invoiceItems, invoiceTotal, showToast]);

  // ── Invoice draft → Firebase ───────────────────────────────────────────────────
  const saveDraftInvoice = useCallback(async () => {
    try {
      const totalNum = parseFloat(
        invoiceTotal.replace(/[^0-9.]/g, "")
      ) || 0;
      await draftInvoice({
        supplierName,
        itemsDescription: invoiceItems,
        totalAmount: totalNum,
        status: "Draft",
        fileUrl: undefined,
      });
      showToast(`Draft saved: ${supplierName} invoice (${invoiceTotal}) stored for later review.`);
    } catch (err: any) {
      showToast(err.message ?? "Failed to save draft.");
    }
  }, [supplierName, invoiceItems, invoiceTotal, showToast]);

  return (
    <AppContext.Provider
      value={{
        // Auth
        user,
        authLoading,
        login,
        logout,

        // Workers
        workers,
        workersLoading,
        toggleWorker,
        payrollFilter,
        setPayrollFilter,

        // Materials
        materialsData,
        materialsLoading,

        // Invoices
        invoices,
        invoicesLoading,

        // Invoice modal (original API)
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

        // Firebase-wired actions
        confirmInvoice,
        saveDraftInvoice,

        // Toast
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
