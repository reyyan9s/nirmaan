import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../../theme/colors";

export function LegendItem({
  color,
  label,
  outline,
}: {
  color?: string;
  label: string;
  outline?: boolean;
}) {
  return (
    <View style={styles.legendRow}>
      <View
        style={[
          styles.legendDot,
          outline
            ? styles.legendOutline
            : { backgroundColor: color ?? colors.accent },
        ]}
      />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

// Chart data points: percentage positions within a 160-height area
const DATA_POINTS = [
  { xPct: 3,  yPct: 74, label: "29 Mar", value: "₹180k" },
  { xPct: 17, yPct: 68, label: "1 Apr",  value: "₹210k" },
  { xPct: 31, yPct: 62, label: "3 Apr",  value: "₹240k" },
  { xPct: 46, yPct: 34, label: "5 Apr",  value: "₹380k" },
  { xPct: 60, yPct: 14, label: "8 Apr",  value: "₹490k" },
  { xPct: 74, yPct: 22, label: "10 Apr", value: "₹440k" },
  { xPct: 88, yPct: 52, label: "12 Apr", value: "₹280k" },
];

const CHART_HEIGHT = 160;
const Y_AXIS_WIDTH = 38;

// Y-axis tick labels (₹ in thousands, top → bottom = max → 0)
const Y_TICKS = ["500", "375", "250", "125", "0"];

export function SpendingChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <View style={styles.wrapper}>
      {/* Y-axis label */}
      <View style={styles.yLabelWrap}>
        <Text style={styles.yAxisLabel}>₹ in thousands</Text>
      </View>

      <View style={styles.chartOuter}>
        {/* Y-axis ticks */}
        <View style={[styles.yAxis, { width: Y_AXIS_WIDTH }]}>
          {Y_TICKS.map((tick) => (
            <Text key={tick} style={styles.yTick}>
              {tick}
            </Text>
          ))}
        </View>

        {/* Chart area */}
        <View style={styles.chartArea}>
          {/* Horizontal grid lines */}
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[styles.gridLine, { top: (i / 4) * CHART_HEIGHT }]}
            />
          ))}

          {/* Plan baseline dashed line */}
          <View style={styles.planLine} />

          {/* Line segments */}
          <View style={styles.chartPathWrap}>
            <View style={styles.segOne} />
            <View style={styles.segTwo} />
            <View style={styles.segThree} />
            <View style={styles.segFour} />
            <View style={styles.segFive} />
            <View style={styles.segSix} />

            {/* Tappable data points */}
            {DATA_POINTS.map((pt, i) => (
              <Pressable
                key={i}
                style={[
                  styles.dotHitArea,
                  {
                    left: `${pt.xPct}%` as any,
                    top: `${pt.yPct}%` as any,
                  },
                ]}
                onPress={() => setActiveIndex(activeIndex === i ? null : i)}
              >
                <View
                  style={[
                    styles.dot,
                    activeIndex === i && styles.dotActive,
                  ]}
                />
                {activeIndex === i && (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipDate}>{pt.label}</Text>
                    <Text style={styles.tooltipValue}>{pt.value}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* X-axis date labels — pinned to actual data points */}
      <View style={[styles.xLabelRow, { marginLeft: Y_AXIS_WIDTH }]}>
        {["29 Mar", "1 Apr", "5 Apr", "8 Apr", "12 Apr"].map((label) => (
          <Text key={label} style={styles.xLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 18,
  },
  yLabelWrap: {
    alignItems: "flex-start",
    marginLeft: 0,
    marginBottom: 4,
  },
  yAxisLabel: {
    color: colors.muted,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "DMSans_700Bold",
    fontWeight: "700",
    transform: [{ rotate: "0deg" }],
  },
  chartOuter: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  yAxis: {
    height: CHART_HEIGHT,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 6,
    paddingTop: 2,
    paddingBottom: 2,
  },
  yTick: {
    color: colors.muted,
    fontSize: 9,
    fontFamily: "DMSans_700Bold",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  chartArea: {
    flex: 1,
    height: CHART_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.surfaceSoft,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(227,221,211,0.8)",
  },
  planLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: CHART_HEIGHT * 0.5,
    borderWidth: 1,
    borderColor: "rgba(42,33,24,0.15)",
    borderStyle: "dashed",
  },
  chartPathWrap: {
    flex: 1,
    position: "relative",
  },
  // Line segments connecting the data points
  segOne: {
    position: "absolute",
    left: "4%",
    top: "71%",
    width: "16%",
    borderTopWidth: 3,
    borderColor: colors.accent,
    transform: [{ rotate: "-4deg" }],
  },
  segTwo: {
    position: "absolute",
    left: "18%",
    top: "63%",
    width: "15%",
    borderTopWidth: 3,
    borderColor: colors.accent,
    transform: [{ rotate: "-5deg" }],
  },
  segThree: {
    position: "absolute",
    left: "32%",
    top: "52%",
    width: "16%",
    borderTopWidth: 3,
    borderColor: colors.accent,
    transform: [{ rotate: "-22deg" }],
  },
  segFour: {
    position: "absolute",
    left: "47%",
    top: "24%",
    width: "16%",
    borderTopWidth: 3,
    borderColor: colors.accent,
    transform: [{ rotate: "-12deg" }],
  },
  segFive: {
    position: "absolute",
    left: "61%",
    top: "17%",
    width: "15%",
    borderTopWidth: 3,
    borderColor: colors.accent,
    transform: [{ rotate: "8deg" }],
  },
  segSix: {
    position: "absolute",
    left: "75%",
    top: "34%",
    width: "16%",
    borderTopWidth: 3,
    borderColor: colors.accent,
    transform: [{ rotate: "-22deg" }],
  },
  dotHitArea: {
    position: "absolute",
    width: 28,
    height: 28,
    marginLeft: -14,
    marginTop: -14,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.surface,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  dotActive: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 3,
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  tooltip: {
    position: "absolute",
    bottom: 26,
    left: "50%",
    transform: [{ translateX: -34 }],
    backgroundColor: colors.text,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    minWidth: 68,
    alignItems: "center",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  tooltipDate: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 9,
    fontFamily: "DMSans_700Bold",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  tooltipValue: {
    color: "#F0C878",
    fontSize: 13,
    fontFamily: "DMSans_700Bold",
    fontWeight: "700",
    marginTop: 1,
  },
  xLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  xLabel: {
    color: colors.muted,
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },
  legendOutline: {
    borderWidth: 1,
    borderColor: "rgba(42,33,24,0.35)",
    backgroundColor: "transparent",
  },
  legendText: {
    color: colors.muted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
});
