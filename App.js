import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { initializeDatabase, insertMedication,resetDatabase,deleteAllData, fetchMedications, fetchMedicationLogs } from "./src/database/database";

export default function App() {
  
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
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
