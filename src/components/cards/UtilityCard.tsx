import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../../theme/colors";

interface UtilityCardProps {
  title: string;
  copy: string;
  action?: string;
  onPress?: () => void;
}

export function UtilityCard({ title, copy, action, onPress }: UtilityCardProps) {
  return (
    <View style={styles.utilityCard}>
      <Text style={styles.utilityTitle}>{title}</Text>
      <Text style={styles.utilityCopy}>{copy}</Text>
      {action ? (
        <Pressable onPress={onPress} style={styles.utilityAction}>
          <Text style={styles.utilityActionText}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  utilityCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    minHeight: 160,
  },
  utilityTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    fontFamily: "DMSans_700Bold",
  },
  utilityCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "DMSans_400Regular",
  },
  utilityAction: {
    marginTop: 14,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  utilityActionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
});
