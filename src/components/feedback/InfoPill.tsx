import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

interface InfoPillProps {
  label: string;
  tone?: "neutral" | "danger";
}

export function InfoPill({ label, tone = "neutral" }: InfoPillProps) {
  return (
    <View
      style={[
        styles.infoPill,
        tone === "danger" && { backgroundColor: "rgba(184,92,74,0.10)" },
      ]}
    >
      <Text style={[styles.infoPillText, tone === "danger" && { color: colors.danger }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoPill: {
    backgroundColor: "rgba(42,33,24,0.06)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  infoPillText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
});
