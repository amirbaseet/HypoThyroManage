import React,{useContext,useEffect} from "react";
import {View ,Text, Button} from 'react-native';
import { AuthContext } from "../context/AuthContext";
import { initializeDatabase,resetDatabase,deleteAllData, fetchMedications } from "../database/database";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
      await logout();  // Ensure state is reset first
      navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
        })
    );

  };

  useEffect(() => {
    async function testDatabaseReset() {
      await initializeDatabase();

      console.log("🛑 Deleting all data...");
      await deleteAllData(); // OR use resetDatabase()
      await resetDatabase(); // OR use resetDatabase()

      // Fetch medications to confirm deletion
      const meds = await fetchMedications();
      console.log("📌 Medications after deletion:", meds);
    }

    async function testDatabase() {
      await initializeDatabase();

      // Insert a test medication
      // await insertMedication("Aspirin", "1 pill", "Daily", ["08:00"], "2025-03-08", null);

      // Fetch and log medications

      const meds = await fetchMedications();
      console.log("📌 Medications in DB:", meds);

      // Fetch and log medication logs
   
      // const logs = await fetchMedicationLogs();
      // console.log("📌 Medication Logs in DB:", logs);
    }
    // testDatabaseReset();
    testDatabase();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Button title="Logout" onPress={handleLogout} />
</View>
);
};

export default HomeScreen;