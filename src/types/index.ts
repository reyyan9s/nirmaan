// src/types/index.ts
// Single source of truth for all shared types.

export type UserRole = "Admin" | "Manager" | "Finance" | "Worker";

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  siteIds: string[];
}

// ─── Workers ────────────────────────────────────────────────────────────────
export type WorkerType = "labour" | "staff";
export type WorkerStatus = "Paid" | "Pending";

export interface Worker {
  id: string;
  name: string;
  role: string;
  /** Location / zone on the site */
  location: string;
  type: WorkerType;
  status: WorkerStatus;
  rateLabel: string;
  rateValue: number;
  baseDays: number;
  /** Today's attendance — toggled locally and synced to attendance_logs */
  present: boolean;
}

// ─── Attendance ──────────────────────────────────────────────────────────────
export interface AttendanceLog {
  id: string;
  workerId: string;
  date: string; // ISO date "YYYY-MM-DD"
  isPresent: boolean;
}

// ─── Materials ───────────────────────────────────────────────────────────────
export interface Material {
  id: string;
  title: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderThreshold: number;
  /** UI-friendly derived fields — always populated by the service mapper */
  stock: string;
  usage: string;
  note: string;
  low: boolean;
  bars: number[];
  yMin: number;
  yMax: number;
}

// ─── Material Usage ──────────────────────────────────────────────────────────
export interface MaterialUsage {
  id: string;
  materialId: string;
  date: string;
  quantityUsed: number;
}

// ─── Invoices ────────────────────────────────────────────────────────────────
export type InvoiceStatus = "Draft" | "Pending" | "Confirmed" | "Rejected";

export interface Invoice {
  id: string;
  supplierName: string;
  itemsDescription: string;
  totalAmount: number;
  status: InvoiceStatus;
  createdAt: string; // ISO timestamp
  fileUrl?: string;
}

// ─── Misc context helpers ────────────────────────────────────────────────────
export type PayrollFilter = "labour" | "staff" | "pending";
export type TabKey = "home" | "workers" | "inventory" | "ai" | "settings";
