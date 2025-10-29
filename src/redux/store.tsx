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


// Define enhancers
const enhancers = [];
if (__DEV__) {
  const Reactotron = require('reactotron-react-native')
    .default as typeof import('reactotron-react-native').default & {
    createEnhancer?: () => any;
  };
  if (Reactotron.createEnhancer) {
    const reactotronEnhancer = Reactotron.createEnhancer();
    enhancers.push(reactotronEnhancer);
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
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
