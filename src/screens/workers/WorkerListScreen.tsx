import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { HeroHeader } from "../../components/layout/HeroHeader";
import { Card } from "../../components/cards/Card";
import { WorkerCard } from "../../components/cards/WorkerCard";
import { colors } from "../../theme/colors";
import { useAppContext } from "../../context/AppContext";
import { SearchIcon, HardHatIcon, XIcon } from "../../components/Icons";

type TypeFilter = "labour" | "staff";
type SlipFilter = "all" | "pending" | "paid";

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export function WorkerListScreen() {
  const { workers, toggleWorker, payrollFilter, setPayrollFilter } = useAppContext();

  const [query, setQuery] = useState("");
  const [slipFilter, setSlipFilter] = useState<SlipFilter>("all");

  // Step 1 — type filter (Labour / Staff) driven by existing payrollFilter context
  const typeFiltered = useMemo(() => {
    if (payrollFilter === "pending") return workers; // "pending" shows all types
    return workers.filter((w) => w.type === payrollFilter);
  }, [workers, payrollFilter]);

  // Step 2 — slip status filter (All / Pending / Paid)
  const slipFiltered = useMemo(() => {
    if (slipFilter === "all") return typeFiltered;
    const target = slipFilter === "pending" ? "Pending" : "Paid";
    return typeFiltered.filter((w) => w.status === target);
  }, [typeFiltered, slipFilter]);

  // Step 3 — search filter (name or role)
  const displayWorkers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return slipFiltered;
    return slipFiltered.filter(
      (w) =>
        w.name.toLowerCase().includes(q) || w.role.toLowerCase().includes(q)
    );
  }, [slipFiltered, query]);

  // Sticky summary — computed from the full type-filtered set (not search-narrowed)
  const stickyStats = useMemo(() => {
    const presentCount = typeFiltered.filter((w) => w.present).length;
    const pendingTotal = typeFiltered
      .filter((w) => w.status === "Pending")
      .reduce((sum, w) => {
        const days = w.present ? w.baseDays : Math.max(w.baseDays - 1, 0);
        return sum + days * w.rateValue;
      }, 0);
    return { presentCount, pendingTotal };
  }, [typeFiltered]);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <HeroHeader
        eyebrow="Payroll"
        title="Weekly wages, attendance and payment slips."
        copy="Labour workers paid weekly, staff paid monthly — with clear slip status for accounts and supervisors."
      />

      {/* ── Type tabs: Labour / Staff ──────────────── */}
      <View style={styles.typePills}>
        {(["labour", "staff"] as const).map((t) => {
          const active = payrollFilter === t || (payrollFilter === "pending" && t === "labour");
          return (
            <Pressable
              key={t}
              style={[styles.typePill, payrollFilter === t && styles.typePillActive]}
              onPress={() => setPayrollFilter(t)}
            >
              <Text style={[styles.typePillText, payrollFilter === t && styles.typePillTextActive]}>
                {t === "labour" ? "Labour Crew" : "Staff"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Sticky summary bar ────────────────────── */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryChip}>
          <View style={styles.statusDotFilled} />
          <Text style={styles.summaryText}>
            <Text style={styles.summaryHighlight}>{stickyStats.presentCount}</Text>
            {" Present today"}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryChip}>
          <Text style={styles.summaryText}>
            <Text style={styles.summaryHighlight}>{formatINR(stickyStats.pendingTotal)}</Text>
            {" pending release"}
          </Text>
        </View>
      </View>

      {/* ── Search bar ────────────────────────────── */}
      <View style={styles.searchWrapper}>
        <SearchIcon size={18} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or role..."
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} style={styles.clearBtn}>
            <XIcon size={12} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {/* ── Slip status filter pills ──────────────── */}
      <View style={styles.slipPills}>
        {(["all", "pending", "paid"] as SlipFilter[]).map((f) => (
          <Pressable
            key={f}
            style={[styles.slipPill, slipFilter === f && styles.slipPillActive]}
            onPress={() => setSlipFilter(f)}
          >
            <Text style={[styles.slipPillText, slipFilter === f && styles.slipPillTextActive]}>
              {f === "all" ? "All" : f === "pending" ? "Pending" : "Paid"}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── Worker list ───────────────────────────── */}
      {displayWorkers.length > 0 ? (
        <Card>
          {displayWorkers.map((worker, index) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              isLast={index === displayWorkers.length - 1}
              onToggle={toggleWorker}
              formatINR={formatINR}
            />
          ))}
        </Card>
      ) : (
        <View style={styles.emptyState}>
          <HardHatIcon size={48} color={colors.muted} style={{ marginBottom: 14 }} />
          <Text style={styles.emptyTitle}>No workers found</Text>
          <Text style={styles.emptyBody}>
            {query
              ? `No results for "${query}". Try a different name or role.`
              : "No workers match the selected filter."}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    paddingBottom: 48,
    gap: 12,
  },

  /* ── Type pills (Labour / Staff) ── */
  typePills: {
    flexDirection: "row",
    gap: 8,
  },
  typePill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 99,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typePillActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  typePillText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  typePillTextActive: {
    color: "#FFFFFF",
  },

  /* ── Sticky summary bar ── */
  summaryBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 0,
  },
  summaryChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  summaryDot: {
    color: colors.success,
    fontSize: 10,
  },
  statusDotFilled: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  summaryText: {
    color: colors.muted,
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  summaryHighlight: {
    color: colors.text,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  summaryDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },

  /* ── Search bar ── */
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
  },
  searchIcon: {
    fontSize: 18,
    color: colors.muted,
    lineHeight: 22,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontFamily: "DMSans_400Regular",
    height: "100%",
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },

  /* ── Slip status pills (All / Pending / Paid) ── */
  slipPills: {
    flexDirection: "row",
    gap: 8,
  },
  slipPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slipPillActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  slipPillText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  slipPillTextActive: {
    color: "#FFFFFF",
  },

  /* ── Empty state ── */
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 14,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },
});
