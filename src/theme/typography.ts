import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const typography = StyleSheet.create({
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  eyebrowSmall: {
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  title1: {
    color: colors.text,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "300",
    fontFamily: "Fraunces_300Light",
    letterSpacing: -1.1,
  },
  title2: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 40,
    fontWeight: "300",
    fontFamily: "Fraunces_300Light",
  },
  title3: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "DMSans_400Regular",
  },
  bodySmall: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "DMSans_400Regular",
  },
  caption: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "DMSans_400Regular",
  },
  buttonTextPrimary: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    fontFamily: "DMSans_700Bold",
  },
  buttonTextGhost: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 14,
    fontFamily: "DMSans_700Bold",
  },
});
