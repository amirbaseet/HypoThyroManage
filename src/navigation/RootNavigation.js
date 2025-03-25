// src/navigation/RootNavigation.js
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function resetToLogin() {
  if (navigationRef.isReady()) {
    console.log("🔁 Resetting navigation to Login...");
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } else {
    console.warn("⏳ Navigation not ready yet.");
  }
}
