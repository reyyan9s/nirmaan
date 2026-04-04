import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

interface SlipCellProps {
  label: string;
  value: string;
}

export function SlipCell({ label, value }: SlipCellProps) {
  return (
    <View style={styles.slipCell}>
      <Text style={styles.slipLabel}>{label}</Text>
      <Text style={styles.slipValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slipCell: {
    flex: 1,
  },
  slipLabel: {
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: "DMSans_700Bold",
  },
  slipValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
});
