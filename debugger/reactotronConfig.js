import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configure Reactotron with USB debugging
// The app will connect to Reactotron running on your machine on port 9090
const reactotronConfig = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: "TradingApp",
    // Use socket connection for better reliability
    // Reactotron will auto-discover the server
    enabled: true,
    onConnect: () => {
      console.log("🔌 Reactotron Connected!");
    },
    onDisconnect: () => {
      console.log("❌ Reactotron Disconnected");
    },
  })
  .useReactNative({
    asyncStorage: {
      ignore: false,
    },
    networking: {
      ignoreUrls: /symbolicate/,
      ignoreContentTypes: /^(image)\//, // Ignore images
      // Enable detailed network logging
      enableXHR: true, // Monitor XHR/fetch requests
    },
    editor: false,
    errors: { veto: (stackFrame) => false },
    overlay: false,
  })
  .connect();

export default reactotronConfig;
