// navigation/PatientStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import PatientMenuScreen from '../screens/PatientMenuScreen';
import NutritionScreen from '../screens/NutritionScreen';
import ExerciseScreen from '../screens/ExerciseScreen';
import StressScreen from '../screens/StressScreen';
import DermatologicalScreen from '../screens/DermatologicalScreen';
import BrainScreen from '../screens/BrainScreen';

const Stack = createStackNavigator();

const PatientStack = () => {
    const { t } = useTranslation();

    return (
        <Stack.Navigator initialRouteName="PatientMenuScreen">
            <Stack.Screen name="PatientMenuScreen" component={PatientMenuScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Nutrition" component={NutritionScreen} options={{ title: t('nutrition') }} />
            <Stack.Screen name="Exercise" component={ExerciseScreen} options={{ title: t('exercise') }} />
            <Stack.Screen name="Stress" component={StressScreen} options={{ title: t('stress') }} />
            <Stack.Screen name="Dermatological" component={DermatologicalScreen} options={{ title: t('dermatological') }} />
            <Stack.Screen name="Brain" component={BrainScreen} options={{ title: t('brain') }} />
        </Stack.Navigator>
    );
};

export default PatientStack;
