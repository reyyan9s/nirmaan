import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "ghost";
}

export function ActionButton({
  label,
  onPress,
  variant = "primary",
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.actionButton, variant === "ghost" ? styles.ghostButton : styles.primaryButton]}
    >
      <Text style={variant === "ghost" ? styles.ghostButtonText : styles.primaryButtonText}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    minHeight: 46,
    borderRadius: 999,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: colors.accent,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    fontFamily: "DMSans_700Bold",
  },
  ghostButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
  },
  ghostButtonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 14,
    fontFamily: "DMSans_700Bold",
  },
});
