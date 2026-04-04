import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

interface SummaryBoxProps {
  label: string;
  value: string;
}

export function SummaryBox({ label, value }: SummaryBoxProps) {
  return (
    <View style={styles.summaryBox}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryBox: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    padding: 16,
    flex: 1,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 6,
    fontFamily: "DMSans_700Bold",
  },
  summaryValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
});
