import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const icons = [
  'play-circle-outline',
  'medkit-outline',
  'document-text-outline',
  'videocam-outline',
  'chatbubble-ellipses-outline',
  'bar-chart-outline',
];

const colors = [
  '#C084FC',
  '#A78BFA',
  '#60A5FA',
  '#5EEAD4',
  '#34D399',
  '#4ADE80',
];

const KullanimRehberiScreen = () => {
  const { t } = useTranslation();
  const steps = t('steps', { returnObjects: true });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('guide_title')}</Text>

      {steps.map((step, index) => (
        <View key={index} style={[styles.card, { borderLeftColor: colors[index] }]}>
          <View style={styles.header}>
            <Ionicons name={icons[index]} size={26} color={colors[index]} style={styles.icon} />
            <Text style={styles.stepTitle}>{`${index + 1}. ${step.title}`}</Text>
          </View>
          <Text style={styles.stepDesc}>{step.desc}</Text>

          {index < steps.length - 1 && <View style={styles.connector} />}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1F2937',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
  },
  stepTitle: {
    fontFamily: 'SourceSans3-Regular',
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 1,
  },
  stepDesc: {
    fontFamily: 'SourceSans3-Regular',
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  connector: {
    height: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
    marginTop: 20,
    marginLeft: 14,
  },
});

export default KullanimRehberiScreen;
