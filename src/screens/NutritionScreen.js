import React ,{useState}from 'react';
import { View, Text, Button, StyleSheet, ScrollView  } from 'react-native';
import VideoPlayer from '../navigation/VideoPlayer';
import { urlTable } from '../navigation/urlTable';
import { useFocusEffect } from '@react-navigation/native';
import NutritionInfo from '../utils/NutritionInfo';
const NutritionScreen = ({ navigation }) => {

const url = urlTable.find(item => item.type   === 'Nutrition').url;
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
                      <VideoPlayer videoUrl={url} isPlaying={isVideoPlaying} />

        <NutritionInfo/>
            
                 <Button title='Go To Home' onPress={() => navigation.navigate('Home')} />
            
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