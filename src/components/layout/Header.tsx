import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, StatusBar, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";

interface HeaderProps {
  showBack?: boolean;
}

export function Header({ showBack }: HeaderProps) {
  const navigation = useNavigation<any>();
  const [hasAvatar, setHasAvatar] = useState(true);
  const avatarUri = "file:///Users/reyyansayyed/.gemini/antigravity/brain/4f10c40e-bda7-41a3-b115-90730dda2e44/profile_avatar_sakshi_1775324266646.png";

  return (
    <View style={styles.topBar}>
      <View style={styles.brandRow}>
        {/* Logo mark — brick-like icon built from view boxes */}
        <View style={styles.logoMark}>
          <View style={styles.logoRow}>
            <View style={[styles.logoBrick, { backgroundColor: colors.accent }]} />
            <View style={[styles.logoBrick, { backgroundColor: colors.accentSoft, width: 7 }]} />
          </View>
          <View style={styles.logoRow}>
            <View style={[styles.logoBrick, { backgroundColor: colors.accentSoft, width: 7 }]} />
            <View style={[styles.logoBrick, { backgroundColor: colors.accent }]} />
          </View>
        </View>
        <View>
          <Text style={styles.brandTitle}>Nirman</Text>
          <Text style={styles.brandSubtitle}>Samarth Developers • Nashik Ring Road</Text>
        </View>
      </View>
      <Pressable style={styles.avatar} onPress={() => navigation.navigate("Settings")}>
        {hasAvatar ? (
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatarImg}
            onError={() => setHasAvatar(false)}
          />
        ) : (
          <Text style={styles.avatarText}>SP</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 10 : 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
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
  // Custom brick-pattern logo mark
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceDeep,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    overflow: "hidden",
    padding: 6,
  },
  logoRow: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  logoBrick: {
    height: 5,
    width: 10,
    borderRadius: 2,
  },
  brandTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "300",
    fontFamily: "Fraunces_300Light",
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    color: colors.subtle,
    fontSize: 11,
    marginTop: 1,
    fontFamily: "DMSans_400Regular",
    letterSpacing: 0.1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceDeep,
    borderWidth: 2,
    borderColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
});
