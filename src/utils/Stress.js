import React from "react";
import { View, Text, ScrollView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card } from "react-native-paper";

const HomeScreen = () => (
  <ScrollView style={{ padding: 20 }}>
    <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
      Stres Yönetimi
    </Text>
    <Text>
      Tiroid hastalıklarında stresin yönetimi eğitim, danışmanlık ve destek
      üçlüsüyle mümkündür. Bu uygulama, kanıta dayalı stres yönetimi
      tekniklerini ve APA’nın stresle başa çıkma tavsiyelerini sunar.
    </Text>
  </ScrollView>
);

const TechniquesScreen = () => (
  <ScrollView style={{ padding: 20 }}>
    <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
      Kanıta Dayalı Stres Yönetimi Teknikleri
    </Text>
    {["Yoga ve Bütüncül Yaklaşım", "Progresif Kas Gevşemesi", "Diyafram Solunumu", "Egzersiz ve Stres Yönetimi"].map((technique, index) => (
      <Card key={index} style={{ marginBottom: 10, padding: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{technique}</Text>
      </Card>
    ))}
  </ScrollView>
);

const APATipsScreen = () => (
  <ScrollView style={{ padding: 20 }}>
    <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
      APA’nın Stresle Başa Çıkma Tavsiyeleri
    </Text>
    {["Stres faktörlerini azaltma", "Sosyal destek geliştirme", "Dengeli beslenme", "Meditasyon yapma", "Uyku düzenini koruma", "Egzersiz yapma", "Doğada vakit geçirme", "Keyifli aktiviteler yapma", "Düşünceyi yeniden çerçeveleme", "Profesyonel yardım alma"].map((tip, index) => (
      <Card key={index} style={{ marginBottom: 10, padding: 15 }}>
        <Text style={{ fontSize: 18 }}>{tip}</Text>
      </Card>
    ))}
  </ScrollView>
);

const Tab = createBottomTabNavigator();

const Stress = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Ana Sayfa"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Teknikler"
          component={TechniquesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="meditation" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="APA Tavsiyeleri"
          component={APATipsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="lightbulb" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Stress;
