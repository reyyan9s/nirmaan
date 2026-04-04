import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../../theme/colors";
import { ActionButton } from "../buttons/ActionButton";

interface AIInsightBannerProps {
  onConfirmOrder: () => void;
  onDetails: () => void;
}

export function AIInsightBanner({ onConfirmOrder, onDetails }: AIInsightBannerProps) {
  return (
    <View style={styles.heroBanner}>
      <Text style={styles.heroLabel}>AI LIVE INSIGHT</Text>
      <Text style={styles.heroText}>
        Cement supply at <Text style={styles.heroAccent}>Tower B</Text> will run out in{" "}
        <Text style={styles.heroAccent}>2 days</Text>. I recommend reordering{" "}
        <Text style={styles.heroAccent}>500 bags</Text> from Nashik Concrete Supply.
      </Text>
      <Text style={styles.heroMeta}>
        Current stock: 185 bags • Daily usage: 92 bags • Price impact: ₹1,92,500
      </Text>
      <View style={styles.heroActionRow}>
        <ActionButton label="Confirm Order" variant="primary" onPress={onConfirmOrder} />
        <ActionButton label="Details" variant="ghost" onPress={onDetails} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroBanner: {
    backgroundColor: colors.heroA,
    borderRadius: 24,
    padding: 24,
    marginTop: 6,
  },
  heroLabel: {
    color: "rgba(246,237,225,0.7)",
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 18,
    fontFamily: "DMSans_700Bold",
  },
  heroText: {
    color: "#F6EDE1",
    fontSize: 28,
    lineHeight: 40,
    fontWeight: "300",
    fontFamily: "Fraunces_300Light",
  },
  heroAccent: {
    color: "#F0C878",
  },
  heroMeta: {
    color: "rgba(246,237,225,0.74)",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 16,
    fontFamily: "DMSans_400Regular",
  },
  heroActionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
    flexWrap: "wrap",
  },
});
