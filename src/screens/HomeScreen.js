import React,{useContext,useEffect, useState} from "react";
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { AuthContext } from "../context/AuthContext";
import { initializeDatabase } from "../database/database";
import { useNavigation } from "@react-navigation/native";
import { deleteAllData, resetDatabase } from "../database/DropDB";
import { getLocalUsers } from "../database/UsersCrud";
import { getSymptoms } from "../api/apiService";
const HomeScreen = () => {
  const navigation = useNavigation();
  const {user,logout} = useContext(AuthContext);
  const [symptoms, setSymptoms] = useState([]);

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
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Symptom List</Text>
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

export default HomeScreen;