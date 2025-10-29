import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import reduxStorage from './storage';
import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['user', 'theme'],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Define enhancers for Reactotron integration
let reactotronEnhancer: any;

if (__DEV__) {
  try {
    const Reactotron = require('reactotron-react-native').default;
    
    // Get the Reactotron instance that was configured in reactotronConfig.js
    if (Reactotron?.createEnhancer) {
      reactotronEnhancer = Reactotron.createEnhancer();
      console.log('✅ Reactotron Redux enhancer added');
    }
  } catch (err) {
    console.log('⚠️ Reactotron not available for Redux integration', err);
  }
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  enhancers: (getDefaultEnhancers) => {
    const enhancers = getDefaultEnhancers();
    if (reactotronEnhancer) {
      enhancers.push(reactotronEnhancer);
    }
    return enhancers;
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
