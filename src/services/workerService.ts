// src/services/workerService.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Worker, AttendanceLog } from "../types";

const WORKERS_COL = "workers";
const ATTENDANCE_COL = "attendance_logs";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function docToWorker(id: string, data: any): Worker {
  return {
    id,
    name: data.name ?? "",
    role: data.role ?? "",
    location: data.site ?? data.location ?? "",
    type: data.type ?? "labour",
    status: data.status ?? "Pending",
    rateLabel: data.rateLabel ?? `₹${data.rateValue}/day`,
    rateValue: data.rateValue ?? 0,
    baseDays: data.baseDays ?? 0,
    present: data.present ?? false,
  };
}

// ─── One-time fetch ───────────────────────────────────────────────────────────
export async function getWorkers(): Promise<Worker[]> {
  try {
    const snap = await getDocs(collection(db, WORKERS_COL));
    return snap.docs.map((d) => docToWorker(d.id, d.data()));
  } catch (error: any) {
    console.error("[workerService] getWorkers:", error);
    throw new Error("Failed to load workers.");
  }
}

export async function getWorkerById(id: string): Promise<Worker | null> {
  try {
    const snap = await getDoc(doc(db, WORKERS_COL, id));
    if (!snap.exists()) return null;
    return docToWorker(snap.id, snap.data());
  } catch (error: any) {
    console.error("[workerService] getWorkerById:", error);
    throw new Error("Failed to load worker details.");
  }
}

// ─── Real-time listener ───────────────────────────────────────────────────────
/** Subscribes to the workers collection. Returns unsubscribe fn. */
export function subscribeToWorkers(
  onData: (workers: Worker[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, WORKERS_COL), orderBy("name"));
  return onSnapshot(
    q,
    (snap) => {
      const workers = snap.docs.map((d) => docToWorker(d.id, d.data()));
      onData(workers);
    },
    (err) => {
      console.error("[workerService] subscribeToWorkers:", err);
      onError?.(new Error("Real-time worker sync failed."));
    }
  );
}

// ─── Update payment status ────────────────────────────────────────────────────
export async function updateWorkerStatus(
  workerId: string,
  status: "Paid" | "Pending"
): Promise<void> {
  try {
    await updateDoc(doc(db, WORKERS_COL, workerId), { status });
  } catch (error: any) {
    console.error("[workerService] updateWorkerStatus:", error);
    throw new Error("Failed to update worker status.");
  }
}

// ─── Toggle attendance ────────────────────────────────────────────────────────
export async function toggleWorkerAttendance(
  workerId: string,
  isPresent: boolean
): Promise<void> {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Update the worker's live `present` flag
    await updateDoc(doc(db, WORKERS_COL, workerId), { present: isPresent });

    // Upsert today's attendance log
    const logsRef = collection(db, ATTENDANCE_COL);
    const existingQ = query(
      logsRef,
      where("workerId", "==", workerId),
      where("date", "==", today)
    );
    const existing = await getDocs(existingQ);

    if (existing.empty) {
      await addDoc(logsRef, { workerId, date: today, isPresent });
    } else {
      await updateDoc(existing.docs[0].ref, { isPresent });
    }
  } catch (error: any) {
    console.error("[workerService] toggleWorkerAttendance:", error);
    throw new Error("Failed to update attendance.");
  }
}

// ─── Add worker ───────────────────────────────────────────────────────────────
export async function addWorker(
  worker: Omit<Worker, "id">
): Promise<string> {
  try {
    const ref = await addDoc(collection(db, WORKERS_COL), {
      ...worker,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error: any) {
    console.error("[workerService] addWorker:", error);
    throw new Error("Failed to add worker.");
  }
}

// ─── Delete worker ────────────────────────────────────────────────────────────
export async function deleteWorker(workerId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, WORKERS_COL, workerId));
  } catch (error: any) {
    console.error("[workerService] deleteWorker:", error);
    throw new Error("Failed to delete worker.");
  }
}

// ─── Fetch attendance logs for date range ─────────────────────────────────────
export async function getAttendanceLogs(
  workerId: string,
  fromDate: string,
  toDate: string
): Promise<AttendanceLog[]> {
  try {
    const q = query(
      collection(db, ATTENDANCE_COL),
      where("workerId", "==", workerId),
      where("date", ">=", fromDate),
      where("date", "<=", toDate),
      orderBy("date", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      workerId: d.data().workerId,
      date: d.data().date,
      isPresent: d.data().isPresent,
    }));
  } catch (error: any) {
    console.error("[workerService] getAttendanceLogs:", error);
    throw new Error("Failed to load attendance logs.");
  }
}
