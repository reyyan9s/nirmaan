import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { colors } from "../../theme/colors";
import { Worker } from "../../data/mockData";
import { StatusBadge } from "../feedback/StatusBadge";
import { SlipCell } from "./PaymentSlipCard";

interface WorkerCardProps {
  worker: Worker;
  isLast?: boolean;
  onToggle: (id: string) => void;
  formatINR: (amount: number) => string;
}

export function WorkerCard({ worker, isLast, onToggle, formatINR }: WorkerCardProps) {
  const daysWorked = worker.present ? worker.baseDays : Math.max(worker.baseDays - 1, 0);
  const total = daysWorked * worker.rateValue;

  return (
    <View style={[styles.workerCard, !isLast && styles.workerDivider]}>
      {/* Name + Slip Status badge */}
      <View style={styles.sectionRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.workerName}>{worker.name}</Text>
          <Text style={styles.workerMeta}>
            {worker.role} • {worker.rateLabel} • {worker.location}
          </Text>
        </View>
        <StatusBadge status={worker.status} />
      </View>

      {/* Attendance toggle — explicit Present / Absent label */}
      <View style={[styles.switchRow, worker.present ? styles.switchRowPresent : styles.switchRowAbsent]}>
        <View style={styles.switchLabelGroup}>
          <Text style={styles.switchTitle}>Attendance today</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: worker.present ? colors.success : colors.danger,
              }}
            />
            <Text
              style={[
                styles.attendanceLabel,
                { color: worker.present ? colors.success : colors.danger },
              ]}
            >
              {worker.present ? "Present" : "Absent"}
            </Text>
          </View>
        </View>
        <Switch
          value={worker.present}
          onValueChange={() => onToggle(worker.id)}
          trackColor={{ false: "rgba(184,92,74,0.25)", true: "rgba(74,103,65,0.35)" }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="rgba(184,92,74,0.25)"
        />
      </View>

      {/* Slip grid */}
      <View style={styles.slipGrid}>
        <SlipCell label="Days Worked" value={String(daysWorked)} />
        <SlipCell label="Total Amount" value={formatINR(total)} />
        <SlipCell label="Slip Status" value={worker.status} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  workerCard: {
    paddingVertical: 18,
  },
  workerDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  workerName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: "DMSans_700Bold",
  },
  workerMeta: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "DMSans_400Regular",
  },

  /* Attendance toggle row */
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  switchRowPresent: {
    backgroundColor: "rgba(74,103,65,0.07)",
  },
  switchRowAbsent: {
    backgroundColor: "rgba(184,92,74,0.06)",
  },
  switchLabelGroup: {
    gap: 3,
  },
  switchTitle: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: "DMSans_700Bold",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  attendanceLabel: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },

  /* Slip grid */
  slipGrid: {
    flexDirection: "row",
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
});
