import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import infoCardStyles from 'styles/infoCardStyles'; // ✅ Shared style
import { dermaInfoSections } from 'constants/dermaInfoSections';

const DermaInfo = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollView style={infoCardStyles.container}>
      {dermaInfoSections.map((section) => (
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



export default DermaInfo;
