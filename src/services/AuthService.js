import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { removePushTokenSubscription } from "expo-notifications";
import { de } from "react-native-paper-dates";
const ip = "10.7.84.67";
const API_URL = `http://${ip}:3001/api/auth`;

export const loginUser = async (email,password) =>{
    try{
        const res = await axios.post(`${API_URL}/login`,{email,password});
        const token = res.data.token;
        await AsyncStorage.setItem("token",token);
        const decoded = jwtDecode(token);
        return {token ,username:decoded.username||"Unknown"};
    }catch(error){
        return { error: error.response?.data?.message || "Login failed" };
    }
};

export const logoutUser = async()=>{
    await AsyncStorage.removeItem("token");
};