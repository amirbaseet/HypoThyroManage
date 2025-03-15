import { io } from "socket.io-client";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const ip = "10.7.84.67";
const SOCKET_URL = `http://${ip}:3001`;

const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    forceNew: true,
    reconnection: true,
    reconnectionAttempts: Infinity, // Keep trying indefinitely
    reconnectionDelay: 2000, // Start at 2s
    reconnectionDelayMax: 10000, // Maximum 10s delay
    randomizationFactor: 0.5
});

// ✅ Debugging & Logs
socket.on("connect", () => console.log("✅ Connected to Socket.io server!"));
socket.on("disconnect", () => console.log("🔴 Disconnected from Socket.io server!"));
socket.on("connect_error", (err) => console.error("❌ Socket connection error:", err));
socket.on("reconnect_attempt", (attempt) => console.log(`♻️ Reconnect attempt #${attempt}`));
socket.on("reconnect_failed", () => console.error("❌ Reconnection failed!"));
socket.on("reconnect_error", (err) => console.error("⚠️ Reconnect error:", err));

// 📌 Reconnect when app resumes
AppState.addEventListener("change", (state) => {
    if (state === "active") {
        if (!socket.connected) {
            console.log("🔄 Reconnecting Socket.io...");
            socket.connect();
        }
    }
});

// 📡 Reconnect when network is restored
NetInfo.addEventListener((state) => {
    if (state.isConnected && !socket.connected) {
        console.log("📡 Network restored. Reconnecting Socket.io...");
        socket.connect();
    }
});

export default socket;
