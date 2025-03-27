import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import infoCardStyles from '../styles/infoCardStyles'; // ✅ import shared styles

const ExcersiseInfo = () => {
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

// ✅ keep your sections array as-is
const sections = [
  {
    id: 1,
    title: '1️⃣ Egzersizin Önemi',
    content: [
      'Hipotiroidi tedavisinde TSH seviyesini dengelemek esastır, ancak hastalar yorgunluk ve kilo alma gibi sorunlar yaşayabilir.',
      '✅ Egzersiz, enerji seviyelerini yükseltmeye ve yaşam kalitesini artırmaya yardımcı olabilir.',
      '✔ Aerobik ve direnç egzersizleri fiziksel ve ruhsal sağlığa olumlu katkılar sağlar.'
    ]
  },
  {
    id: 2,
    title: '2️⃣ Yavaş Başlangıçla Aerobik Egzersiz',
    content: [
      'Aerobik egzersizler kalp sağlığını iyileştirir, metabolizmayı hızlandırır ve kilo kontrolüne yardımcı olur.',
      '✔ Egzersiz Tipi: Yürüyüş, düşük tempolu bisiklet, yüzme, hafif koşu',
      '✔ Sıklık: Haftada 3-5 gün',
      '✔ Süre: 20-30 dakika, zamanla artırılabilir.',
      '✔ Yoğunluk: Düşük - orta seviye',
      '⚠ Eğer aşırı yorgunluk hissediliyorsa, egzersiz süresi azaltılmalıdır.'
    ]
  },
  {
    id: 3,
    title: '3️⃣ Güçlendirme (Ağırlıksız) Egzersizleri',
    content: [
      'Hipotiroidi hastalarında kas zayıflığı yaygın görülebilir. Ağırlıksız egzersizler, kasları zorlamadan güçlendirmek için idealdir.',
      '✔ Egzersiz Tipi: Vücut ağırlığıyla yapılan squat, lunges, plank, direnç bandı egzersizleri',
      '✔ Sıklık: Haftada 2-3 gün',
      '✔ Süre: 15-30 dakika',
      '✅ Önerilen Hareketler: (Videoda hareketler gösterilmektedir.)',
      '🔹 Squat: Sırt düz olacak şekilde bacakları 90 derece bükerek çömelme',
      '🔹 Lunge: Adım atarak yapılan hareket; dizler 90 derece olmalı',
      '🔹 Plank: Yüz üstü yere paralel durarak, karın kaslarını çalıştırma'
    ]
  },
  {
    id: 4,
    title: '4️⃣ Esneme ve Mobilite Egzersizleri',
    content: [
      'Hipotiroidi kaslarda sertlik ve ağrıya neden olabilir. Düzenli esneme hareketleri kasları rahatlatabilir.',
      '✔ Egzersiz Tipi: Yoga, Pilates, basit esneme hareketleri',
      '✔ Sıklık: Haftada 2-3 gün',
      '✔ Süre: 10-20 dakika',
      '✅ Önerilen Hareketler: (Videoda hareketler gösterilmektedir.) ',
      '🔹 Child’s Pose: Dizler üzerinde oturup öne eğilerek sırtın gerilmesi',
      '🔹 Kedi-İnek Hareketi: Sırtı yukarı ve aşağı hareket ettirme',
      '🔹 Öne Eğilme: Ellerle yere uzanarak sırtı esnetme'
    ]
  },
  {
    id: 5,
    title: '5️⃣ Mental Sağlık İçin Egzersiz',
    content: [
      'Hipotiroidi hastalarında ruh hali değişiklikleri ve depresyon görülebilir. Egzersiz, endorfin salgılanmasını artırarak ruh halini iyileştirir.',
      '✔ Egzersiz Tipi: Yürüyüş, yoga, meditasyon, nefes egzersizleri',
      '✔ Sıklık: Günlük',
      '✔ Süre: 10-30 dakika'
    ]
  }
];
export default ExcersiseInfo;
