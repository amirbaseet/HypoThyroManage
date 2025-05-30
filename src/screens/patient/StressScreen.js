import React ,{useState}from 'react';
import { View, Button, StyleSheet  } from 'react-native';
import VideoPlayer from 'components/VideoPlayer';
import { useFocusEffect } from '@react-navigation/native';

import StressInfo from 'utils/StressInfo';
const title = 'stress';


const StressScreen = ({ navigation }) => {
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
              <VideoPlayer videoUrl={title} isPlaying={isVideoPlaying} />
  
          <StressInfo/>
  
  
          </View>
      )

};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
});


export default StressScreen;