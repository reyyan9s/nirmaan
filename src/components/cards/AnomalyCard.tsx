import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { AlertCircleIcon, CircleIcon } from "../Icons";

interface AnomalyCardProps {
  title: string;
  copy: string;
  time: string;
  tone: "danger" | "accent";
  last?: boolean;
  category?: {
    label: string;
    tone: "success" | "danger";
  };
}

export function AnomalyCard({ title, copy, time, tone, last, category }: AnomalyCardProps) {
  return (
    <View style={[styles.feedItem, !last && styles.feedDivider]}>
      <View
        style={[
          styles.feedIcon,
          { backgroundColor: tone === "danger" ? "rgba(184,92,74,0.10)" : colors.surfaceSoft },
        ]}
      >
        {tone === "danger" ? (
          <AlertCircleIcon size={18} color={colors.danger} />
        ) : (
          <CircleIcon size={8} color={colors.accent} strokeWidth={4} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.sectionRow}>
          <Text style={styles.feedTitle}>{title}</Text>
          <Text style={styles.feedTime}>{time}</Text>
        </View>
        <Text style={styles.feedCopy}>{copy}</Text>
        {category && (
          <View style={[styles.categoryPill, category.tone === "success" ? styles.pillSuccess : styles.pillDanger]}>
            <View style={[styles.pillDot, { backgroundColor: category.tone === "success" ? colors.success : colors.danger }]} />
            <Text style={[styles.categoryPillText, category.tone === "success" ? styles.pillTextSuccess : styles.pillTextDanger]}>
              {category.label}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  feedItem: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 16,
  },
  feedDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(227,221,211,0.7)",
  },
  feedIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  feedTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    fontFamily: "DMSans_700Bold",
  },
  feedCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
    fontFamily: "DMSans_400Regular",
  },
  feedTime: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 10,
    fontFamily: "DMSans_700Bold",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingLeft: 7,
    paddingRight: 10,
    paddingVertical: 5,
    borderRadius: 7,
    marginTop: 10,
    borderWidth: 1,
    gap: 6,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  pillSuccess: {
    backgroundColor: "rgba(74,103,65,0.1)",
    borderColor: "rgba(74,103,65,0.2)",
  },
  pillDanger: {
    backgroundColor: "rgba(184,92,74,0.1)",
    borderColor: "rgba(184,92,74,0.2)",
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  pillTextSuccess: {
    color: colors.success,
  },
  pillTextDanger: {
    color: colors.danger,
  },
});
