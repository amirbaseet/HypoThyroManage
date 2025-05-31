import React, { useRef, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { Video, Audio } from 'expo-av';
import { urlTable } from 'constants/urlTable';
const { width, height } = Dimensions.get('window');
export const goHome =() => navigation.navigate('Home');

const VideoPlayer = ({ videoUrl, isPlaying }) => {
    const videoRef = useRef(null);
    const url = urlTable.find(item => item.type   === videoUrl).url;

    useEffect(() => {
        const setupAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });
            } catch (error) {
                console.log("Audio Mode Error:", error);
            }
        };
        setupAudio();
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.setStatusAsync({ shouldPlay: isPlaying });
        }
    }, [isPlaying]);

    return (
        <View>
            <Video
                ref={videoRef}
                source={{ uri: url }}
                style={{ width: width, height: height * 0.3, backgroundColor: 'black' }}
                useNativeControls
                resizeMode='contain'
                shouldPlay={isPlaying}
                isLooping
                onError={(error) => console.log('Video Error:', error)}
            />
        </View>
    );
};

export default VideoPlayer;
