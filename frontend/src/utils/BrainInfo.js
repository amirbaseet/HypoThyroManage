import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import infoCardStyles from 'styles/infoCardStyles'; // ✅ Shared style
import { brainInfoSections } from 'constants/brainInfoSections'; // adjust the path based on your project structure

const BrainInfo = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollView style={infoCardStyles.container}>
      {brainInfoSections.map((section) => (
        <View key={section.id}>
          <TouchableOpacity
            style={infoCardStyles.header}
            onPress={() => toggleSection(section.id)}
          >
            <Text style={infoCardStyles.headerText}>{section.title}</Text>
          </TouchableOpacity>
          <Collapsible collapsed={activeSection !== section.id}>
            <View style={infoCardStyles.card}>
              {section.content.map((line, idx) => (
                <Text key={idx} style={infoCardStyles.contentText}>
                  {line}
                </Text>
              ))}
            </View>
          </Collapsible>
        </View>
      ))}
    </ScrollView>
  );
};

// Styles adapted from ReportsScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF9F6',
  },
  header: {
    backgroundColor: '#B08968',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#B08968',
  },
    headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FAF9F6',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#EAE7DC',
    borderRadius: 10,
    padding: 15,
    marginTop: 5,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#C6A477',
    elevation: 3,
  },
  contentText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 8,
  },
});

export default BrainInfo;
