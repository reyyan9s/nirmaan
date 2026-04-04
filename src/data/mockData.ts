export type TabKey = "home" | "workers" | "inventory" | "ai" | "settings";
export type PayrollFilter = "labour" | "staff" | "pending";

export type Worker = {
  id: string;
  name: string;
  role: string;
  location: string;
  type: "labour" | "staff";
  status: "Paid" | "Pending";
  rateLabel: string;
  rateValue: number;
  baseDays: number;
  present: boolean;
};

export type Material = {
  id: string;
  title: string;
  category: string;
  stock: string;
  usage: string;
  note: string;
  low: boolean;
  bars: number[];      // 7 values, 0-100 scale relative to each material's max
  unit: string;        // e.g. "bags", "tons", "units"
  reorderThreshold: number; // 0-100 scale — where the dashed red line sits
  yMin: number;        // real-world min shown on Y axis
  yMax: number;        // real-world max shown on Y axis
};

export const initialWorkers: Worker[] = [
  {
    id: "1",
    name: "Ramesh Kumar",
    role: "Mason",
    location: "Tower B core",
    type: "labour",
    status: "Pending",
    rateLabel: "₹850/day",
    rateValue: 850,
    baseDays: 6,
    present: true,
  },
  {
    id: "2",
    name: "Suresh Patil",
    role: "Bar Bender",
    location: "Zone B foundation",
    type: "labour",
    status: "Paid",
    rateLabel: "₹920/day",
    rateValue: 920,
    baseDays: 7,
    present: true,
  },
  {
    id: "3",
    name: "Ganesh Shinde",
    role: "Shuttering Carpenter",
    location: "Tower A slab",
    type: "labour",
    status: "Pending",
    rateLabel: "₹980/day",
    rateValue: 980,
    baseDays: 5,
    present: false,
  },
  {
    id: "4",
    name: "Imran Shaikh",
    role: "Electrician Helper",
    location: "Basement services",
    type: "labour",
    status: "Paid",
    rateLabel: "₹780/day",
    rateValue: 780,
    baseDays: 6,
    present: true,
  },
  {
    id: "5",
    name: "Neha Joshi",
    role: "Site Accountant",
    location: "Accounts office",
    type: "staff",
    status: "Paid",
    rateLabel: "₹32,000/month",
    rateValue: 1067,
    baseDays: 30,
    present: true,
  },
  {
    id: "6",
    name: "Vikram Deshmukh",
    role: "Site Engineer",
    location: "Tower B",
    type: "staff",
    status: "Pending",
    rateLabel: "₹45,000/month",
    rateValue: 1500,
    baseDays: 29,
    present: true,
  },
];

export const materials: Material[] = [
  {
    id: "cement",
    title: "Cement",
    category: "Bulk Material",
    stock: "185 bags",
    usage: "612 bags in 7 days",
    note: "Projected depletion in 2 days. Tower B podium pour is driving the spike.",
    low: false,
    // Daily usage: 42→56→48→72→68→91→100 (relative 0-100, maps to 80–240 bags)
    bars: [42, 56, 48, 72, 68, 91, 100],
    unit: "bags",
    reorderThreshold: 55,   // ~130 bags — reorder if daily usage exceeds this
    yMin: 80,
    yMax: 240,
  },
  {
    id: "steel",
    title: "Steel",
    category: "Low Stock Alert",
    stock: "12 tons",
    usage: "Critical reorder window",
    note: "At current bending demand, rebar stock will last 3 days. Sharma Steel quote revision is +15% this month.",
    low: true,
    // Stock falling: 88→78→62→54→42→28→18
    bars: [88, 78, 62, 54, 42, 28, 18],
    unit: "tons",
    reorderThreshold: 35,   // ~12 tons remaining — already breached
    yMin: 5,
    yMax: 30,
  },
  {
    id: "bricks",
    title: "Bricks",
    category: "Masonry",
    stock: "24,000 units",
    usage: "8,400 units in 7 days",
    note: "Healthy buffer for 11 days. Masonry pace is aligned with the April schedule.",
    low: false,
    bars: [28, 40, 36, 34, 52, 44, 48],
    unit: "units (×1k)",
    reorderThreshold: 25,   // ~8,000 units/day usage threshold
    yMin: 6,
    yMax: 18,
  },
];
