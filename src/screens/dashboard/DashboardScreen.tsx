import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Text } from "react-native";
import { HeroHeader } from "../../components/layout/HeroHeader";
import { MetricCard } from "../../components/cards/MetricCard";
import { AIInsightBanner } from "../../components/cards/AIInsightBanner";
import { Card } from "../../components/cards/Card";
import { AnomalyCard } from "../../components/cards/AnomalyCard";
import { LegendItem, SpendingChart } from "../../components/cards/SpendingChart";
import { InfoPill } from "../../components/feedback/InfoPill";
import { colors } from "../../theme/colors";
import { useAppContext } from "../../context/AppContext";
import { MicIcon, ReceiptIcon, UsersIcon } from "../../components/Icons";

// Budget figures
const BUDGET_TOTAL = 5525000;  // ₹55,25,000
const BUDGET_USED  = 4285000;  // ₹42,85,000
const BUDGET_PROGRESS = BUDGET_USED / BUDGET_TOTAL; // ~0.78

export function DashboardScreen() {
  const { setInvoiceOpen, showToast, workers, materialsData } = useAppContext();

  // Dynamic calculations
  const labourCount = workers.filter(w => w.type === 'labour').length;
  const staffCount = workers.filter(w => w.type === 'staff').length;
  const activeToday = workers.filter(w => w.present).length;
  const lowStockCount = materialsData.filter(m => m.low).length;
  
  const pendingPayoutTotal = workers
    .filter(w => w.status === 'Pending')
    .reduce((sum, w) => sum + (w.rateValue * w.baseDays), 0);
  
  const formatINR = (amt: number) => `₹${new Intl.NumberFormat('en-IN').format(amt)}`;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Header ─────────────────────────────────── */}
      <HeroHeader
        eyebrow="Site Intelligence"
        title="A calm financial brain for site operations."
        copy="Today's view — live stock, labour payouts and AI recommendations for Tower B and the Nashik Ring Road project."
      />

      {/* ─── 3-Card KPI row ──────────────────────────── */}
      {/* Card 1: Budget Used (full-width with progress bar) */}
      <MetricCard
        label="Budget Used"
        value="₹42,85,000"
        subNote="₹12,40,000 remaining • 26 days runway"
        note="of ₹55,25,000 total project budget"
        progress={BUDGET_PROGRESS}
      />

      {/* Cards 2 & 3: side-by-side */}
      <View style={styles.metricRow}>
        <MetricCard
          label="Weekly Payout"
          value={formatINR(pendingPayoutTotal)}
          note={`${workers.filter(w=>w.status==='Pending').length} workers pending`}
        />
        <MetricCard
          label="Active Workers"
          value={String(activeToday)}
          note={`${labourCount} labour + ${staffCount} staff total`}
        />
      </View>

      {/* ─── AI Live Insight ─────────────────────────── */}
      <AIInsightBanner
        onConfirmOrder={() =>
          showToast("Purchase order draft created for 500 cement bags.")
        }
        onDetails={() => setInvoiceOpen(true)}
      />

      {/* ─── Spending Analytics ──────────────────────── */}
      <Card>
        <View style={styles.sectionRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrowSmall}>Spending Analytics</Text>
            <Text style={styles.largeFraunces}>₹18,64,000</Text>
            <Text style={styles.cardSubcopy}>
              Last 30 days — payroll, steel, cement &amp; transport
            </Text>
          </View>
          <View>
            <LegendItem label="Actual" />
            <LegendItem outline label="Plan" />
          </View>
        </View>
        <SpendingChart />
      </Card>

      {/* ─── Flagged This Week (renamed Anomaly Feed) ── */}
      <Card>
        <View style={styles.sectionRow}>
          <Text style={styles.eyebrowSmall}>Flagged This Week</Text>
          <Pressable onPress={() => showToast("Opening full anomaly log.")}>
            <Text style={styles.linkText}>View All</Text>
          </Pressable>
        </View>
        <AnomalyCard
          title="Rebar usage increased 15% in Zone B"
          copy="Cutting waste jumped from 3.8% to 6.1%. Review logs before approving the next steel indent."
          tone="danger"
          time="12 min ago"
        />
        <AnomalyCard
          title="Worker payout cluster ready for Friday"
          copy="168 labour slips calculated. Estimated cash outflow: ₹6,19,200."
          tone="accent"
          time="43 min ago"
        />
        <AnomalyCard
          title="Two invoices waiting manual confirmation"
          copy="Sharma Steel and Nashik Concrete Supply totals match POs, but GST fields need review."
          tone="accent"
          time="1 hr ago"
          last
        />
      </Card>

      {/* ─── Quick Actions 2×2 icon grid ─────────────── */}
      <View style={styles.quickGrid}>
        <Pressable
          style={styles.quickCard}
          onPress={() => setInvoiceOpen(true)}
        >
          <View style={[styles.quickIcon, styles.quickIconAlt]}>
            <ReceiptIcon size={24} color={colors.text} />
          </View>
          <Text style={styles.quickTitle}>Invoice Scan</Text>
          <Text style={styles.quickSub}>Extract from PDF / image</Text>
        </Pressable>

        <Pressable
          style={styles.quickCard}
          onPress={() => showToast("Payroll batch queued for Friday disbursement.")}
        >
          <View style={[styles.quickIcon, styles.quickIconAccent]}>
            <UsersIcon size={24} color={colors.accent} />
          </View>
          <Text style={styles.quickTitle}>Run Payroll</Text>
          <Text style={styles.quickSub}>Process weekly worker payments</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    paddingBottom: 48,
    gap: 14,
  },

  /* KPI cards */
  metricRow: {
    flexDirection: "row",
    gap: 12,
  },

  /* Chart card */
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  largeFraunces: {
    color: colors.text,
    fontSize: 32,
    fontFamily: "Fraunces_300Light",
    fontWeight: "300",
    marginTop: 4,
    letterSpacing: -1.1,
  },
  eyebrowSmall: {
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 6,
    fontFamily: "DMSans_700Bold",
  },
  cardSubcopy: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
    fontFamily: "DMSans_400Regular",
  },
  linkText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },

  /* 2×2 Quick-Action Grid */
  quickGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 18,
    minHeight: 56,
    alignItems: "flex-start",
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(193,127,60,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  quickIconAlt: {
    backgroundColor: "rgba(42,33,24,0.06)",
  },
  quickIconAccent: {
    backgroundColor: "rgba(196,121,58,0.12)",
  },
  quickIconText: {
    fontSize: 22,
  },
  quickTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 4,
  },
  quickSub: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "DMSans_400Regular",
  },
});
