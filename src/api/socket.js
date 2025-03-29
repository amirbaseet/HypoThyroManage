import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SOCKET_URL } from "@env";  


let socket = null; // Maintain a persistent socket instance

const connectSocket = async () => {
    if (socket && socket.connected) {  // ✅ Ensure we don't create multiple instances
        console.log("⚡ Socket already connected:", socket.id);
        return socket;
    }
    try {
        const token = await AsyncStorage.getItem("token");
        // console.log("🔑 Retrieved Token:", token);

        if (!token) {
            console.error("❌ No token found. WebSocket connection not established.");
            return null;
        }

        socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            path: "/socket.io/",
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 10000,
            randomizationFactor: 0.5,
            auth: { token }, // ✅ Ensure token is used
        });

        // ✅ Connection logs
        socket.on("connect", () => console.log("✅ Connected to WebSocket!", socket.id));
        socket.on("disconnect", () => console.log("🔴 Disconnected from WebSocket!"));
        socket.on("connect_error", (err) => console.error("❌ WebSocket error:", err));

        return socket;
    } catch (error) {
        console.error("❌ Error initializing WebSocket:", error);
        return null;
    }
};

// ✅ Always return the same instance of the socket
const getSocket = async () => {
    return socket || connectSocket();
};
export { getSocket };