import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

interface FilterPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function FilterPill({ label, active, onPress }: FilterPillProps) {
  return (
    <Pressable onPress={onPress} style={[styles.filterPill, active && styles.filterPillActive]}>
      <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  filterPillText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
  },
});
