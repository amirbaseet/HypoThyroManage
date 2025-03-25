import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import api, { updatePushToken, removePushToken } from "../api/apiService";
import * as Notifications from "expo-notifications";

const fileName = `IN AuthService`;

/**
 * Log in user using phoneNumber and password
 */
export const loginUser = async (phoneNumber, password) => {
  try {
      const res = await api.post(`/auth/login`, { phoneNumber, password });

      const token = res.data.token;
      const decoded = jwtDecode(token);

      const user = {
          id: decoded.id,
          username: decoded.username || "Unknown",
          phoneNumber: decoded.phoneNumber || "No phone",
          gender: decoded.gender || "Unknown",
          doctorId: decoded.doctorId || null,
          role: decoded.role || "User",
      };

      // 🔹 Store token and user in AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      // 🔹 Fetch Expo Push Token
      try {
          const { data } = await Notifications.getExpoPushTokenAsync();
          const pushToken = data;
          console.log("Expo Push Token:", pushToken);
          await updatePushToken(user.id, pushToken);
      } catch (pushError) {
          console.error("Error fetching Expo push token:", pushError.message);
      }

      return { token, user };
  } catch (error) {
      console.error(`${fileName} Login Error:`, error.response?.data || error.message);
      return { error: error.response?.data?.message || "Login failed" };
  }
};



/**
 * Logout user: clear tokens, user info, and notify backend
 */
export const logoutUser = async () => {
    console.log(`${fileName} Logging out...`);
    try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
            const { id: userId } = JSON.parse(userData);
            await removePushToken(userId); // ✅ Remove push token from DB
        }
    } catch (error) {
        console.error(`❌ ${fileName} Error removing push token:`, error);
    }

    // 🔹 Clear all auth-related storage
    await AsyncStorage.removeItem("token");
    // await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("user");
};

// /**
//  * Use refresh token to get a new access token
//  */
// export const refreshAccessToken = async () => {
//     try {
//         const refreshToken = await AsyncStorage.getItem("refreshToken");
//         if (!refreshToken) return null;

//         const response = await api.post("/auth/refresh-token", { refreshToken });
//         const { accessToken } = response.data;

//         if (accessToken) {
//             await AsyncStorage.setItem("token", accessToken);
//             return accessToken;
//         }

//         return null;
//     } catch (error) {
//         console.error("🔄 Refresh Token Error:", error.response?.data || error.message);

//         // Optional: Auto logout on refresh failure
//         await logoutUser();
//         return null;
//     }
// };
