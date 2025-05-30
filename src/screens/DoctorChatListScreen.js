import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "context/AuthContext";
import { getDoctorChatListAPI, getMissedMedicineUsers } from "services/doctorService";
import { useTranslation } from "react-i18next";

const DoctorChatListScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [chats, setChats] = useState([]);
  const [missedUsers, setMissedUsers] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [missedOnly, setMissedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await getDoctorChatListAPI();
          const missed = await getMissedMedicineUsers();
          setChats(data);
          setMissedUsers(missed.map(user => user._id));
          setFilteredChats(data);
        } catch (error) {
          console.error("❌ Error fetching chat list or missed users:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterChats(text, missedOnly);
  };

  const toggleFilter = (value) => {
    setMissedOnly(value);
    filterChats(searchQuery, value);
  };

  const filterChats = (search, missedOnlyFilter) => {
    const filtered = chats.filter((chat) => {
      const matchName = chat.patientName.toLowerCase().includes(search.toLowerCase());
      const isMissed = missedUsers.includes(chat.patientId);
      return matchName && (!missedOnlyFilter || isMissed);
    });
    setFilteredChats(filtered);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={t("search_by_name")}
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
        placeholderTextColor="#aaa"
      />

      <View style={styles.toggleButtonsContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !missedOnly && styles.activeToggle]}
          onPress={() => toggleFilter(false)}
        >
          <Text style={styles.toggleText}>{t("all_patients")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, missedOnly && styles.activeToggle]}
          onPress={() => toggleFilter(true)}
        >
          <Text style={styles.toggleText}>{t("missed_patients")}</Text>
        </TouchableOpacity>
      </View>

      {filteredChats.length === 0 ? (
        <Text style={styles.noChats}>{t("no_chats")}</Text>
      ) : (
        <FlatList
          data={filteredChats}
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
                    : t("no_messages")}
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
  searchInput: {
    backgroundColor: "#EFEFEF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  toggleButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 15,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#EAE7DC",
  },
  activeToggle: {
    backgroundColor: "#C6A477",
  },
  toggleText: {
    color: "#333",
    fontWeight: "600",
  },
});

export default DoctorChatListScreen;
