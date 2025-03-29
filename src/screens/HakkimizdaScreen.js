import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

const HakkimizdaScreen = () => {
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>{t('about_us')}</Text>

                <Text style={styles.paragraph}>
                    Merhaba,{"\n"}
                    Bu uygulama “Hipotiroidi Hastalarında Semptomların Yönetimine Yönelik Geliştirilen Mobil Uygulamanın Etkisinin İncelenmesi” başlıklı doktora tez çalışması kapsamında geliştirilmiştir. Uygulama içeriği oluşturulurken bilimsel araştırmalar incelenmiştir ve alanında uzman akademisyenlerin görüşleri alınmıştır. Oluşturulan video çekimlerinde ise akademisyenler ve uzmanlardan destek alınmıştır. Bu mobil uygulamanın hazırlanmasında amaç; hastalık şiddetini hafifletmek ve hastalıkla ilgili semptomlarınızı yönetmenize yardımcı olmaktır. {"\n\n"}
                    Sizler için faydalı olması dileklerimizle,{"\n"}
                    Sevgi ve saygılarımızla.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 25,
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 16,
        fontFamily: 'SourceSans3-Regular', 
        color: '#333',
        lineHeight: 26,
        textAlign: 'justify',
    },
});

export default HakkimizdaScreen;
