import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, StatusBar, Image } from "react-native";
import { colors } from "../../theme/colors";
import { SparklesIcon } from "../Icons";

interface HeaderProps {
  showBack?: boolean;
}

export function Header({ showBack }: HeaderProps) {
  const [hasAvatar, setHasAvatar] = useState(true);
  const avatarUri = "file:///Users/reyyansayyed/.gemini/antigravity/brain/4f10c40e-bda7-41a3-b115-90730dda2e44/profile_avatar_sakshi_1775324266646.png";

  return (
    <View style={styles.topBar}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <SparklesIcon size={18} color={colors.accent} strokeWidth={2.5} />
        </View>
        <View>
          <Text style={styles.brandTitle}>SiteMind AI</Text>
          <Text style={styles.brandSubtitle}>Samarth Developers • Nashik Ring Road</Text>
        </View>
      </View>
      <View style={styles.avatar}>
        {hasAvatar ? (
          <Image 
            source={{ uri: avatarUri }} 
            style={styles.avatarImg} 
            onError={() => setHasAvatar(false)}
          />
        ) : (
          <Text style={styles.avatarText}>SP</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 10 : 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "rgba(250,247,242,0.98)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12, // More industrial/modern than circle
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(193,127,60,0.08)",
    borderWidth: 1,
    borderColor: "rgba(193,127,60,0.12)",
  },
  brandTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "300",
    fontFamily: "Fraunces_300Light",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 0,
    fontFamily: "DMSans_400Regular",
    letterSpacing: 0.2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EDE4D6",
    borderWidth: 1.5,
    borderColor: "#FFFFFF", // White border for contrast
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
});
