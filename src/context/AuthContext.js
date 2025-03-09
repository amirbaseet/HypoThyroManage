import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                setUser({ token });
            }
        };
        loadUser();
    }, []);

    // Logout function: Remove token from storage and reset user state
    const logout = async () => {
        await AsyncStorage.removeItem("token"); // Ensure token is removed
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
