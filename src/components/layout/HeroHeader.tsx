import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

interface HeroHeaderProps {
  eyebrow: string;
  title: string;
  copy: string;
}

export function HeroHeader({ eyebrow, title, copy }: HeroHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerEyebrow}>{eyebrow}</Text>
      <Text style={styles.headerTitle} numberOfLines={3} adjustsFontSizeToFit>{title}</Text>
      {copy ? <Text style={styles.headerCopy}>{copy}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 12,
  },
  headerEyebrow: {
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 10,
    fontFamily: "DMSans_700Bold",
  },
  headerTitle: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "300",
    fontFamily: "Fraunces_300Light",
    letterSpacing: -0.8,
  },
  headerCopy: {
    color: colors.muted,
    marginTop: 10,
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "DMSans_400Regular",
  },
});
