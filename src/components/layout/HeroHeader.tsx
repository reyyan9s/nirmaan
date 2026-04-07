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
      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowDot} />
        <Text style={styles.headerEyebrow}>{eyebrow}</Text>
      </View>
      <Text style={styles.headerTitle} numberOfLines={3} adjustsFontSizeToFit>
        {title}
      </Text>
      {copy ? <Text style={styles.headerCopy}>{copy}</Text> : null}
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  headerEyebrow: {
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 2.8,
    textTransform: "uppercase",
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  headerTitle: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "300",
    fontFamily: "Fraunces_300Light",
    letterSpacing: -0.8,
  },
  headerCopy: {
    color: colors.muted,
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "DMSans_400Regular",
  },
  divider: {
    marginTop: 18,
    height: 1,
    backgroundColor: colors.border,
    borderRadius: 1,
  },
});
