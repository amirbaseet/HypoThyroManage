import React, {useRef, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import {Video} from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window'); // Get full screen width

const ProfileScreen =({navigation})=>{
    const videoRef = useRef(null);
    // Pause video when screen loses focus
    useFocusEffect(
        useCallback(() => {
            return () => {
                if (videoRef.current) {
                    videoRef.current.pauseAsync();
                }
            };
        }, [])
    );

    return(
        <View style ={styles.container}>
            {/**VIdeo Player */}
            <Video
            ref={videoRef}
            // source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }} // Replace with your video URL
            // source={{ uri: 'https://drive.google.com/uc?export=download&id=1TMbpiD5Xnt5uNMniDq2mxoGfloN79FaV' }} 
            source={{ uri: 'https://www.dropbox.com/scl/fi/0s3dmrt0tkurvrfxb95j5/test.mp4?rlkey=zqrjej8v5syzyimqbp8m4hyl3&st=rh9iaenf&raw=1' }} 
            style={styles.video}
            useNativeControls
            resizeMode='contain'
            shouldPlay
            isLooping
            onError={(error) => console.log('Video Error:', error)}
            />
            
                        {/* Paragraph Below Video */}
                        <Text style={styles.paragraph}>
                This is a sample paragraph below the video. You can add more text here to describe the video content or provide additional details.
            </Text>

            <Button title='Go To Home' onPress={() => navigation.navigate('Home')}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{flex:1,backgroundColor:'#fff'},
    video:{ width:width, height: height * 0.3, backgroundColor: 'black',

    },
})

export default ProfileScreen;