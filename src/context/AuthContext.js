import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, logoutUser } from "services/AuthService";
import { getSocket } from "api/socket";

const fileName = `IN AuthContext`;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ⬅️ Add loading state

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const userData = await AsyncStorage.getItem("user");

                if (token && userData) {
                    const decoded = jwtDecode(token);

                    const currentTime = Date.now() / 1000;
                    if (decoded.exp && decoded.exp < currentTime) {
                        console.log("Token expired, logging out...");
                        await logoutUser(); // Handle expired token
                    }  else {
                        setUser(JSON.parse(userData));

                        // console.log(`Saving user to local DB...`);
                        // await saveUserToLocalDB(userData.user);

                        
                    }
                }
            }  catch (error) {
                console.error(`${fileName} Error loading token:`, error);
            } finally {
                setLoading(false); // ⬅️ Stop loading after processing
            }
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        const response = await loginUser(email, password);
        if (response.token) {
            setUser(response.user);
            await AsyncStorage.setItem("token", response.token);
            await AsyncStorage.setItem("user", JSON.stringify(response.user));
        }
        return response;
    };

    // Logout function: Remove token and reset user state
    const logout = async () => {
        const socket = await getSocket(); // ✅ Get the existing WebSocket instance
        if (socket) {
            socket.disconnect(); // ✅ Properly disconnect WebSocket
            console.log("🔴 WebSocket disconnected on logout");
        }

        await logoutUser();
        setUser(null); // Reset user first to prevent UI flicker

    };

    if (loading) {
        return null; // Prevent rendering before auth state is checked
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
