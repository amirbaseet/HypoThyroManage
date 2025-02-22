import React, { useRef, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { Video, Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

const VideoPlayer = ({ videoUrl }) => {
    const videoRef = useRef(null);

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

    return (
        <View>
            <Video
                ref={videoRef}
                source={{ uri: videoUrl }}
                style={{ width: width, height: height * 0.3, backgroundColor: 'black' }}
                useNativeControls
                resizeMode='contain'
                shouldPlay
                isLooping
                onError={(error) => console.log('Video Error:', error)}
            />
        </View>
    );
};

export default VideoPlayer;
