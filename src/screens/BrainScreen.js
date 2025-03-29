import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ScrollView,
} from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import { useFocusEffect } from '@react-navigation/native';
import BrainInfo from '../utils/BrainInfo';
import { Ionicons } from '@expo/vector-icons';

const title = 'Brain';

const BrainScreen = () => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            setIsVideoPlaying(true);
            return () => setIsVideoPlaying(false);
        }, [])
    );

    const brainGames = [
        {
            title: 'Kelime Bulmaca (Razzle)',
            url: 'https://api.razzlepuzzles.com/wordsearch?locale=tr',
            icon: 'search',
        },
        {
            title: 'Sudoku',
            url: 'https://www.sudoku.name/',
            icon: 'grid',
        },
        {
            title: 'Bulmaca Sayfası (Bioofset)',
            url: 'https://bioofset.com/bulmaca-sayfasi/',
            icon: 'book',
        },
        {
            title: 'Zeka Oyunları (MentalUp)',
            url: 'https://www.mentalup.net/zeka-oyunlari',
            icon: 'game-controller',
        },
    ];

    const openLink = (url) => {
        Linking.openURL(url).catch((err) =>
            console.error('Failed to open URL:', err)
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <VideoPlayer videoUrl={title} isPlaying={isVideoPlaying} />
            <BrainInfo />

            <Text style={styles.sectionTitle}>🧠 {`Zihin Egzersizleri`}</Text>

            <View style={styles.cardsContainer}>
                {brainGames.map((game, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => openLink(game.url)}
                    >
                        <Ionicons name={game.icon} size={26} color="#C6A477" style={styles.icon} />
                        <Text style={styles.cardText}>{game.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAF9F6',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 25,
        marginBottom: 10,
        textAlign: 'center',
    },
    cardsContainer: {
        marginTop: 10,
        gap: 15,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        borderWidth: 1,
        borderColor: '#EEE',
    },
    icon: {
        marginRight: 12,
    },
    cardText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
});

export default BrainScreen;
