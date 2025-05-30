import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// Screens
import PatientHomeScreen from 'screens/patient/PatientHomeScreen';
import PatientVideosScreen from 'screens/patient/PatientVideosScreen';
import HypothyroidInfoScreen from 'screens/patient/HypothyroidInfoScreen';
import ReportsMenuScreen from 'screens/patient/ReportsMenuScreen';
import BrainScreen from 'screens/patient/BrainScreen'; // ✅ Import Brain screen


import NutritionScreen from 'screens/patient/NutritionScreen';
import ExerciseScreen from 'screens/patient/ExerciseScreen';
import StressScreen from 'screens/patient/StressScreen';
import DermatologicalScreen from 'screens/patient/DermatologicalScreen';


import CombinedReportsScreen from 'screens/patient/CombinedReportsScreen';
import TakeMedicineScreen from 'screens/patient/TakeMedicineScreen';
import AvailableFormsScreen from 'screens/patient/AvailableFormsScreen';
import ReportScreen from 'screens/patient/ReportScreen';
import SymptomFormScreen from "screens/patient/SymptomFormScreen";

const Stack = createStackNavigator();

const PatientHomeStack = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PatientHome"
        component={PatientHomeScreen}
        options={{
            headerShown: false, // ✅ Hides the entire top header
          }}
      />

      <Stack.Screen
        name="PatientVideosScreen"
        component={PatientVideosScreen}
        options={{ title: t('videos') }}
      />

      <Stack.Screen
        name="HypothyroidInfo"
        component={HypothyroidInfoScreen}
        options={{ title: t('hypothyroid_info') }}
      />

      <Stack.Screen
        name="ReportsMenuScreen"
        component={ReportsMenuScreen}
        options={{ title: t('reports') }}
      />

      <Stack.Screen
        name="Brain"
        component={BrainScreen}
        options={{ title: t('brain') }} // ✅ Add Brain screen
      />
                  <Stack.Screen name="Nutrition"       component={NutritionScreen} options={{ title: t('nutrition') }} />
            <Stack.Screen name="Exercise"        component={ExerciseScreen} options={{ title: t('exercise') }} />
            <Stack.Screen name="Stress"          component={StressScreen} options={{ title: t('stress') }} />
            <Stack.Screen name="Dermatological"  component={DermatologicalScreen} options={{ title: t('dermatological') }} />


            <Stack.Screen 
        name="CombinedReportsScreen" 
        component={CombinedReportsScreen}
        options={{ title: t('reports') }}
      />
      <Stack.Screen 
        name="TakeMedicineScreen" 
        component={TakeMedicineScreen}
        options={{ title: t('take_medicine') }}
      />
      <Stack.Screen 
        name="AvailableForms" 
        component={AvailableFormsScreen}
        options={{ title: t('available_forms') }}
      />
      <Stack.Screen 
        name="Report" 
        component={ReportScreen}
        options={{ title: t('report') }}
      />
                          <Stack.Screen 
                        name="SymptomForm" 
                        component={SymptomFormScreen} 
                        options={{ drawerItemStyle: { display: 'none' } }} 
                    />
    </Stack.Navigator>
  );
};

export default PatientHomeStack;
