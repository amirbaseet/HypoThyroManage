import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {user?.username ? `${t("welcome")}, ${user.username}! ` : t("welcome")}
      </Text>

      <View style={styles.languageButtons}>
        <TouchableOpacity
          style={styles.langButton}
          onPress={() => i18n.changeLanguage("tr")}
        >
          <Text style={styles.langText}>Türkçe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.langButton}
          onPress={() => i18n.changeLanguage("en")}
        >
          <Text style={styles.langText}>English</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t("logout")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  languageButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  langButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  langText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default HomeScreen;
