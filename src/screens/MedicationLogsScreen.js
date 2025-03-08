import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { fetchMedicationLogs } from "../database/database";

export default function MedicationLogsScreen() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      const fetchedLogs = await fetchMedicationLogs();
      setLogs(fetchedLogs);
      setLoading(false);
    }
    loadLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medication Logs</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : logs.length === 0 ? (
        <Text style={styles.emptyText}>No medication logs found.</Text>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.logCard}>
              <Text style={styles.logText}>
                <Text style={styles.boldText}>Medication ID:</Text> {item.medication_id}
              </Text>
              <Text style={styles.logText}>
                <Text style={styles.boldText}>Timestamp:</Text> {item.timestamp}
              </Text>
              <Text style={[styles.logText, styles.status(item.status)]}>
                <Text style={styles.boldText}>Status:</Text> {item.status}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  logCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  logText: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  status: (status) => ({
    color: status === "Taken" ? "green" : status === "Skipped" ? "orange" : "red",
  }),
});

