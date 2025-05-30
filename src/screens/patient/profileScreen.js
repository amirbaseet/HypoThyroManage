import React ,{useState}from 'react';
import { View, Text, Button, StyleSheet, ScrollView  } from 'react-native';
import VideoPlayer from 'components/VideoPlayer';
import { useFocusEffect } from '@react-navigation/native';
const title = 'stress';

const ProfileScreen = ({ navigation }) => {
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

    <ScrollView style={styles.Textcontainer}>


    {/* Scrollable Content */}
      {/* Main Heading */}
      <Text style={styles.heading}>Stres Yönetimi</Text>

      {/* Section 1 */}
      <Text style={styles.subHeading}>Tiro-Stres Yönetimi</Text>
      <Text style={styles.paragraph}>
        Eğitim, danışmanlık ve destek üçlüsü ile Tiro-stresin yönetimi mümkündür ve farmakolojik desteğe gerek yoktur.
      </Text>

      <Text style={styles.bold}>Ana Unsurlar:</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>• Aktif dinleme</Text>
        <Text style={styles.listItem}>• Empatik açıklama</Text>
        <Text style={styles.listItem}>• Yanlış bilgilerin filtrelenmesi</Text>
      </View>

      {/* Section 2 */}
      <Text style={styles.subHeading}>Kanıta Dayalı Stres Yönetimi Teknikleri</Text>

      <Text style={styles.bold}>1. Progresif Kas Gevşemesi</Text>
      <Text style={styles.paragraph}>
        Kas gruplarını kasma ve gevşetme sürecidir. Günde 2-3 kez, 15-20 dakika uygulanabilir.
      </Text>

      <Text style={styles.bold}>2. Diyafram Solunumu</Text>
      <Text style={styles.paragraph}>
        Nefes alırken göğüs yerine karın genişletilir. Stresi azaltmada etkili olduğu gösterilmiştir.
      </Text>

      <Text style={styles.bold}>3. Egzersiz</Text>
      <Text style={styles.paragraph}>
        Egzersiz yapmak stresi %14 oranında azaltabilir. Haftada en az 150 dakika önerilmektedir.
      </Text>

      {/* APA Recommendations */}
      <Text style={styles.subHeading}>APA'nın Stresle Başa Çıkma Tavsiyeleri</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>• Sosyal desteği artır</Text>
        <Text style={styles.listItem}>• İyi beslen</Text>
        <Text style={styles.listItem}>• Meditasyon yap</Text>
        <Text style={styles.listItem}>• Uyku düzenini koru</Text>
        <Text style={styles.listItem}>• Fiziksel olarak aktif ol</Text>
        <Text style={styles.listItem}>• Doğada vakit geçir</Text>
        <Text style={styles.listItem}>• Profesyonel destek al</Text>
      </View>
    </ScrollView>       
         <Button title='Go To Home' onPress={() => navigation.navigate('Home')} />

        </View>
    );
}

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

export default ProfileScreen;
