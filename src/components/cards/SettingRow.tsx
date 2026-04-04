import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { ChevronRightIcon } from "../Icons";

interface SettingRowProps {
  title: string;
  meta: string;
  copy: string;
  last?: boolean;
}

export function SettingRow({ title, meta, copy, last }: SettingRowProps) {
  return (
    <View style={[styles.settingRow, !last && styles.divider]}>
      <View style={styles.sectionRow}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.eyebrowSmall}>{title}</Text>
          <Text style={styles.title}>{meta}</Text>
        </View>
        <ChevronRightIcon size={20} color={colors.muted} style={{ marginTop: 12 }} />
      </View>
      <Text style={styles.cardSubcopy}>{copy}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    paddingVertical: 18,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eyebrowSmall: {
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 8,
    fontFamily: "DMSans_700Bold",
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  cardSubcopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
    fontFamily: "DMSans_400Regular",
  },
});
