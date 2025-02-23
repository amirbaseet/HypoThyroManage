import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';

const StressInfo = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 1️⃣ Tiro-Stresin Yönetimi */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(1)}>
        <Text style={styles.headerText}>1️⃣ Tiro-Stresin Yönetimi</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 1}>
        <View style={styles.content}>
          <Text>Tiro-stres yönetimi, **eğitim, danışmanlık ve destek** üçlüsüyle mümkündür ve farmakolojik desteğe gerek yoktur.</Text>
          <Text>✔️ **Aktif Dinleme:** Hastanın endişelerini dinleyerek güven sağlar.</Text>
          <Text>✔️ **Empatik Açıklama:** Doğru bilgi verirken duygusal ihtiyaçları anlar.</Text>
          <Text>✔️ **Yanlış Bilgilerin Filtrelenmesi:** Bilimsel verilere dayalı doğru bilgileri sağlar.</Text>
        </View>
      </Collapsible>

      {/* 2️⃣ Yoga ve Bütüncül Yaklaşım */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(2)}>
        <Text style={styles.headerText}>2️⃣ Yoga ve Bütüncül Yaklaşım</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 2}>
        <View style={styles.content}>
          <Text>Hipotiroidili hastalara uygulanan yoga ve bütüncül yaklaşımlar, **TSH seviyelerini düşürerek semptomları iyileştirebilir.**</Text>
          <Text style={styles.list}>✔️ **Çalışma:** Günde 60 dakika, haftada 5 gün, 3 ay boyunca yoga yapan hastalarda:</Text>
          <Text style={styles.list}>✅ Depresyon ve stres seviyelerinde azalma</Text>
          <Text style={styles.list}>✅ Yorgunluk ve anksiyete azalması</Text>
          <Text style={styles.list}>✅ HDL (iyi kolesterol) seviyelerinde artış</Text>
        </View>
      </Collapsible>

      {/* 3️⃣ Hipotiroidizm ve Depresyon Bağlantısı */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(3)}>
        <Text style={styles.headerText}>3️⃣ Hipotiroidizm ve Depresyon Bağlantısı</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 3}>
        <View style={styles.content}>
          <Text>Hipotiroidizm ve depresyon arasında bir bağlantı vardır.</Text>
          <Text>🔹 **Serotonin ve Somatostatin** hormonları, hipotiroidi hastalarında ruh halini etkileyebilir.</Text>
          <Text>✔️ Hipotiroidizmin tedavi edilmesi, depresyon belirtilerini azaltabilir.</Text>
        </View>
      </Collapsible>

      {/* 4️⃣ Kanıta Dayalı Stres Yönetimi Teknikleri */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(4)}>
        <Text style={styles.headerText}>4️⃣ Kanıta Dayalı Stres Yönetimi Teknikleri</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 4}>
        <View style={styles.content}>
          <Text>✅ **Progresif Kas Gevşemesi:**</Text>
          <Text>🔹 Kas gruplarını sırasıyla kasma ve gevşetme tekniğidir.</Text>
          <Text>🔹 Günde 2-3 kez, 15-20 dakika uygulanabilir.</Text>

          <Text>✅ **Diyafram Solunumu:**</Text>
          <Text>🔹 Burundan derin nefes alıp ağızdan yavaşça verme tekniğidir.</Text>
          <Text>🔹 Gerginliği azaltarak stresle baş etmeye yardımcı olur.</Text>

          <Text>📌 **Bilimsel Kanıtlar:**</Text>
          <Text>✔️ Nefes egzersizleri **stresi ve kaygıyı** azaltabilir.</Text>
          <Text>✔️ **Günde en az 5 dakika** uygulanması önerilir.</Text>
        </View>
      </Collapsible>

      {/* 5️⃣ Egzersiz ve Stres Yönetimi */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(5)}>
        <Text style={styles.headerText}>5️⃣ Egzersiz ve Stres Yönetimi</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 5}>
        <View style={styles.content}>
          <Text>Egzersiz, stres yönetimi için etkili bir araçtır.</Text>
          <Text>✔️ Kapalı alanda yapılan egzersiz mental stresi **%14 oranında** azaltabilir.</Text>
          <Text>✔️ **Amerikan Psikoloji Derneği'ne (APA) göre**, insanların %47'si stresle başa çıkmak için yürüyüş yapmaktadır.</Text>
        </View>
      </Collapsible>

      {/* 6️⃣ APA Stres Yönetimi Tavsiyeleri */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(6)}>
        <Text style={styles.headerText}>6️⃣ APA Stres Yönetimi Tavsiyeleri</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 6}>
        <View style={styles.content}>
          <Text>🔹 **Stres faktörlerini ortadan kaldırmaya çalışın.**</Text>
          <Text>🔹 **Sosyal destek geliştirin.**</Text>
          <Text>🔹 **İyi beslenme ve düzenli uyku alışkanlıkları oluşturun.**</Text>
          <Text>🔹 **Kas gevşetme ve meditasyon yapın.**</Text>
          <Text>🔹 **Dışarıda vakit geçirin ve sevdiğiniz aktiviteleri yapın.**</Text>
          <Text>🔹 **Stresle baş edemiyorsanız, profesyonel destek alın.**</Text>
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

export default StressInfo;
