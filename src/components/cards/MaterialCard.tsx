import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { Material } from "../../types";
import { Card } from "./Card";
import { InfoPill } from "../feedback/InfoPill";
import { MiniBarChart } from "./MiniBarChart";

interface MaterialCardProps {
  material: Material;
}

export function MaterialCard({ material }: MaterialCardProps) {
  return (
    <Card style={material.low ? styles.lowCard : undefined}>
      <View style={styles.sectionRow}>
        <View>
          <Text style={[styles.eyebrowSmall, material.low && { color: colors.danger }]}>
            {material.category}
          </Text>
          <Text style={styles.materialTitle}>{material.title}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.materialStock, material.low && { color: colors.danger }]}>
            {material.stock}
          </Text>
          <Text style={styles.cardSubcopy}>Updated 18 min ago</Text>
        </View>
      </View>
      <View style={{ alignSelf: "flex-start", marginTop: 8 }}>
        <InfoPill label={material.usage} tone={material.low ? "danger" : "neutral"} />
      </View>
      <MiniBarChart
        values={material.bars}
        danger={material.low}
        unit={material.unit}
        reorderThreshold={material.reorderThreshold}
        yMin={material.yMin}
        yMax={material.yMax}
      />
      <Text style={styles.cardSubcopy}>{material.note}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  lowCard: {
    borderColor: "rgba(184,92,74,0.3)",
    backgroundColor: "rgba(184,92,74,0.02)",
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
  materialTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  materialStock: {
    color: colors.text,
    fontSize: 22,
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
