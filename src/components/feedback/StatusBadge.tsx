import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

interface StatusBadgeProps {
  status: "Paid" | "Pending";
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const isPaid = status === "Paid";
  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: isPaid ? "rgba(74,103,65,0.08)" : "rgba(193,127,60,0.08)" },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: isPaid ? colors.success : colors.accent }]} />
      <Text style={{ color: isPaid ? colors.success : colors.accent, fontSize: 11, fontWeight: "700", fontFamily: "DMSans_700Bold" }}>
        {label ?? status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
