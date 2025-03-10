import React, { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                console.log("token",token)
                if (token) {

                    const decoded = jwtDecode(token);
                    console.log("Decoded JWT:", decoded); // ✅ Log full decoded token
    
    
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp && decoded.exp < currentTime) {
                        console.log("Token expired, logging out...");
                        await logout();
                    } else {
                        setUser({ token, username: decoded.username || "Unknown" }); // Default to prevent undefined
                    }
                }
            } catch (error) {
                console.error("Error loading token:", error);
            }
        };
    
        loadUser();
        

    }, []);
    
    // Logout function: Remove token from storage and reset user state
    const logout = async () => {
        await AsyncStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
