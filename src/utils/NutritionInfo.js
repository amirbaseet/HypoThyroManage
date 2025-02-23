import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';

const NutritionInfo = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 1️⃣ Beslenme Tavsiyesi */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(1)}>
        <Text style={styles.headerText}>1️⃣ Beslenme Tavsiyesi</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 1}>
        <View style={styles.content}>
          <Text>Hipotiroidizm hastaları vitamin, mineral, demir, iyot ve selenyum açısından zengin bir diyet uygulamalıdır.</Text>
          <Text style={styles.list}>✔️ Süt ürünleri, yumurta, balık, et, meyve ve sebze tüketilmelidir.</Text>
          <Text style={styles.list}>❌ Guatrojenik yiyeceklerden kaçınılmalıdır: brokoli, lahana, karnabahar, turp, şalgam.</Text>
        </View>
      </Collapsible>

      {/* 2️⃣ Selenyumun Önemi */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(2)}>
        <Text style={styles.headerText}>2️⃣ Selenyumun Önemi</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 2}>
        <View style={styles.content}>
          <Text>Selenyum, tiroid bezinin korunması ve metabolizması için gereklidir.</Text>
          <Text style={styles.list}>✔️ En iyi kaynakları: Et, süt ürünleri, tahıllar ve deniz ürünleri.</Text>
          <Text style={styles.list}>⚠️ Fazla tüketimi toksik olabilir, doktor kontrolünde alınmalıdır.</Text>
        </View>
      </Collapsible>

      {/* 3️⃣ İyotun Önemi */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(3)}>
        <Text style={styles.headerText}>3️⃣ İyotun Önemi</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 3}>
        <View style={styles.content}>
          <Text>İyot, tiroid hormonlarının üretimi için gereklidir.</Text>
          <Text style={styles.list}>✔️ İyot Kaynakları: Deniz yosunu, balık, deniz ürünleri, iyotlu tuz, süt ürünleri.</Text>
          <Text style={styles.list}>⚠️ Güneş ışığı, nem ve yüksek ısı iyot miktarını azaltabilir.</Text>
          <Text style={styles.list}>⚠️ İyot, koyu renkli ve kapaklı kaplarda saklanmalıdır.</Text>
        </View>
      </Collapsible>

      {/* 4️⃣ Levotiroksin Kullanımı */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(4)}>
        <Text style={styles.headerText}>4️⃣ Levotiroksin Kullanımı</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 4}>
        <View style={styles.content}>
          <Text>Levotiroksin ilacının emilimini artırmak için şu kurallara dikkat edilmelidir:</Text>
          <Text style={styles.list}>✔️ Kahvaltıdan 60 dakika önce veya akşam yemeğinden 3 saat sonra alınmalıdır.</Text>
          <Text style={styles.list}>✔️ İlaç alındıktan sonra 30-60 dakika boyunca yemek yenmemelidir.</Text>
          <Text style={styles.list}>❌ Reçetesiz satılan takviyeler kullanılmamalıdır.</Text>
          <Text style={styles.list}>❌ Özellikle farmakolojik iyot dozları önerilmez.</Text>
        </View>
      </Collapsible>

      {/* 5️⃣ Levotiroksin ve Beslenme */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(5)}>
        <Text style={styles.headerText}>5️⃣ Levotiroksin ve Beslenme</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 5}>
        <View style={styles.content}>
          <Text>Levotiroksin ile bazı yiyeceklerin ve ilaçların etkileşimi vardır.</Text>
          <Text style={styles.list}>❌ Demir, kalsiyum, yüksek lifli yiyecekler ilacın emilimini azaltabilir.</Text>
          <Text style={styles.list}>❌ İnek sütü ve kahve levotiroksinin etkinliğini düşürebilir.</Text>
          <Text style={styles.list}>⏳ Kalsiyum ve demir takviyeleri ile en az 4 saat arayla alınmalıdır.</Text>
        </View>
      </Collapsible>

      {/* 6️⃣ Levotiroksin ile Tüketilmemesi Gerekenler */}
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(6)}>
        <Text style={styles.headerText}>6️⃣ Levotiroksin ile Tüketilmemesi Gerekenler</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== 6}>
        <View style={styles.content}>
          <Text>Levotiroksin ile aşağıdaki besinlerden kaçınılmalıdır:</Text>
          <Text style={styles.list}>❌ Ceviz, soya unu, demir takviyeleri, kalsiyum takviyeleri.</Text>
          <Text style={styles.list}>❌ Alüminyum, magnezyum içeren antasitler.</Text>
          <Text style={styles.list}>❌ Bazı ülser ilaçları (sukralfat).</Text>
          <Text style={styles.list}>❌ Kolesterol düşürücü ilaçlar.</Text>
          <Text style={styles.list}>❌ Süt, yoğurt, peynir, ıspanak, kırmızı et.</Text>
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

export default NutritionInfo;
