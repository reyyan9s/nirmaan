import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors } from "../../theme/colors";
import { HomeIcon, UsersIcon, PackageIcon, SparklesIcon, SettingsIcon } from "../Icons";

const TAB_MAPPING: Record<string, { label: string; Icon: React.FC<any> }> = {
  Dashboard: { label: "Home", Icon: HomeIcon },
  Workers: { label: "Workers", Icon: UsersIcon },
  Inventory: { label: "Inventory", Icon: PackageIcon },
  AI: { label: "AI", Icon: SparklesIcon },
  Settings: { label: "Settings", Icon: SettingsIcon },
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const mapping = TAB_MAPPING[route.name] || { label: route.name, Icon: HomeIcon };

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const IconComponent = mapping.Icon;

        return (
          <Pressable key={route.key} style={styles.tabItem} onPress={onPress}>
            <View style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
               <IconComponent size={20} color={isFocused ? colors.accent : colors.muted} />
            </View>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {mapping.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(250,247,242,0.98)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    justifyContent: "space-between",
  },
  tabItem: {
    alignItems: "center",
    gap: 6,
  },
  tabIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconActive: {
    backgroundColor: "rgba(193,127,60,0.12)",
  },
  tabLabel: {
    fontSize: 10,
    color: colors.muted,
    fontFamily: "DMSans_500Medium",
  },
  tabLabelActive: {
    color: colors.accent,
    fontWeight: "700",
  },
});
