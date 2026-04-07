// src/services/seedService.ts
// ─── One-time data seeder ────────────────────────────────────────────────────
// Run once from an admin screen or dev console to populate Firestore
// with the original mock data. Safe to call multiple times (uses setDoc).

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const SEED_WORKERS = [
  {
    id: "w1",
    name: "Ramesh Kumar",
    role: "Mason",
    site: "Tower B core",
    type: "labour",
    status: "Pending",
    rateLabel: "₹850/day",
    rateValue: 850,
    baseDays: 6,
    present: true,
  },
  {
    id: "w2",
    name: "Suresh Patil",
    role: "Bar Bender",
    site: "Zone B foundation",
    type: "labour",
    status: "Paid",
    rateLabel: "₹920/day",
    rateValue: 920,
    baseDays: 7,
    present: true,
  },
  {
    id: "w3",
    name: "Ganesh Shinde",
    role: "Shuttering Carpenter",
    site: "Tower A slab",
    type: "labour",
    status: "Pending",
    rateLabel: "₹980/day",
    rateValue: 980,
    baseDays: 5,
    present: false,
  },
  {
    id: "w4",
    name: "Imran Shaikh",
    role: "Electrician Helper",
    site: "Basement services",
    type: "labour",
    status: "Paid",
    rateLabel: "₹780/day",
    rateValue: 780,
    baseDays: 6,
    present: true,
  },
  {
    id: "w5",
    name: "Neha Joshi",
    role: "Site Accountant",
    site: "Accounts office",
    type: "staff",
    status: "Paid",
    rateLabel: "₹32,000/month",
    rateValue: 1067,
    baseDays: 30,
    present: true,
  },
  {
    id: "w6",
    name: "Vikram Deshmukh",
    role: "Site Engineer",
    site: "Tower B",
    type: "staff",
    status: "Pending",
    rateLabel: "₹45,000/month",
    rateValue: 1500,
    baseDays: 29,
    present: true,
  },
];

const SEED_MATERIALS = [
  {
    id: "cement",
    title: "Cement",
    category: "Bulk Material",
    unit: "bags",
    currentStock: 185,
    reorderThreshold: 130,
    usageSummary: "612 bags in 7 days",
    note: "Projected depletion in 2 days. Tower B podium pour is driving the spike.",
    bars: [42, 56, 48, 72, 68, 91, 100],
    yMin: 80,
    yMax: 240,
  },
  {
    id: "steel",
    title: "Steel",
    category: "Low Stock Alert",
    unit: "tons",
    currentStock: 12,
    reorderThreshold: 15,
    usageSummary: "Critical reorder window",
    note: "At current bending demand, rebar stock will last 3 days. Sharma Steel quote revision is +15% this month.",
    bars: [88, 78, 62, 54, 42, 28, 18],
    yMin: 5,
    yMax: 30,
  },
  {
    id: "bricks",
    title: "Bricks",
    category: "Masonry",
    unit: "units (×1k)",
    currentStock: 24000,
    reorderThreshold: 8000,
    usageSummary: "8,400 units in 7 days",
    note: "Healthy buffer for 11 days. Masonry pace is aligned with the April schedule.",
    bars: [28, 40, 36, 34, 52, 44, 48],
    yMin: 6,
    yMax: 18,
  },
];

export async function seedFirestore(): Promise<void> {
  console.log("[seedService] Seeding Firestore...");

  // Seed workers
  for (const worker of SEED_WORKERS) {
    const { id, ...data } = worker;
    await setDoc(doc(db, "workers", id), {
      ...data,
      seededAt: serverTimestamp(),
    });
  }
  console.log("[seedService] Workers seeded.");

  // Seed materials
  for (const material of SEED_MATERIALS) {
    const { id, ...data } = material;
    await setDoc(doc(db, "materials", id), {
      ...data,
      seededAt: serverTimestamp(),
    });
  }
  console.log("[seedService] Materials seeded.");
  console.log("[seedService] Done! ✅");
}
