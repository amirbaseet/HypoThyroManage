import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

const HypothyroidInfoScreen = () => {
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.titleBox}>
                    <Text style={styles.title}>{t('hypothyroid_info')}</Text>
                </View>

                <View style={styles.paragraphBox}>
                    <Text style={styles.paragraph}>
                        Hipotiroidi, tiroid bezinin yeterince çalışmaması durumudur. Tiroid bezi, boynumuzda bulunan ve
                        vücudun enerji dengesini, metabolizmasını kontrol eden bir bezdir. Bu bez az çalıştığında,
                        vücut yavaşlar. Bu yüzden kişi kendini sürekli yorgun, halsiz hisseder, kilo alabilir,
                        cildi kurur, saçları dökülebilir ve üşümeye başlar. Ayrıca kabızlık, depresif ruh hali
                        ve unutkanlık gibi sorunlar da görülebilir. Tedavisi genelde eksik olan hormonu yerine
                        koymakla yapılır ve düzenli ilaç kullanımıyla kontrol altına alınabilir.
                    </Text>

                    <Text style={styles.paragraph}>
                        Hastalığın sizi rahatsız eden etkilerini hafifletmek için sadece ilaç alımı her zaman yeterli değildir.
                        Semptom yönetimi, hastalığın sizi rahatsız eden etkilerini hafifletmek için yapılan bir destektir.
                        Hipotiroidi hastalarında, hastalık belirtilerini (semptom) yönetmek için, bir çok bilimsel tavsiye vardır.
                        Bunlar beslenme tavsiyeleri, egzersiz planı, stres yönetimi, dermatalojik tavsiyeler, beyin egzersizleri
                        ana başlıklarında toplanabilir. Bu tavsiyelere uymak, kişinin hem bedensel hem de ruhsal sağlığını
                        koruması için çok önemlidir.
                    </Text>
                </View>
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
    titleBox: {
        backgroundColor: '#D0EBFF',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E3A8A',
        textAlign: 'center',
    },
    paragraphBox: {
        backgroundColor: '#E7F9ED',
        padding: 16,
        borderRadius: 12,
    },
    paragraph: {
        fontSize: 16,
        fontFamily: 'SourceSans3-Regular',
        color: '#333',
        marginBottom: 20,
        lineHeight: 26,
        textAlign: 'justify',
    },
});

export default HypothyroidInfoScreen;
