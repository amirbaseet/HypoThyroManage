import  React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/profileScreen';
import NutritionScreen from '../screens/NutritionScreen';
import ExerciseScreen from '../screens/ExerciseScreen';
import StressScreen from '../screens/StressScreen';
import DermatologicalScreen from '../screens/DermatologicalScreen';
import BrainScreen from '../screens/BrainScreen';
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {

    return(
        <Drawer.Navigator>
            <Drawer.Screen name = "Home" component ={HomeScreen}/>
            <Drawer.Screen name = "Profile" component ={ProfileScreen}/>
            <Drawer.Screen name = "Nutrition" component ={NutritionScreen}/>
            <Drawer.Screen name = "Exercise" component ={ExerciseScreen}/>
            <Drawer.Screen name = "Stress" component ={StressScreen}/>
            <Drawer.Screen name = "Dermatological" component ={DermatologicalScreen}/>
            <Drawer.Screen name = "Brain" component ={BrainScreen}/>
        </Drawer.Navigator>
    );
}

export default DrawerNavigator;

