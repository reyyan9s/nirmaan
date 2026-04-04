import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

interface ModalRowProps {
  label: string;
  value: string;
}

export function ModalRow({ label, value }: ModalRowProps) {
  return (
    <View style={styles.modalRow}>
      <Text style={styles.cardSubcopy}>{label}</Text>
      <Text style={styles.modalValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardSubcopy: {
    color: colors.muted,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  modalValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
});
