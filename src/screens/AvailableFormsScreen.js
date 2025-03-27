import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getActiveFormWindows } from "../services/patientService";
import { useTranslation } from "react-i18next";

export default function AvailableFormsScreen({ navigation }) {
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    const res = await getActiveFormWindows();
    if (!res.error) {
      setForms(res);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("SymptomForm", { formWindow: item })}
      style={styles.item}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text>
        {new Date(item.weekStart).toDateString()} →{" "}
        {new Date(item.weekEnd).toDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    
    <FlatList
      data={forms}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      ListEmptyComponent={
        <Text style={styles.empty}>{t("no_active_forms")}</Text>
      }
      
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
});
