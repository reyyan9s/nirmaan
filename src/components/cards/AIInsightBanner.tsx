import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { ActionButton } from "../buttons/ActionButton";
import { SparklesIcon } from "../Icons";

interface AIInsightBannerProps {
  onConfirmOrder: () => void;
  onDetails: () => void;
}

export function AIInsightBanner({ onConfirmOrder, onDetails }: AIInsightBannerProps) {
  return (
    <View style={styles.heroBanner}>
      <View style={styles.heroTopRow}>
        <SparklesIcon size={16} color="rgba(242, 222, 200, 0.9)" />
        <Text style={styles.heroLabel}>NIRMAN INTELLIGENCE</Text>
      </View>
      <Text style={styles.heroText}>
        Cement supply at <Text style={styles.heroAccent}>Tower B</Text> will run out in{" "}
        <Text style={styles.heroAccent}>2 days</Text>. I recommend reordering{" "}
        <Text style={styles.heroAccent}>500 bags</Text> from Nashik Concrete Supply.
      </Text>
      <View style={styles.heroMetaBox}>
        <Text style={styles.heroMetaText}>
          Current stock: 185 bags
        </Text>
        <Text style={styles.heroMetaDivider}>•</Text>
        <Text style={styles.heroMetaText}>
          Daily usage: 92 bags
        </Text>
        <Text style={styles.heroMetaDivider}>•</Text>
        <Text style={styles.heroMetaText}>
          Price impact: ₹1,92,500
        </Text>
      </View>
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
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  heroLabel: {
    color: "rgba(242, 222, 200, 0.7)",
    fontSize: 10,
    letterSpacing: 2.8,
    textTransform: "uppercase",
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  heroText: {
    color: "#F6EDE1",
    fontSize: 26,
    lineHeight: 38,
    fontWeight: "300",
    fontFamily: "Fraunces_300Light",
    letterSpacing: -0.5,
  },
  heroAccent: {
    color: colors.accentSoft,
    fontWeight: "400",
  },
  heroMetaBox: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 18,
    gap: 8,
  },
  heroMetaText: {
    color: "rgba(246,237,225,0.8)",
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  heroMetaDivider: {
    color: "rgba(246,237,225,0.3)",
    fontSize: 12,
  },
  heroActionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    flexWrap: "wrap",
  },
});
