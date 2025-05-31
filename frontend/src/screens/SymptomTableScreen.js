import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

const SymptomTableScreen = () => {
        const { t } = useTranslation();
    
  const data = [
    {
      title: 'Video içeriği',
      symptoms: ['Semptomlar']
    },
    {
      title: 'Beslenme tavsiyesi',
      symptoms: [
        'Yorgunluk / Halsizlik',
        'Kabızlık',
        'Kilo Alma',
        'Hareketlerde yavaşlama',
        'Adet düzensizliği'
      ]
    },
    {
      title: 'Egzersiz planı',
      symptoms: [
        'Kilo alma',
        'Kas krampı',
        'Eklem ağrısı',
        'Depresif Hissetme',
        'Cinsel İsteksizlik'
      ]
    },
    {
      title: 'Stres yönetimi',
      symptoms: [
        'Kabızlık',
        'Halsizlik / yorgunluk',
        'Hareketlerde yavaşlama',
        'Hafızada azalma / unutkanlık',
        'İştahsızlık',
        'Sinirlilik',
        'Yavaş konuşma',
        'Cinsel isteksizlik',
        'Konsantrasyon zorluğu',
        'Adet düzensizliği',
        'Hareket halinde nefes darlığı'
      ]
    },
    {
      title: 'Dermatolojik tavsiyeler',
      symptoms: [
        'Cilt kuruluğu',
        'Saç dökülmesi',
        'Üşüme'
      ]
    },
    {
      title: 'Beyin egzersizleri',
      symptoms: [
        'Hafızada azalma',
        'Unutkanlık',
        'Konsantrasyon zorluğu'
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}> {t('Videoların_semptomlarla_ilişkisi')}</Text>
        {data.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.category}>{item.title}</Text>
            </View>
            <View style={styles.rightColumn}>
              {item.symptoms.map((symptom, i) => (
                <Text key={i} style={styles.symptom}>• {symptom}</Text>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
    
  },
  row: {
    flexDirection: 'row',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  leftColumn: {
    width: '40%',
    paddingRight: 10,
  },
  rightColumn: {
    width: '60%',
  },
  category: {
    fontWeight: 'bold',
    color: '#3B82F6',
    fontSize: 16,
    fontFamily: 'SourceSans3-Regular', 

  },
  symptom: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    fontFamily: 'SourceSans3-Regular', 

  }
});

export default SymptomTableScreen;
