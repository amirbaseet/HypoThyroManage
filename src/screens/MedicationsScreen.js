import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { fetchMedications, insertMedication } from "../database/database";

export default function MedicationsScreen() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Form States for New Medication
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadMedications();
  }, []);

  async function loadMedications() {
    const meds = await fetchMedications();
    setMedications(meds);
    setLoading(false);
  }

  async function handleAddMedication() {
    if (!name || !dosage || !frequency || !timeOfDay || !startDate) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    await insertMedication(name, dosage, frequency, [timeOfDay], startDate, endDate || null);
    
    // Refresh List
    loadMedications();
    
    // Close Modal & Reset Form
    setModalVisible(false);
    setName("");
    setDosage("");
    setFrequency("");
    setTimeOfDay("");
    setStartDate("");
    setEndDate("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Medications</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : medications.length === 0 ? (
        <Text style={styles.emptyText}>No medications found.</Text>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.medCard}>
              <Text style={styles.medName}>{item.name}</Text>
              <Text style={styles.medDetails}>Dosage: {item.dosage}</Text>
              <Text style={styles.medDetails}>Frequency: {item.frequency}</Text>
              <Text style={styles.medDetails}>Time: {item.time_of_day.join(", ")}</Text>
              <Text style={styles.medDetails}>Start Date: {item.start_date}</Text>
              {item.end_date && <Text style={styles.medDetails}>End Date: {item.end_date}</Text>}
            </View>
          )}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>➕</Text>
      </TouchableOpacity>

      {/* Modal for Adding Medication */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Medication</Text>
            
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Dosage" value={dosage} onChangeText={setDosage} />
            <TextInput style={styles.input} placeholder="Frequency (e.g., Daily, Weekly)" value={frequency} onChangeText={setFrequency} />
            <TextInput style={styles.input} placeholder="Time (HH:MM)" value={timeOfDay} onChangeText={setTimeOfDay} />
            <TextInput style={styles.input} placeholder="Start Date (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} />
            <TextInput style={styles.input} placeholder="End Date (optional)" value={endDate} onChangeText={setEndDate} />

            <View style={styles.buttonContainer}>
              <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
              <Button title="Add" onPress={handleAddMedication} />
            </View>
          </View>
        </View>
      </Modal>
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
  medCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  medName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  medDetails: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: "#FFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
});
