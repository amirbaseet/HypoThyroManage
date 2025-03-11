import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ⬅️ Add loading state

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                console.log("Token Retrieved:", token);

                if (token) {
                    const decoded = jwtDecode(token);
                    console.log("Decoded JWT:", decoded);

                    const currentTime = Date.now() / 1000;
                    if (decoded.exp && decoded.exp < currentTime) {
                        console.log("Token expired, logging out...");
                        await logout(); // Handle expired token
                    } else {
                        // ✅ Store full user details
                        setUser({
                            token,
                            user: {
                                id: decoded.id,
                                username: decoded.username || "Unknown",
                                email: decoded.email || "No email",
                                role: decoded.role || "User"
                            }
                        });
                                            }
                }
            } catch (error) {
                console.error("Error loading token:", error);
            } finally {
                setLoading(false); // ⬅️ Stop loading after processing
            }
        };

        loadUser();
    }, []);

    // Logout function: Remove token and reset user state
    const logout = async () => {
        setUser(null); // Reset user first to prevent UI flicker
        await AsyncStorage.removeItem("token");
    };

    if (loading) {
        return null; // Prevent rendering before auth state is checked
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
