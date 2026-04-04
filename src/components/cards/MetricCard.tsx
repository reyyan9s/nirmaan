import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

interface MetricCardProps {
  label: string;
  value: string;
  note: string;
  /** If provided, renders a progress bar instead of the accent bottom stripe */
  progress?: number; // 0–1
  subNote?: string;
}

export function MetricCard({ label, value, note, progress, subNote }: MetricCardProps) {
  return (
    <View style={[styles.metricCard, progress !== undefined && styles.metricCardFull]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      {subNote ? (
        <Text style={styles.subNote}>{subNote}</Text>
      ) : null}
      <Text style={styles.metricNote}>{note}</Text>

      {progress !== undefined ? (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
        </View>
      ) : (
        <View style={styles.metricAccentBar} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 18,
    minHeight: 132,
    overflow: "hidden",
  },
  metricCardFull: {
    width: "100%",
    minHeight: 110,
  },
  metricLabel: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: colors.muted,
    fontWeight: "700",
    marginBottom: 10,
    fontFamily: "DMSans_700Bold",
  },
  metricValue: {
    color: colors.text,
    fontSize: 31,
    fontFamily: "Fraunces_300Light",
    fontWeight: "300",
    letterSpacing: -1.1,
  },
  subNote: {
    marginTop: 4,
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  metricNote: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "DMSans_400Regular",
  },
  progressTrack: {
    marginTop: 14,
    height: 5,
    borderRadius: 99,
    backgroundColor: colors.surfaceSoft,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
    backgroundColor: colors.accent,
  },
  metricAccentBar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 0,
    height: 3,
    backgroundColor: colors.accent,
    borderTopLeftRadius: 99,
    borderTopRightRadius: 99,
  },
});
