import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import infoCardStyles from 'styles/infoCardStyles'; // ✅ import shared styles
import { exerciseInfoSections } from 'constants/exerciseInfoSections'; // adjust path based on your structure

const ExcersiseInfo = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollView style={infoCardStyles.container}>
      {exerciseInfoSections.map((section) => (
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



export default ExcersiseInfo;
