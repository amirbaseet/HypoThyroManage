import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import infoCardStyles from '../styles/infoCardStyles'; // ✅ shared styles

const StressInfo = () => {
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
                <Text
                  key={idx}
                  style={
                    line.startsWith('✔️') ||
                    line.startsWith('✅') ||
                    line.startsWith('🔹') ||
                    line.startsWith('⚠️') ||
                    line.startsWith('📌')
                      ? infoCardStyles.list
                      : infoCardStyles.contentText
                  }
                >
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
    title: '1️⃣ Tiro-Stresin Yönetimi',
    content: [
      'Tiro-stres yönetimi, **eğitim, danışmanlık ve destek** üçlüsüyle mümkündür ve farmakolojik desteğe gerek yoktur.',
      '✔️ Aktif Dinleme: Hastanın endişelerini dinleyerek güven sağlar.',
      '✔️ Empatik Açıklama: Doğru bilgi verirken duygusal ihtiyaçları anlar.',
      '✔️ Yanlış Bilgilerin Filtrelenmesi: Bilimsel verilere dayalı doğru bilgileri sağlar.',
    ]
  },
  {
    id: 2,
    title: '2️⃣ Yoga ve Bütüncül Yaklaşım',
    content: [
      'Hipotiroidili hastalara uygulanan yoga ve bütüncül yaklaşımlar, TSH seviyelerini düşürerek semptomları iyileştirebilir.',
      '✔️ Çalışma: Günde 60 dakika, haftada 5 gün, 3 ay boyunca yoga yapan hastalarda:',
      '✅ Depresyon ve stres seviyelerinde azalma',
      '✅ Yorgunluk ve anksiyete azalması',
      '✅ HDL (iyi kolesterol) seviyelerinde artış',
    ]
  },
  {
    id: 3,
    title: '3️⃣ Hipotiroidizm ve Depresyon Bağlantısı',
    content: [
      'Hipotiroidizm ve depresyon arasında bir bağlantı vardır.',
      '🔹 Serotonin ve Somatostatin hormonları, hipotiroidi hastalarında ruh halini etkileyebilir.',
      '✔️ Hipotiroidizmin tedavi edilmesi, depresyon belirtilerini azaltabilir.',
    ]
  },
  {
    id: 4,
    title: '4️⃣ Kanıta Dayalı Stres Yönetimi Teknikleri',
    content: [
      '✅ Progresif Kas Gevşemesi:',
      '🔹 Kas gruplarını sırasıyla kasma ve gevşetme tekniğidir.',
      '🔹 Günde 2-3 kez, 15-20 dakika uygulanabilir.',
      '✅ Diyafram Solunumu:',
      '🔹 Burundan derin nefes alıp ağızdan yavaşça verme tekniğidir.',
      '🔹 Gerginliği azaltarak stresle baş etmeye yardımcı olur.',
      '📌 Bilimsel Kanıtlar:',
      '✔️ Nefes egzersizleri stresi ve kaygıyı azaltabilir.',
      '✔️ Günde en az 5 dakika uygulanması önerilir.',
    ]
  },
  {
    id: 5,
    title: '5️⃣ Egzersiz ve Stres Yönetimi',
    content: [
      'Egzersiz, stres yönetimi için etkili bir araçtır.',
      '✔️ Kapalı alanda yapılan egzersiz mental stresi %14 oranında azaltabilir.',
      '✔️ Amerikan Psikoloji Derneği\'ne (APA) göre, insanların %47\'si stresle başa çıkmak için yürüyüş yapmaktadır.',
    ]
  },
  {
    id: 6,
    title: '6️⃣ APA Stres Yönetimi Tavsiyeleri',
    content: [
      '🔹 Stres faktörlerini ortadan kaldırmaya çalışın.',
      '🔹 Sosyal destek geliştirin.',
      '🔹 İyi beslenme ve düzenli uyku alışkanlıkları oluşturun.',
      '🔹 Kas gevşetme ve meditasyon yapın.',
      '🔹 Dışarıda vakit geçirin ve sevdiğiniz aktiviteleri yapın.',
      '🔹 Stresle baş edemiyorsanız, profesyonel destek alın.',
    ]
  }
];

export default StressInfo;
