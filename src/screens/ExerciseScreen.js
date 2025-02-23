import React ,{useState}from 'react';
import { View, Text, Button, StyleSheet, ScrollView  } from 'react-native';
import VideoPlayer from '../navigation/VideoPlayer';
import { urlTable } from '../navigation/urlTable';
import { useFocusEffect } from '@react-navigation/native';
import ExcersiseInfo from '../utils/ExcersiseInfo';

const url = urlTable.find(item => item.type   === 'Exercise').url;

const ExerciseScreen = ({navigation}) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(true); // State to control video playback

    // Stop video when navigating away
    useFocusEffect(
        React.useCallback(() => {
            setIsVideoPlaying(true); // Play video when screen is focused
            return () => setIsVideoPlaying(false); // Stop video when screen loses focus
        }, [])
    );
  
  
      return (
          
          <View style={styles.container}>
              {/** Video Player */}
              <VideoPlayer videoUrl={url} isPlaying={isVideoPlaying} />
              <ExcersiseInfo/>
           <Button title='Go To Home' onPress={() => navigation.navigate('Home')} />
  
          </View>
      )

};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
});



export default ExerciseScreen;