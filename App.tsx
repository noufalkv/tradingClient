import React from 'react';
import Navigation from './src/navigation/Navigation';
import { persistor, store } from './src/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { toastConfig } from './ToastConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { IOS_GOOGLE_CLIENT_ID, WEB_CLIENT_ID } from './src/config/env';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  forceCodeForRefreshToken: true,
  offlineAccess: false,
  iosClientId: IOS_GOOGLE_CLIENT_ID,
});

const App = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
      <Toast
        visibilityTime={2500}
        config={toastConfig}
        bottomOffset={0}
        swipeable={false}
        position="bottom"
      />
    </>
  );
};

export default App;
