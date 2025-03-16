import { io } from "socket.io-client";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ip = "10.7.84.67";
const SOCKET_URL = `http://${ip}:3001`;

// const token = await AsyncStorage.getItem("authToken");  // ✅ Fetch JWT token

const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"], 
    path: "/socket.io/",
    forceNew: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    randomizationFactor: 0.5
    // auth: { token },  // ✅ Send JWT token in authentication
});

// ✅ Debugging logs
socket.on("connect", () => console.log("✅ Connected to WebSocket!", socket.id));
socket.on("disconnect", () => console.log("🔴 Disconnected from WebSocket!"));
socket.on("connect_error", (err) => console.error("❌ WebSocket error:", err));

// 📡 Auto-reconnect on app state change
AppState.addEventListener("change", (state) => {
    if (state === "active" && !socket.connected) {
        console.log("🔄 Reconnecting to WebSocket...");
        socket.connect();
    }
});

// 📡 Auto-reconnect on network status change
NetInfo.addEventListener((state) => {
    if (state.isConnected) {
        if (!socket.connected) {
            console.log("📡 Network restored. Attempting to reconnect...");
            socket.connect();
        }
    } else {
        console.log("❌ No network connection. Disconnecting socket...");
        socket.disconnect();
    }
});

export default socket;
