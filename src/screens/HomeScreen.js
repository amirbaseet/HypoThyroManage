import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { initializeDatabase } from "../database/database";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { deleteAllData, resetDatabase } from "../database/DropDB";
// import { getLocalUsers } from "../database/UsersCrud";
import { getSymptoms } from "../services/symptomsService";
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {user,logout} = useContext(AuthContext);
  const [symptoms, setSymptoms] = useState([]);
  const { t } = useTranslation();

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

    }

    async function deleteDatabase() {
      await resetDatabase();
    }
   async function InitialiseDb(){
    // await initializeDatabase();
    // await getLocalUsers()
    // const existingUser = await getUserById("123");
    // console.log("exist ? = ",existingUser);

  }
  const fetchSymptoms = async () => {
    const data = await getSymptoms();
    setSymptoms(data);
};
fetchSymptoms();


  // testDatabaseReset();
  InitialiseDb();

    // console.log("AuthContext User:", user);
    // console.log("AuthContext User:", user);

  }, [user]);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

//         <Text>{user?.username ? `Welcome, ${user.username}! 👋` : "Welcome, Guest!"}</Text>


//     <Button title="Logout" onPress={handleLogout} />
// </View>
// );
return (
  <View style={{ padding: 20 }}>
      <View style={styles.languageButtons}>
        <Button title="Türkçe" onPress={() => i18n.changeLanguage("tr")} />
        <View style={{ width: 10 }} />
        <Button title="English" onPress={() => i18n.changeLanguage("en")} />
      </View>
      <Text style={styles.header}>
        {user?.username
          ? `${t("welcome")}, ${user.username}! 👋`
          : t("welcome")}
      </Text>

      <FlatList
          data={symptoms}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
              <TouchableOpacity 
                  style={{ padding: 10, borderBottomWidth: 1 }}
                  onPress={() => navigation.navigate('Report', { symptomId: item._id })}
              >
                  <Text>{item.name}</Text>
              </TouchableOpacity>
          )}
      />
  </View>
);

};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  languageButtons: {
    flexDirection: "row",
    marginBottom: 15,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default HomeScreen;