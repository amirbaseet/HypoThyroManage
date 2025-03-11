import React,{useContext,useEffect} from "react";
import {View ,Text, Button} from 'react-native';
import { AuthContext } from "../context/AuthContext";
import { initializeDatabase,resetDatabase,deleteAllData, fetchMedications } from "../database/database";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const {user,logout} = useContext(AuthContext);

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

      console.log("🛑 Deleting all data...");
      await deleteAllData(); // OR use resetDatabase()
      await resetDatabase(); // OR use resetDatabase()

      // Fetch medications to confirm deletion
      const meds = await fetchMedications();
      console.log("📌 Medications after deletion:", meds);
    }

    async function testDatabase() {

      // Insert a test medication
      // await insertMedication("Aspirin", "1 pill", "Daily", ["08:00"], "2025-03-08", null);

      // Fetch and log medications

      // const meds = await fetchMedications();
      // console.log("📌 Medications in DB:", meds);

      // Fetch and log medication logs
   
      // const logs = await fetchMedicationLogs();
      // console.log("📌 Medication Logs in DB:", logs);
    }
   async function InitialiseDb(){
    await initializeDatabase();
  }
  InitialiseDb();
    console.log("AuthContext User:", user);
    console.log("AuthContext User:", user);

  }, [user]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
        <Text>{user?.user?.username ? `Welcome, ${user.user.username}! 👋` : "Welcome, Guest!"}</Text>
        

    <Button title="Logout" onPress={handleLogout} />
</View>
);
};

export default HomeScreen;