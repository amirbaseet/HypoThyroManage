import React, {useRef} from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import {Video} from 'expo-av';

const { width, height } = Dimensions.get('window'); // Get full screen width

const ProfileScreen =({navigation})=>{
    const videoRef = useRef(null);

    return(
        <View style ={styles.container}>
            {/**VIdeo Player */}
            <Video
            ref={videoRef}
            source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }} // Replace with your video URL
            style={styles.video}
            useNativeControls
            resizeMode='contain'
            isLooping
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