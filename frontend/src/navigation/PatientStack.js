// navigation/PatientStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import PatientVideosScreen from 'screens/patient/PatientVideosScreen';
import NutritionScreen from 'screens/patient/NutritionScreen';
import ExerciseScreen from 'screens/patient/ExerciseScreen';
import StressScreen from 'screens/patient/StressScreen';
import DermatologicalScreen from 'screens/patient/DermatologicalScreen';
import BrainScreen from 'screens/patient/BrainScreen';
import HypothyroidInfoScreen from 'screens/patient/HypothyroidInfoScreen';

const Stack = createStackNavigator();

const PatientStack = () => {
    const { t } = useTranslation();

    return (
        <Stack.Navigator initialRouteName="PatientVideosScreen">
            <Stack.Screen name="PatientVideosScreen" component={PatientVideosScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Nutrition"       component={NutritionScreen} options={{ title: t('nutrition') }} />
            <Stack.Screen name="Exercise"        component={ExerciseScreen} options={{ title: t('exercise') }} />
            <Stack.Screen name="Stress"          component={StressScreen} options={{ title: t('stress') }} />
            <Stack.Screen name="Dermatological"  component={DermatologicalScreen} options={{ title: t('dermatological') }} />
            <Stack.Screen name="Brain"           component={BrainScreen} options={{ title: t('brain') }} />
            <Stack.Screen name="HypothyroidInfo" component={HypothyroidInfoScreen} options={{ title: t('hypothyroid_info') }} 
/>
            
        </Stack.Navigator>
    );
};

export default PatientStack;
