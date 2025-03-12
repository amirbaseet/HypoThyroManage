import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import api from "../api/apiService";
import { saveUserToLocalDB } from "../database/UsersCrud";
const fileName = `IN AuthService`;

export const loginUser = async (email,password) =>{
    try{
        const res = await api.post(`/auth/login`,{email,password});
        const token = res.data.token;
        await AsyncStorage.setItem("token",token);
        const decoded = jwtDecode(token);
        const user = {
            id: decoded.id,
            username: decoded.username || "Unknown",
            email: decoded.email || "No email",
            dateOfBirth: decoded.dateOfBirth || "2000-01-01",
            gender: decoded.gender || "Unknown",
            role: decoded.role || "User",
        };
        // 🔹 Store both token and user details in AsyncStorage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
       
        console.log(`Saving user to local DB...${JSON.stringify(user)}`);
        await saveUserToLocalDB(user);
        // console.log(`${fileName} User Logged In & Saved`, user);
        return { token, user };
    }catch(error){
        console.error(`${fileName} Login Error:`, error.response?.data || error.message);
        return { error: error.response?.data?.message || "Login failed" };
        }
};

export const logoutUser = async()=>{
    console.log(`${fileName} Logging out...`);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user"); // 🔹 Also remove user data
};