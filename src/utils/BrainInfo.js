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

const BrainInfo = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollView style={infoCardStyles.container}>
      {sections.map((section) => (
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
const sections = [
  {
    id: 1,
    title: '1️⃣ Hipotiroidizm ve Bilişsel Etkileri',
    content: [
      'Hipotiroidizm hastaları yorgunluk, unutkanlık ve odaklanma zorluğu gibi semptomlar bildirmektedir.',
      '✔️ Düşük tiroid hormon seviyeleri, beyin fonksiyonlarını olumsuz etkileyebilir.',
      '✔️ Düzenli tiroid hormonu tedavisi, bilişsel işlevleri korumak için çok önemlidir.',
    ],
  },
  {
    id: 2,
    title: '2️⃣ Hafif Fiziksel Aktivitenin Bilişsel Faydaları',
    content: [
      'Hafif egzersiz, beyin sağlığını destekleyerek odaklanmayı artırabilir.',
      '✔️ Hafif yürüyüş, yoga ve esneme hareketleri, beyin fonksiyonlarını güçlendirebilir.',
      '✔️ Fiziksel aktivite, hipotiroidizm hastalarında bilişsel zorlanmayı azaltabilir.',
    ],
  },
  {
    id: 3,
    title: '3️⃣ Yapılandırılmış Beyin Egzersizleri',
    content: [
      '🧠 Bilişsel sağlığı geliştiren aktiviteler:',
      '✔️ Bulmacalar ve hafıza oyunları, beyin fonksiyonlarını güçlendirebilir.',
      '✔️ Mobil cihazlarla yapılan bilişsel egzersizler, odaklanmayı artırabilir.',
      '✔️ Bilişsel eğitim programları, hafıza ve öğrenme becerilerini geliştirebilir.',
    ],
  },
  {
    id: 4,
    title: '4️⃣ Uyku, Beslenme ve Stresin Rolü',
    content: [
      '🛌 Beyin sağlığını desteklemek için önemli faktörler:',
      '✔️ Kaliteli uyku, zihinsel berraklık için kritik öneme sahiptir.',
      '✔️ Sağlıklı beslenme, bilişsel fonksiyonları iyileştirir.',
      '✔️ Stresin yönetilmesi, hafıza ve odaklanmayı artırabilir.',
    ],
  },
];

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
