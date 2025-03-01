import React ,{useState}from 'react';
import { View, Text, Button, StyleSheet, ScrollView  } from 'react-native';
import VideoPlayer from './VideoPlayer';
import { useFocusEffect } from '@react-navigation/native';
import BrainInfo from '../utils/BrainInfo';
import { urlTable } from '../navigation/urlTable';

const InfoPage = ({navigation,VideoTitle,isVideoPlaying,InfoComponent}) => {

  
  
      return (
          
          <View style={styles.container}>
              {/** Video Player */}
              <VideoPlayer videoUrl={VideoTitle} isPlaying={isVideoPlaying} />
              <InfoComponent/>
           <Button title='Go To Home' onPress={() => navigation.navigate('Home')} />
  
          </View>
      )

};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
});


export default InfoPage;