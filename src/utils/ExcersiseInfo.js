import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';

const ExcersiseInfo = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 1️⃣ Egzersizin Önemi */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(1)}>
        <Text style={styles.headerText}>1️⃣ Egzersizin Önemi</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 1}>
        <View style={styles.content}>
          <Text>Hipotiroidi tedavisinde TSH seviyesini dengelemek esastır, ancak hastalar yorgunluk ve kilo alma gibi sorunlar yaşayabilir.</Text>
          <Text>✅ **Egzersiz, enerji seviyelerini yükseltmeye ve yaşam kalitesini artırmaya yardımcı olabilir.**</Text>
          <Text>✔️ Aerobik ve direnç egzersizleri fiziksel ve ruhsal sağlığa olumlu katkılar sağlar.</Text>
        </View>
      </Collapsible>

      {/* 2️⃣ Aerobik Egzersiz */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(2)}>
        <Text style={styles.headerText}>2️⃣ Yavaş Başlangıçla Aerobik Egzersiz</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 2}>
        <View style={styles.content}>
          <Text>Aerobik egzersizler **kalp sağlığını iyileştirir, metabolizmayı hızlandırır ve kilo kontrolüne yardımcı olur.**</Text>
          <Text style={styles.list}>✔️ **Egzersiz Tipi:** Yürüyüş, düşük tempolu bisiklet, yüzme, hafif koşu</Text>
          <Text style={styles.list}>✔️ **Sıklık:** Haftada 3-5 gün</Text>
          <Text style={styles.list}>✔️ **Süre:** 20-30 dakika, zamanla artırılabilir.</Text>
          <Text style={styles.list}>✔️ **Yoğunluk:** Düşük - orta seviye</Text>
          <Text style={styles.list}>⚠️ Eğer aşırı yorgunluk hissediliyorsa, egzersiz süresi azaltılmalıdır.</Text>
        </View>
      </Collapsible>

      {/* 3️⃣ Güçlendirme Egzersizleri */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(3)}>
        <Text style={styles.headerText}>3️⃣ Güçlendirme (Ağırlıksız) Egzersizleri</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 3}>
        <View style={styles.content}>
          <Text>Hipotiroidi hastalarında **kas zayıflığı yaygın görülebilir**. Ağırlıksız egzersizler, kasları zorlamadan güçlendirmek için idealdir.</Text>
          <Text style={styles.list}>✔️ **Egzersiz Tipi:** Vücut ağırlığıyla yapılan squat, lunges, plank, direnç bandı egzersizleri</Text>
          <Text style={styles.list}>✔️ **Sıklık:** Haftada 2-3 gün</Text>
          <Text style={styles.list}>✔️ **Süre:** 15-30 dakika</Text>
          <Text>✅ **Önerilen Hareketler:**</Text>
          <Text style={styles.list}>🔹 **Squat:** Sırt düz olacak şekilde bacakları 90 derece bükerek çömelme</Text>
          <Text style={styles.list}>🔹 **Lunge:** Adım atarak yapılan hareket; dizler 90 derece olmalı</Text>
          <Text style={styles.list}>🔹 **Plank:** Yüz üstü yere paralel durarak, karın kaslarını çalıştırma</Text>
        </View>
      </Collapsible>

      {/* 4️⃣ Esneme ve Mobilite Egzersizleri */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(4)}>
        <Text style={styles.headerText}>4️⃣ Esneme ve Mobilite Egzersizleri</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 4}>
        <View style={styles.content}>
          <Text>Hipotiroidi kaslarda sertlik ve ağrıya neden olabilir. **Düzenli esneme hareketleri kasları rahatlatabilir.**</Text>
          <Text style={styles.list}>✔️ **Egzersiz Tipi:** Yoga, Pilates, basit esneme hareketleri</Text>
          <Text style={styles.list}>✔️ **Sıklık:** Haftada 2-3 gün</Text>
          <Text style={styles.list}>✔️ **Süre:** 10-20 dakika</Text>
          <Text>✅ **Önerilen Hareketler:**</Text>
          <Text style={styles.list}>🔹 **Child’s Pose:** Dizler üzerinde oturup öne eğilerek sırtın gerilmesi</Text>
          <Text style={styles.list}>🔹 **Kedi-İnek Hareketi:** Sırtı yukarı ve aşağı hareket ettirme</Text>
          <Text style={styles.list}>🔹 **Öne Eğilme:** Ellerle yere uzanarak sırtı esnetme</Text>
        </View>
      </Collapsible>

      {/* 5️⃣ Mental Sağlık İçin Egzersiz */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(5)}>
        <Text style={styles.headerText}>5️⃣ Mental Sağlık İçin Egzersiz</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 5}>
        <View style={styles.content}>
          <Text>Hipotiroidi hastalarında **ruh hali değişiklikleri ve depresyon görülebilir**. Egzersiz, endorfin salgılanmasını artırarak ruh halini iyileştirir.</Text>
          <Text style={styles.list}>✔️ **Egzersiz Tipi:** Yürüyüş, yoga, meditasyon, nefes egzersizleri</Text>
          <Text style={styles.list}>✔️ **Sıklık:** Günlük</Text>
          <Text style={styles.list}>✔️ **Süre:** 10-30 dakika</Text>
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

export default ExcersiseInfo;
