import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { getDoctorChatListAPI } from "../services/doctorService"; // API call for doctor chat list

const DoctorChatListScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⏳ Fetch chat list every time screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchChats = async () => {
        try {
          setLoading(true);
          const data = await getDoctorChatListAPI();
          setChats(data);
          console.log("✅ Doctor Chat List API response:", data);
        } catch (error) {
          console.error("❌ Error fetching chat list:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchChats();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>
      {chats.length === 0 ? (
        <Text style={styles.noChats}>No chats available</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.patientId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() =>
                navigation.navigate("DoctorChatScreen", {
                  patientId: item.patientId,
                  patientName: item.patientName,
                })
              }
            >
              <View style={styles.chatContent}>
                <Text style={styles.chatText}>{item.patientName}</Text>
                <Text style={styles.lastMessage}>
                  {item.lastMessage
                    ? item.lastMessage.length > 30
                      ? item.lastMessage.substring(0, 30) + "..."
                      : item.lastMessage
                    : "No messages yet"}
                </Text>
              </View>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FAF9F6" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#444444",
  },
  noChats: { textAlign: "center", fontSize: 16, color: "#777", marginTop: 20 },
  chatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#DDD",
  },
  chatContent: { flex: 1 },
  chatText: { fontSize: 18, fontWeight: "bold", color: "#444444" },
  lastMessage: { fontSize: 14, color: "#777", marginTop: 5 },
  unreadBadge: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  unreadText: { color: "white", fontWeight: "bold" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default DoctorChatListScreen;
