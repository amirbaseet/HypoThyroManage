import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ip = "172.20.10.4";
const API_URL = `http://${ip}:3001/api/auth`;

export const loginUser = async (email,password) =>{
    try{
        const res = await axios.post(`${API_URL}/login`,{email,password});
        await AsyncStorage.setItem("token",res.data.token);
        return res.data;
    }catch(error){
        return { error:error.response?.data?.message || "Login failed"};
    }
};

export const logoutUser = async()=>{
    await AsyncStorage.removeItem("token");
};