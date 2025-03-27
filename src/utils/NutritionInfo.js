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
      '✔ Süt ürünleri, yumurta, balık, et, meyve ve sebze tüketilmelidir.',
      '❌ Guatrojenik yiyecekleri çok fazla tüketmekten kaçınılmalıdır. Bu yiyecekler; brokoli, lahana, karnabahar, turp, şalgamdır.',
    ],
  },
  {
    id: 2,
    title: '2️⃣ Selenyumun Önemi',
    content: [
      'Selenyum, tiroid bezinin korunması ve metabolizması için gereklidir.',
      '✔ En iyi kaynakları: Et, süt ürünleri, tahıllar ve deniz ürünleri.',
      '⚠ Fazla tüketimi toksik olabilir, doktor kontrolünde alınmalıdır. İlaç takviyesi olarak değil, doğal gıdalardan alınmalıdır.',
    ],
  },
  {
    id: 3,
    title: '3️⃣ İyotun Önemi',
    content: [
      'İyot, tiroid hormonlarının üretimi için gereklidir.',
      '✔ İyot Kaynakları: Deniz yosunu, balık, deniz ürünleri, iyotlu tuz, süt ürünleri.',
      '⚠ İyotu haricen solüsyon olarak almamalısınız.',
      '✔ İyotun korunması için şu noktalara dikkat edin:',
      '⚠ İyotlu tuzu ışık görmeyen bir dolapta, koyu renkli ve kapaklı bir kapta saklayın.',
      '⚠ Tuzu yemeklere en son aşamada ekleyin, mümkünse sofrada ilave edin.',
      '⚠ Güneş ışığı, nem ve yüksek ısı iyot miktarını azaltabilir, bu yüzden serin ve kuru bir ortamda saklayın.',
    ],
  },
  {
    id: 4,
    title: '4️⃣ Levotiroksin Kullanımı',
    content: [
      'Levotiroksin ilacının emilimini artırmak için şu kurallara dikkat edilmelidir:',
      '✔ Kahvaltıdan 60 dakika önce veya akşam yemeğinden 3 saat sonra alınmalıdır.',
      '✔ İlaç alındıktan sonra 60 dakika boyunca yemek yenmemelidir.',
      '❌ Reçetesiz satılan takviyeler kullanılmamalıdır.',
      '❌ Özellikle farmakolojik iyot dozları önerilmez.',
    ],
  },
  {
    id: 5,
    title: '5️⃣ Levotiroksin ve Beslenme',
    content: [
      'Şu yiyecekler, levotiroksinle etkileşime girebilir ve ilacın etkisini azaltabilir:',
      '❌ Diyet lifi (taze meyveler, sebzeler, tam tahıllar)',
      '❌ Ceviz',
      '❌ Greyfurt ve greyfurt suyu',
      '❌ Elma ve portakal suyu gibi diğer meyve suları',
      '❌ Kalsiyum açısından zengin besinler (süt ürünleri, yapraklı yeşillikler, sardalya)',
      '❌ Demir açısından zengin besinler (sakatat, ıspanak, sığır eti, sardalya, soya fasulyesi)',
      '❌ Kafeinli içecekler (çay, kahve)',
      '💦 ✅ Günlük sıvı tüketimi de çok önemli. Vücut ağırlığınıza göre kilogram başına 30-35 ml sıvı almanız önerilir. Bu da ortalama olarak günde 1,5-2 litre su içmeniz gerektiği anlamına gelir.',
    ],
  },
  {
    id: 6,
    title: '6️⃣ Levotiroksin ile Tüketilmemesi Gerekenler',
    content: [
      'Şu ilaçları levotiroksinle aynı anda almaktan kaçının:',
      '❌ Demir takviyeleri veya demir içeren multivitaminler',
      '❌ Kalsiyum takviyeleri',
      '❌ Alüminyum, magnezyum veya kalsiyum içeren antiasitler',
      '❌ Bazı ülser ilaçları (örneğin sukralfat, antepsin)',
      '❌ Kolesterol düşürücü bazı ilaçlar (kolestiramin [Prevalite, Locholest], kolestipol [Colestid])',
      '⏳ Bu ilaçları levotiroksinle birlikte almanız gerekiyorsa, aralarında en az 4 saatlik bir zaman farkı bırakın.',
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
