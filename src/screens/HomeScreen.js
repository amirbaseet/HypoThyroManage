import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
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
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>
          {user?.username ? `${t("welcome")}, ${user.username}! 👋` : t("welcome")}
        </Text>

        <View style={styles.card}>
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

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{t("export_data")}</Text>

          <TouchableOpacity style={[styles.button, styles.exportButton]} onPress={() => handleExport("medicine")}>
            <Text style={styles.buttonText}>{t("export_medicine_logs")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.exportButton]} onPress={() => handleExport("weekly")}>
            <Text style={styles.buttonText}>{t("export_weekly_reports")}</Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>{t("logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#FAF9F6",
    paddingTop: 20,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#444444",
    marginBottom: 25,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFF5E6",
    padding: 20,
    borderRadius: 15,
    borderColor: "#FFD59E",
    borderWidth: 1.5,
    marginBottom: 25,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 15,
    textAlign: "center",
  },
  languageButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  langButton: {
    backgroundColor: "#4DA8DA",
    flex: 0.45,
  },
  exportButton: {
    backgroundColor: "#6AB04C",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    marginTop: 15,
  },
});

export default HomeScreen;
