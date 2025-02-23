import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';

const DermaInfo = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 1️⃣ Tiroid Bozuklukları ve Cilt Sağlığı */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(1)}>
        <Text style={styles.headerText}>1️⃣ Tiroid Bozuklukları ve Cilt Sağlığı</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 1}>
        <View style={styles.content}>
          <Text>Hormonal dengesizlikler ve dermatolojik durumlar arasında güçlü bir ilişki vardır.</Text>
          <Text>✔️ **Tiroid bozuklukları, cilt hastalıklarıyla sıkça ilişkilidir.**</Text>
          <Text>✔️ **Tiroid hormonları; cilt bariyeri fonksiyonu, epidermal yenilenme ve saç büyümesini etkiler.**</Text>
        </View>
      </Collapsible>

      {/* 2️⃣ Hipotiroidizm ve Cilt Üzerindeki Etkileri */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(2)}>
        <Text style={styles.headerText}>2️⃣ Hipotiroidizm ve Cilt Üzerindeki Etkileri</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 2}>
        <View style={styles.content}>
          <Text>Hipotiroidizm, ciltte ve tırnaklarda belirgin değişikliklere neden olabilir.</Text>
          <Text>✔️ **Cilt kuruluğu, atopik dermatit ve pigmentasyon bozuklukları yaygındır.**</Text>
          <Text>✔️ **Otoimmün mekanizmalar, cilt semptomlarını şiddetlendirebilir.**</Text>
          <Text>✔️ **Levotiroksin tedavisi, ciltte görülen semptomları hafifletebilir.**</Text>
        </View>
      </Collapsible>

      {/* 3️⃣ Cilt Sağlığı İçin Dermatolojik Tavsiyeler */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(3)}>
        <Text style={styles.headerText}>3️⃣ Cilt Sağlığı İçin Dermatolojik Tavsiyeler</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 3}>
        <View style={styles.content}>
          <Text>🌿 **Cilt sağlığını destekleyen bazı doğal çözümler önerilmektedir:**</Text>
          <Text style={styles.list}>✔️ **Acı biber veya biberiye içeren solüsyonlar:** Kan akışını uyararak cildin beslenmesini artırır.</Text>
          <Text style={styles.list}>✔️ **Üzüm çekirdeği yağı:** Saç foliküllerinde hücre bölünmesini destekler.</Text>
          <Text style={styles.list}>✔️ **Seramidler:** Cilt bariyerini güçlendirerek nem kaybını önler.</Text>
          <Text style={styles.list}>✔️ **Hindistan cevizi, ayçiçeği çekirdeği, jojoba, üzüm çekirdeği ve argan yağı:** Cildi besler ve onarır.</Text>
          <Text style={styles.list}>⚠️ **Oleik asit oranı yüksek yağlar cilt bariyerine zarar verebilir, soğuk preslenmiş ürünler tercih edilmelidir.**</Text>
        </View>
      </Collapsible>

      {/* 4️⃣ Cilt Bariyerini Kuvvetlendiren Uygulamalar */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(4)}>
        <Text style={styles.headerText}>4️⃣ Cilt Bariyerini Kuvvetlendiren Uygulamalar</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 4}>
        <View style={styles.content}>
          <Text>💧 **Cilt bariyerinin korunması için en iyi yaklaşımlar:**</Text>
          <Text>✔️ **Seramid içeren nemlendiriciler, cilt bariyerini onarır ve su kaybını azaltır.**</Text>
          <Text>✔️ **Doğal yağlar (jojoba, argan, üzüm çekirdeği vb.), cilt bariyerini güçlendirir ve nemlendirir.**</Text>
          <Text>✔️ **Üre içeren kremler, atopik dermatitli ve kuru ciltler için etkili bir bileşendir.**</Text>
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

export default DermaInfo;
