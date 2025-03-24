// screens/ReportsMenuScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const menuOptions = [
  { route: 'CombinedReportsScreen', icon: 'document-text-outline', labelKey: 'reports' },
  { route: 'TakeMedicineScreen', icon: 'medkit-outline', labelKey: 'take_medicine' },
  { route: 'AvailableForms', icon: 'folder-open-outline', labelKey: 'available_forms' },
  { route: 'Report', icon: 'create-outline', labelKey: 'report' },
];

const ReportsMenuScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{t('reports_menu')}</Text>

      <View style={styles.menuContainer}>
        {menuOptions.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.card}
            onPress={() => navigation.navigate(item.route)}
          >
            <Ionicons name={item.icon} size={32} color="#C6A477" />
            <Text style={styles.cardText}>{t(item.labelKey)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FAF9F6",
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: '45%',
    paddingVertical: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#EEE",
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },
});

export default ReportsMenuScreen;
