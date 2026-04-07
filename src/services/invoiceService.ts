// src/services/invoiceService.ts
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { Invoice, InvoiceStatus } from "../types";

const INVOICES_COL = "invoices";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function docToInvoice(id: string, data: any): Invoice {
  return {
    id,
    supplierName: data.supplierName ?? "",
    itemsDescription: data.itemsDescription ?? "",
    totalAmount: data.totalAmount ?? 0,
    status: (data.status as InvoiceStatus) ?? "Draft",
    createdAt:
      data.createdAt?.toDate?.().toISOString?.() ??
      new Date().toISOString(),
    fileUrl: data.fileUrl ?? undefined,
  };
}

// ─── One-time fetch ───────────────────────────────────────────────────────────
export async function getInvoices(): Promise<Invoice[]> {
  try {
    const q = query(
      collection(db, INVOICES_COL),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => docToInvoice(d.id, d.data()));
  } catch (error: any) {
    console.error("[invoiceService] getInvoices:", error);
    throw new Error("Failed to load invoices.");
  }
}

// ─── Real-time listener ───────────────────────────────────────────────────────
export function subscribeToInvoices(
  onData: (invoices: Invoice[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, INVOICES_COL),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => {
      const invoices = snap.docs.map((d) => docToInvoice(d.id, d.data()));
      onData(invoices);
    },
    (err) => {
      console.error("[invoiceService] subscribeToInvoices:", err);
      onError?.(new Error("Real-time invoice sync failed."));
    }
  );
}

// ─── Upload invoice file + save metadata ──────────────────────────────────────
/**
 * Uploads a file blob (image/pdf) to Firebase Storage, then saves the
 * invoice metadata + download URL to Firestore.
 *
 * @param fileUri   Local URI from expo-image-picker or file system.
 * @param metadata  Invoice fields to persist.
 * @returns         The newly created Firestore document ID.
 */
export async function uploadInvoice(
  fileUri: string,
  metadata: {
    supplierName: string;
    itemsDescription: string;
    totalAmount: number;
    status?: InvoiceStatus;
  }
): Promise<string> {
  try {
    // 1. Fetch file as blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    // 2. Upload to Storage
    const filename = `invoices/${Date.now()}_${metadata.supplierName.replace(/\s+/g, "_")}.jpg`;
    const fileRef = storageRef(storage, filename);
    await uploadBytes(fileRef, blob);
    const fileUrl = await getDownloadURL(fileRef);

    // 3. Save metadata to Firestore
    const docRef = await addDoc(collection(db, INVOICES_COL), {
      supplierName: metadata.supplierName,
      itemsDescription: metadata.itemsDescription,
      totalAmount: metadata.totalAmount,
      status: metadata.status ?? "Pending",
      fileUrl,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error: any) {
    console.error("[invoiceService] uploadInvoice:", error);
    throw new Error("Failed to upload invoice.");
  }
}

// ─── Save invoice without file ────────────────────────────────────────────────
export async function saveInvoice(
  data: Omit<Invoice, "id" | "createdAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, INVOICES_COL), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    console.error("[invoiceService] saveInvoice:", error);
    throw new Error("Failed to save invoice.");
  }
}

// ─── Update invoice status ────────────────────────────────────────────────────
export async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus
): Promise<void> {
  try {
    await updateDoc(doc(db, INVOICES_COL, invoiceId), { status });
  } catch (error: any) {
    console.error("[invoiceService] updateInvoiceStatus:", error);
    throw new Error("Failed to update invoice status.");
  }
}

// ─── Mark as draft ────────────────────────────────────────────────────────────
export async function draftInvoice(
  data: Omit<Invoice, "id" | "createdAt">
): Promise<string> {
  return saveInvoice({ ...data, status: "Draft" });
}
