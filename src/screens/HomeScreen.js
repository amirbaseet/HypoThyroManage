import React from "react";
import {View ,Text, Button} from 'react-native';

const HomeScreen = ({navigation}) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text> HomeScreen</Text>
            <Button title = "Go To Profile" onPress={()=>navigation.navigate('Profile')}></Button>
</View>
    )

};

export default HomeScreen;