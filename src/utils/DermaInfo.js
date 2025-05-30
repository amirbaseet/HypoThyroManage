import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import infoCardStyles from 'styles/infoCardStyles'; // ✅ Shared style

const DermaInfo = () => {
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
    title: '1️⃣ Tiroid Bozuklukları ve Cilt Sağlığı',
    content: [
      'Hormonal dengesizlikler ve dermatolojik durumlar arasında güçlü bir ilişki vardır.',
      '✔ Tiroid bozuklukları, cilt hastalıklarıyla sıkça ilişkilidir.',
      '✔ Tiroid hormonları; cilt bariyeri fonksiyonu, deride yenilenme ve saç büyümesini etkiler.',
    ],
  },
  {
    id: 2,
    title: '2️⃣ Hipotiroidizm ve Cilt Üzerindeki Etkileri',
    content: [
      'Hipotiroidizm, ciltte ve tırnaklarda belirgin değişikliklere neden olabilir.',
      '✔ Cilt kuruluğu, atopik dermatit ve ciltte renk dağılımı bozuklukları yaygındır.',
      '✔ Otoimmün (yani bağışıklık sisteminin kendi vücut dokularına saldırdığı) mekanizmalar, cilt semptomlarını şiddetlendirebilir.',
      '✔ Levotiroksin tedavisi, ciltte görülen semptomları hafifletebilir.',
    ],
  },
  {
    id: 3,
    title: '3️⃣ Cilt Sağlığı İçin Dermatolojik Tavsiyeler',
    content: [
      '🌿 Cilt sağlığını destekleyen bazı doğal çözümler önerilmektedir:',
      '✔ Acı biber veya biberiye içeren solüsyonlar: Kan akışını uyararak cildin beslenmesini artırır.',
      '✔ Üzüm çekirdeği yağı: Saç foliküllerinde hücre bölünmesini destekler.',
      '✔ Seramidler: Cilt bariyerini güçlendirerek nem kaybını önler.',
      '✔ Hindistan cevizi, ayçiçeği çekirdeği, jojoba, üzüm çekirdeği ve argan yağı: Cildi besler ve onarır.',
      '⚠ Oleik asit oranı yüksek yağlar cilt bariyerine zarar verebilir; soğuk preslenmiş ürünler tercih edilmelidir.',
    ],
  },
  {
    id: 4,
    title: '4️⃣ Cilt Bariyerini Kuvvetlendiren Uygulamalar',
    content: [
      '💧 Cilt bariyerinin korunması için en iyi yaklaşımlar:',
      '✔ Seramid içeren nemlendiriciler, cilt bariyerini onarır ve su kaybını azaltır.',
      '✔ Doğal yağlar (jojoba, argan, üzüm çekirdeği vb.), cilt bariyerini güçlendirir ve nemlendirir.',
      '✔ Üre içeren kremler, atopik dermatitli ve kuru ciltler için etkili bir bileşendir.',
    ],
  },
];


export default DermaInfo;
