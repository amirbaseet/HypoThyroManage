import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { Video, Audio } from 'expo-av';
import { urlTable } from 'constants/urlTable';
import { getVideoUrl } from 'services/videoService';

const { width, height } = Dimensions.get('window');

const VideoPlayer = ({ videoType, isPlaying }) => {
  const videoRef = useRef(null);
  const [videoSource, setVideoSource] = useState(null);
  const [loading, setLoading] = useState(true); // Spinner state

  // Audio setup
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

  // Fetch video URL
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        console.log("Fetching video for type:", videoType);
      
        const url = await getVideoUrl(videoType);

        if (url) {
          setVideoSource(url);
        } else {
          const localUrl = urlTable.find(item => item.type === videoType)?.url;
          if (localUrl) {
            console.log("Using local fallback URL.");
            setVideoSource(localUrl);
          } else {
            console.log("No video found in backend or local.");
            setVideoSource(null);
          }
        }
      } catch (error) {
        console.error('Error fetching video URL:', error);
        const localUrl = urlTable.find(item => item.type === videoType)?.url;
        if (localUrl) {
          console.log("Using local fallback URL due to error.");
          setVideoSource(localUrl);
        } else {
          console.log("No video found in backend or local.");
          setVideoSource(null);
        }
      }
    };

    fetchVideoUrl();
  }, [videoType]);

  // Play control
  useEffect(() => {
    if (videoRef.current && videoSource) {
      videoRef.current.setStatusAsync({ shouldPlay: isPlaying });
    }
  }, [isPlaying, videoSource]);

  if (!videoSource) {
    return (
      <View style={[styles.videoFrame, styles.centered]}>
        <Text>No video available</Text>
      </View>
    );
  }

  return (
    <View style={styles.videoFrame}>
      <Video
        ref={videoRef}
        source={{ uri: videoSource }}
        style={styles.videoFrame}
        useNativeControls
        resizeMode="contain"
        shouldPlay={isPlaying}
        isLooping
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
        onBuffer={({ isBuffering }) => setLoading(isBuffering)}
        onError={(error) => console.log("Video Error:", error)}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#C6A477" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  videoFrame: {
    width: width,
    height: height * 0.3,
    backgroundColor: 'black',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});

export default VideoPlayer;
