import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';

const BrainInfo = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 1️⃣ Hipotiroidizm ve Bilişsel Etkileri */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(1)}>
        <Text style={styles.headerText}>1️⃣ Hipotiroidizm ve Bilişsel Etkileri</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 1}>
        <View style={styles.content}>
          <Text>Hipotiroidizm hastaları **yorgunluk, unutkanlık ve odaklanma zorluğu** gibi semptomlar bildirmektedir.</Text>
          <Text>✔️ **Düşük tiroid hormon seviyeleri, beyin fonksiyonlarını olumsuz etkileyebilir.**</Text>
          <Text>✔️ **Düzenli tiroid hormonu tedavisi, bilişsel işlevleri korumak için çok önemlidir.**</Text>
        </View>
      </Collapsible>

      {/* 2️⃣ Hafif Fiziksel Aktivitenin Bilişsel Faydaları */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(2)}>
        <Text style={styles.headerText}>2️⃣ Hafif Fiziksel Aktivitenin Bilişsel Faydaları</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 2}>
        <View style={styles.content}>
          <Text>Hafif egzersiz, **beyin sağlığını destekleyerek odaklanmayı artırabilir.**</Text>
          <Text>✔️ **Hafif yürüyüş, yoga ve esneme hareketleri, beyin fonksiyonlarını güçlendirebilir.**</Text>
          <Text>✔️ **Fiziksel aktivite, hipotiroidizm hastalarında bilişsel zorlanmayı azaltabilir.**</Text>
        </View>
      </Collapsible>

      {/* 3️⃣ Yapılandırılmış Beyin Egzersizleri */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(3)}>
        <Text style={styles.headerText}>3️⃣ Yapılandırılmış Beyin Egzersizleri</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 3}>
        <View style={styles.content}>
          <Text>🧠 **Bilişsel sağlığı geliştiren aktiviteler:**</Text>
          <Text style={styles.list}>✔️ **Bulmacalar ve hafıza oyunları**, beyin fonksiyonlarını güçlendirebilir.</Text>
          <Text style={styles.list}>✔️ **Mobil cihazlarla yapılan bilişsel egzersizler**, odaklanmayı artırabilir.</Text>
          <Text style={styles.list}>✔️ **Bilişsel eğitim programları**, hafıza ve öğrenme becerilerini geliştirebilir.</Text>
        </View>
      </Collapsible>

      {/* 4️⃣ Uyku, Beslenme ve Stresin Rolü */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(4)}>
        <Text style={styles.headerText}>4️⃣ Uyku, Beslenme ve Stresin Rolü</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 4}>
        <View style={styles.content}>
          <Text>🛌 **Beyin sağlığını desteklemek için önemli faktörler:**</Text>
          <Text>✔️ **Kaliteli uyku**, zihinsel berraklık için kritik öneme sahiptir.</Text>
          <Text>✔️ **Sağlıklı beslenme**, bilişsel fonksiyonları iyileştirir.</Text>
          <Text>✔️ **Stresin yönetilmesi**, hafıza ve odaklanmayı artırabilir.</Text>
        </View>
      </Collapsible>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 5,
    borderRadius: 8,
  },
  list: {
    fontSize: 14,
    marginLeft: 10,
    marginVertical: 3,
  },
});

export default BrainInfo;
