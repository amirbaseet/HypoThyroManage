import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import api from "../api/apiService";

export const loginUser = async (email,password) =>{
    try{
        const res = await api.post(`/auth/login`,{email,password});
        const token = res.data.token;
        await AsyncStorage.setItem("token",token);
        const decoded = jwtDecode(token);
        const user = { id: decoded.id, username: decoded.username, email:decoded.email, role: decoded.role}

        return { token, ...user};
    }catch(error){
        console.error("Login Error:", error.response?.data || error.message);
        return { error: error.response?.data?.message || "Login failed" };
        }
};

export const logoutUser = async()=>{
    await AsyncStorage.removeItem("token");
};