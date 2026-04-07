// src/services/inventoryService.ts
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  increment,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Material, MaterialUsage } from "../types";

const MATERIALS_COL = "materials";
const USAGE_COL = "material_usage";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function docToMaterial(id: string, data: any): Material {
  const currentStock: number = data.currentStock ?? 0;
  const reorderThreshold: number = data.reorderThreshold ?? 0;
  const unit: string = data.unit ?? "";

  return {
    id,
    title: data.title ?? "",
    category: data.category ?? "",
    unit,
    currentStock,
    reorderThreshold,
    // UI-friendly derived fields
    stock: `${currentStock} ${unit}`,
    usage: data.usageSummary ?? "",
    note: data.note ?? "",
    low: currentStock <= reorderThreshold,
    bars: data.bars ?? [],
    yMin: data.yMin ?? 0,
    yMax: data.yMax ?? currentStock * 1.5,
  };
}

// ─── One-time fetch ───────────────────────────────────────────────────────────
export async function getMaterials(): Promise<Material[]> {
  try {
    const snap = await getDocs(collection(db, MATERIALS_COL));
    return snap.docs.map((d) => docToMaterial(d.id, d.data()));
  } catch (error: any) {
    console.error("[inventoryService] getMaterials:", error);
    throw new Error("Failed to load materials.");
  }
}

// ─── Real-time listener ───────────────────────────────────────────────────────
/** Subscribes to the materials collection. Returns unsubscribe fn. */
export function subscribeToMaterials(
  onData: (materials: Material[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, MATERIALS_COL), orderBy("title"));
  return onSnapshot(
    q,
    (snap) => {
      const materials = snap.docs.map((d) => docToMaterial(d.id, d.data()));
      onData(materials);
    },
    (err) => {
      console.error("[inventoryService] subscribeToMaterials:", err);
      onError?.(new Error("Real-time inventory sync failed."));
    }
  );
}

// ─── Update stock ─────────────────────────────────────────────────────────────
export async function updateStock(
  materialId: string,
  delta: number // positive = add stock, negative = consume
): Promise<void> {
  try {
    await updateDoc(doc(db, MATERIALS_COL, materialId), {
      currentStock: increment(delta),
    });
  } catch (error: any) {
    console.error("[inventoryService] updateStock:", error);
    throw new Error("Failed to update stock.");
  }
}

// ─── Log material usage ───────────────────────────────────────────────────────
export async function logMaterialUsage(
  materialId: string,
  quantityUsed: number
): Promise<void> {
  try {
    const today = new Date().toISOString().split("T")[0];
    await addDoc(collection(db, USAGE_COL), {
      materialId,
      date: today,
      quantityUsed,
      createdAt: serverTimestamp(),
    });
    // Deduct from stock
    await updateStock(materialId, -quantityUsed);
  } catch (error: any) {
    console.error("[inventoryService] logMaterialUsage:", error);
    throw new Error("Failed to log material usage.");
  }
}

// ─── Add material ─────────────────────────────────────────────────────────────
export async function addMaterial(
  material: Omit<Material, "id" | "stock" | "usage" | "note" | "low" | "bars" | "yMin" | "yMax">
): Promise<string> {
  try {
    const ref = await addDoc(collection(db, MATERIALS_COL), {
      ...material,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error: any) {
    console.error("[inventoryService] addMaterial:", error);
    throw new Error("Failed to add material.");
  }
}

// ─── Fetch usage logs ─────────────────────────────────────────────────────────
export async function getMaterialUsage(
  materialId: string,
  days = 7
): Promise<MaterialUsage[]> {
  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    const fromStr = fromDate.toISOString().split("T")[0];

    const q = query(
      collection(db, USAGE_COL),
      where("materialId", "==", materialId),
      where("date", ">=", fromStr),
      orderBy("date", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      materialId: d.data().materialId,
      date: d.data().date,
      quantityUsed: d.data().quantityUsed,
    }));
  } catch (error: any) {
    console.error("[inventoryService] getMaterialUsage:", error);
    throw new Error("Failed to load material usage.");
  }
}

// ─── Dashboard metrics ────────────────────────────────────────────────────────
export async function getLowStockCount(): Promise<number> {
  const materials = await getMaterials();
  return materials.filter((m) => m.low).length;
}
