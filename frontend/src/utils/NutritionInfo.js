import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import infoCardStyles from 'styles/infoCardStyles'; // ✅ import shared styles
import { nutritionInfoSections } from 'constants/nutritionInfoSections';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NutritionInfo = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollView style={infoCardStyles.container}>
      <Text style={infoCardStyles.screenTitle}>🍽️ Beslenme Rehberi</Text>

      {nutritionInfoSections .map((section) => (
        <View key={section.id}>
          <TouchableOpacity
            style={[
              infoCardStyles.header,
              activeSection === section.id && infoCardStyles.activeHeader,
            ]}
            onPress={() => toggleSection(section.id)}
          >
            <Text style={infoCardStyles.headerText}>{section.title}</Text>
          </TouchableOpacity>

          <Collapsible collapsed={activeSection !== section.id}>
            <View style={infoCardStyles.card}>
              {section.content.map((line, idx) => (
                <Text key={idx} style={infoCardStyles.contentText}>{line}</Text>
              ))}
            </View>
          </Collapsible>
        </View>
      ))}
    </ScrollView>
  );
};

export default NutritionInfo;
