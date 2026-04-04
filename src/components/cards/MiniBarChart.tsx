import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

// Last 7 days labels — short (day + first letter of weekday)
const DAY_LABELS = ["29M", "30T", "31W", "1T", "2F", "3S", "4S"];

const CHART_HEIGHT = 100;
const BAR_AREA_HEIGHT = CHART_HEIGHT; // bars live inside this
const Y_AXIS_WIDTH = 36;
const REORDER_COLOR = "#B85C4A";

interface MiniBarChartProps {
  values: number[];        // 7 values, 0–100 scale
  danger?: boolean;
  unit: string;            // "bags" | "tons" | "units (×1k)"
  reorderThreshold: number; // 0–100 scale position for the dashed line
  yMin: number;            // real-world value shown at bottom of Y axis
  yMax: number;            // real-world value shown at top of Y axis
}

export function MiniBarChart({
  values,
  danger,
  unit,
  reorderThreshold,
  yMin,
  yMax,
}: MiniBarChartProps) {
  const maxVal = Math.max(...values, 1);

  // The reorder line's top offset within BAR_AREA_HEIGHT
  // reorderThreshold is 0–100 scale, where 100 = chart top (highest bar)
  // We map it such that 100 = top (0px from top), 0 = bottom (CHART_HEIGHT from top)
  const reorderTop = BAR_AREA_HEIGHT * (1 - reorderThreshold / 100);

  return (
    <View style={styles.wrapper}>
      {/* Y-axis */}
      <View style={[styles.yAxis, { width: Y_AXIS_WIDTH }]}>
        <Text style={styles.yTick}>{yMax}</Text>
        <Text style={styles.yUnit}>{unit}</Text>
        <Text style={styles.yTick}>{yMin}</Text>
      </View>

      {/* Bar chart + reorder line */}
      <View style={styles.chartBody}>
        <View style={[styles.barArea, { height: BAR_AREA_HEIGHT }]}>
          {/* Reorder threshold line */}
          <View
            style={[
              styles.reorderLine,
              { top: reorderTop },
            ]}
          >
            <View style={styles.reorderDash} />
            <Text style={styles.reorderLabel}>Reorder</Text>
          </View>

          {/* Bars */}
          <View style={styles.barsRow}>
            {values.map((value, index) => {
              const barHeight = Math.max((value / 100) * BAR_AREA_HEIGHT, 4);
              const isLatest = index === values.length - 1;
              const isBelowReorder = value < reorderThreshold;

              const barColor = isBelowReorder
                ? "rgba(184,92,74,0.65)"
                : isLatest
                ? danger
                  ? "rgba(184,92,74,0.55)"
                  : colors.accent
                : danger
                ? "rgba(184,92,74,0.25)"
                : "rgba(193,127,60,0.32)";

              return (
                <View key={index} style={styles.barColumn}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: barColor,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* X-axis labels */}
        <View style={styles.xAxis}>
          {DAY_LABELS.map((label) => (
            <View key={label} style={styles.xLabelCell}>
              <Text style={styles.xLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    marginTop: 18,
    marginBottom: 6,
  },

  // Y-axis column
  yAxis: {
    height: BAR_AREA_HEIGHT + 20, // +20 for x-axis below
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 6,
    paddingBottom: 20, // aligns with x-axis height
    paddingTop: 2,
  },
  yTick: {
    color: colors.muted,
    fontSize: 9,
    fontFamily: "DMSans_700Bold",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  yUnit: {
    color: colors.accent,
    fontSize: 8,
    fontFamily: "DMSans_700Bold",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "right",
  },

  // Chart body (bars + x-axis)
  chartBody: {
    flex: 1,
  },
  barArea: {
    position: "relative",
    backgroundColor: colors.surfaceSoft,
    borderRadius: 10,
    overflow: "hidden",
  },

  // Reorder threshold line
  reorderLine: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 5,
  },
  reorderDash: {
    flex: 1,
    borderTopWidth: 1.5,
    borderColor: REORDER_COLOR,
    borderStyle: "dashed",
  },
  reorderLabel: {
    color: REORDER_COLOR,
    fontSize: 8,
    fontFamily: "DMSans_700Bold",
    fontWeight: "700",
    paddingHorizontal: 4,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  // Bars
  barsRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 4,
    gap: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
  },

  // X-axis
  xAxis: {
    flexDirection: "row",
    marginTop: 5,
  },
  xLabelCell: {
    flex: 1,
    alignItems: "center",
  },
  xLabel: {
    color: colors.muted,
    fontSize: 9,
    fontFamily: "DMSans_700Bold",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
