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
import infoCardStyles from '../styles/infoCardStyles'; // ✅ import shared styles

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
const sections = [
  {
    id: 1,
    title: '1️⃣ Beslenme Tavsiyesi',
    content: [
      'Hipotiroidizm hastaları vitamin, mineral, demir, iyot ve selenyum açısından zengin bir diyet uygulamalıdır.',
      '✔️ Süt ürünleri, yumurta, balık, et, meyve ve sebze tüketilmelidir.',
      '❌ Guatrojenik yiyeceklerden kaçınılmalıdır: brokoli, lahana, karnabahar, turp, şalgam.',
    ],
  },
  {
    id: 2,
    title: '2️⃣ Selenyumun Önemi',
    content: [
      'Selenyum, tiroid bezinin korunması ve metabolizması için gereklidir.',
      '✔️ En iyi kaynakları: Et, süt ürünleri, tahıllar ve deniz ürünleri.',
      '⚠️ Fazla tüketimi toksik olabilir, doktor kontrolünde alınmalıdır.',
    ],
  },
  {
    id: 3,
    title: '3️⃣ İyotun Önemi',
    content: [
      'İyot, tiroid hormonlarının üretimi için gereklidir.',
      '✔️ İyot Kaynakları: Deniz yosunu, balık, deniz ürünleri, iyotlu tuz, süt ürünleri.',
      '⚠️ Güneş ışığı, nem ve yüksek ısı iyot miktarını azaltabilir.',
      '⚠️ İyot, koyu renkli ve kapaklı kaplarda saklanmalıdır.',
    ],
  },
  {
    id: 4,
    title: '4️⃣ Levotiroksin Kullanımı',
    content: [
      'Levotiroksin ilacının emilimini artırmak için şu kurallara dikkat edilmelidir:',
      '✔️ Kahvaltıdan 60 dakika önce veya akşam yemeğinden 3 saat sonra alınmalıdır.',
      '✔️ İlaç alındıktan sonra 30-60 dakika boyunca yemek yenmemelidir.',
      '❌ Reçetesiz satılan takviyeler kullanılmamalıdır.',
      '❌ Özellikle farmakolojik iyot dozları önerilmez.',
    ],
  },
  {
    id: 5,
    title: '5️⃣ Levotiroksin ve Beslenme',
    content: [
      'Levotiroksin ile bazı yiyeceklerin ve ilaçların etkileşimi vardır.',
      '❌ Demir, kalsiyum, yüksek lifli yiyecekler ilacın emilimini azaltabilir.',
      '❌ İnek sütü ve kahve levotiroksinin etkinliğini düşürebilir.',
      '⏳ Kalsiyum ve demir takviyeleri ile en az 4 saat arayla alınmalıdır.',
    ],
  },
  {
    id: 6,
    title: '6️⃣ Levotiroksin ile Tüketilmemesi Gerekenler',
    content: [
      'Levotiroksin ile aşağıdaki besinlerden kaçınılmalıdır:',
      '❌ Ceviz, soya unu, demir takviyeleri, kalsiyum takviyeleri.',
      '❌ Alüminyum, magnezyum içeren antasitler.',
      '❌ Bazı ülser ilaçları (sukralfat).',
      '❌ Kolesterol düşürücü ilaçlar.',
      '❌ Süt, yoğurt, peynir, ıspanak, kırmızı et.',
    ],
  },
];

const NutritionInfo = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollView style={infoCardStyles.container}>
      <Text style={infoCardStyles.screenTitle}>🍽️ Beslenme Rehberi</Text>

      {sections.map((section) => (
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
