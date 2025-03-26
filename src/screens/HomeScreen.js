import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  exportAllMedicineLogs,
  exportWeeklyReports,
  exportSpecifiedWeekReports,
} from "../services/ExportService";
import { Buffer } from "buffer";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
  };

  const handleExport = async (type) => {
    try {
      let response;
      let filename;

      switch (type) {
        case "medicine":
          response = await exportAllMedicineLogs();
          filename = "medicine_logs.xlsx";
          break;
        case "weekly":
          response = await exportWeeklyReports();
          filename = "weekly_reports.xlsx";
          break;
        case "specified":
          response = await exportSpecifiedWeekReports();
          filename = "specified_week_reports.xlsx";
          break;
        default:
          return;
      }

      const base64Data = Buffer.from(response.data, "binary").toString("base64");
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Export Error:", error.message);
      Alert.alert(t("export_failed"), t("export_error_message"));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {user?.username ? `${t("welcome")}, ${user.username}!` : t("welcome")}
      </Text>

      <View style={styles.languageSection}>
        <Text style={styles.sectionLabel}>{t("choose_language")}</Text>
        <View style={styles.languageButtons}>
          <TouchableOpacity style={[styles.button, styles.langButton]} onPress={() => i18n.changeLanguage("tr")}>
            <Text style={styles.buttonText}>Türkçe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.langButton]} onPress={() => i18n.changeLanguage("en")}>
            <Text style={styles.buttonText}>English</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t("export_data")}</Text>

        <TouchableOpacity style={[styles.button, styles.exportButton]} onPress={() => handleExport("medicine")}>
          <Text style={styles.buttonText}>{t("export_medicine_logs")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.exportButton]} onPress={() => handleExport("weekly")}>
          <Text style={styles.buttonText}>{t("export_weekly_reports")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.exportButton]} onPress={() => handleExport("specified")}>
          <Text style={styles.buttonText}>{t("export_specified_week_reports")}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>{t("logout")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#FAF9F6",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  languageSection: {
    marginBottom: 30,
  },
  languageButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  langButton: {
    backgroundColor: "#007AFF",
    flex: 1,
  },
  exportButton: {
    backgroundColor: "#4CAF50",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
  },
});

export default HomeScreen;
