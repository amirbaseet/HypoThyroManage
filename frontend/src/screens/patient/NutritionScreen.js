import React ,{useState}from 'react';
import { View, Button, StyleSheet  } from 'react-native';
import VideoPlayer from 'components/VideoPlayer';
import { useFocusEffect } from '@react-navigation/native';
import NutritionInfo from 'utils/NutritionInfo';


const title = 'Nutrition';
const NutritionScreen = ({ navigation }) => {

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
                      <VideoPlayer videoType={title} isPlaying={isVideoPlaying} />

        <NutritionInfo/>
            
            
</View>
    )

};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    Textcontainer:{
            flex: 1,
            backgroundColor: "#fff",
            padding: 16,
    },
      heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 10,
      },
      subHeading: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#555",
        marginTop: 10,
      },
      paragraph: {
        fontSize: 16,
        color: "#444",
        lineHeight: 24,
        marginBottom: 8,
      },
      bold: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        marginTop: 10,
      },
      list: {
        marginVertical: 8,
      },
      listItem: {
        fontSize: 16,
        color: "#444",
        marginLeft: 10,
        marginVertical: 2,
      },});

export default NutritionScreen;