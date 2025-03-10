import React ,{useState}from 'react';
import { View,  Button, StyleSheet  } from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import { useFocusEffect } from '@react-navigation/native';
import ExcersiseInfo from '../utils/ExcersiseInfo';


const ExerciseScreen = ({navigation}) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(true); // State to control video playback
    const title = 'Exercise';
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
              <VideoPlayer videoUrl={title} isPlaying={isVideoPlaying} />
              <ExcersiseInfo/>
           <Button title='Go To Home'  onPress={() => navigation.navigate('Home')} />
  
          </View>
      )

};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
});



export default ExerciseScreen;