import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";

const { width } = Dimensions.get("window");

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Navigate to Main app
    navigation.navigate("Main");
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.topSection}>
        <Image 
          source={require("../../assets/logo.png")} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brandTitle}>Nirmaan</Text>
        <Text style={styles.brandSubtitle}>Site Operations & Finance Brain</Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login to Workspace</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Samarth Developers</Text>
        <Text style={styles.footerSubText}>Version 1.0.4 • Nashik, IN</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  topSection: {
    alignItems: "center",
    marginBottom: 50,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 32,
    fontFamily: "Fraunces_400Regular",
    color: colors.text,
    letterSpacing: -1,
  },
  brandSubtitle: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: colors.subtle,
    marginTop: 4,
  },
  formSection: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontFamily: "DMSans_700Bold",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    color: colors.text,
  },
  loginButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
  },
  forgotPassword: {
    marginTop: 20,
    alignItems: "center",
  },
  forgotText: {
    color: colors.accent,
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerText: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
  footerSubText: {
    color: colors.subtle,
    fontSize: 10,
    fontFamily: "DMSans_400Regular",
    marginTop: 2,
  },
});
