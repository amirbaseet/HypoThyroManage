// navigation/ReportsStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import ReportsMenuScreen from 'screens/patient/ReportsMenuScreen';
import CombinedReportsScreen from 'screens/patient/CombinedReportsScreen';
import TakeMedicineScreen from 'screens/patient/TakeMedicineScreen';
import AvailableFormsScreen from 'screens/patient/AvailableFormsScreen';
import ReportScreen from 'screens/patient/ReportScreen';
import SymptomFormScreen from "screens/patient/SymptomFormScreen";

const Stack = createStackNavigator();

const ReportsStack = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName="ReportsMenuScreen">
      <Stack.Screen 
        name="ReportsMenuScreen" 
        component={ReportsMenuScreen}
        options={{ title: t('reports_menu') }}
      />
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

export default ReportsStack;
