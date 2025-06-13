export default ({ config }) => ({
  ...config,
  name: "HypoThyroManage",
  slug: "hypoThyroManager",
  version: "1.1.0",
  orientation: "portrait",
  icon: "./assets/app-logo.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.amrobaseet.hypothyromanager",
    buildNumber: "2",
    infoPlist: {
      UIBackgroundModes: ["audio", "fetch"],
      UIUserNotificationSettings: {
        types: ["alert", "badge", "sound"]
      },
      ITSAppUsesNonExemptEncryption: false
    },
    usesPermissions: [
      "ACCESS_FINE_LOCATION",
      "USER_FACING_NOTIFICATIONS"
    ]
  },
  android: {
    googleServicesFile: "./google-services.json",
    icon: "./assets/app-logo.png",
    versionCode: 2,
    permissions: [
      "ACCESS_FINE_LOCATION",
      "VIBRATE",
      "WAKE_LOCK",
      "NOTIFICATIONS"
    ],
    package: "com.amrobaseet.hypothyromanager",
    useNextNotificationsApi: true
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    ["expo-notifications", { mode: "production" }],
    "expo-localization",
    "expo-font"
  ],
  owner: "amrobaseet",
  extra: {
    eas: {
      projectId: "c51ecc8a-519f-4894-9eb6-6aef93b1a203"
    },
    API_URL: process.env.API_URL,
    SOCKET_URL: process.env.SOCKET_URL
  }
});
