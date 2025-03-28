// screens/HakkimizdaScreen.js
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
                    Bu uygulama, hipotiroidi hastalarının sağlık takibini kolaylaştırmak ve yaşam kalitesini
                    artırmak amacıyla geliştirilmiştir. Amacımız, bireylerin hastalıkları hakkında bilinçlenmelerini
                    sağlamak, günlük semptom takibini kolaylaştırmak, ilaç alım düzenini hatırlatmak ve uzmanların
                    önerileriyle destek olmaktır.
                </Text>
                <Text style={styles.paragraph}>
                    Uygulama; video içerikleri, semptom yönetimi, raporlama ve iletişim modülleri ile kullanıcıların
                    hem fiziksel hem de zihinsel sağlıklarını desteklemeyi hedefler.
                </Text>
                <Text style={styles.paragraph}>
                    Geri bildirimleriniz bizim için çok değerli. Daha iyi bir deneyim sunabilmek adına görüşlerinizi
                    bizimle paylaşabilirsiniz.
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 20,
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginBottom: 15,
    },
});

export default HakkimizdaScreen;
