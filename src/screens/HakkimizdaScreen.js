import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

const HakkimizdaScreen = () => {
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>{t('about_us')}</Text>

                <Text style={styles.sectionTitle}> Amacımız</Text>
                <Text style={styles.paragraph}>
                    Bu uygulama, hipotiroidi hastalarının sağlık takibini kolaylaştırmak ve yaşam kalitesini
                    artırmak amacıyla geliştirilmiştir. Bireylerin hastalıkları hakkında bilinçlenmelerini
                    sağlamak, günlük semptom takibini kolaylaştırmak, ilaç alım düzenini hatırlatmak ve uzmanların
                    önerileriyle destek olmak temel hedeflerimizdir.
                </Text>

                <Text style={styles.sectionTitle}>Özellikler</Text>
                <Text style={styles.paragraph}>
                    • Video içerikleri{'\n'}
                    • Semptom yönetimi{'\n'}
                    • Raporlama modülü{'\n'}
                    • İletişim araçları{'\n'}
                    Bu özellikler sayesinde kullanıcılarımızın hem fiziksel hem de zihinsel sağlıklarını desteklemeyi hedefliyoruz.
                </Text>

                <Text style={styles.sectionTitle}> Geri Bildirim</Text>
                <Text style={styles.paragraph}>
                    Geri bildirimleriniz bizim için çok değerli. Daha iyi bir deneyim sunabilmek adına
                    görüşlerinizi bizimle paylaşabilirsiniz.
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginBottom: 10,
        marginTop: 20,
    },
    paragraph: {
        fontSize: 16,
        color: '#333',
        lineHeight: 26,
        textAlign: 'justify',
    },
});

export default HakkimizdaScreen;
