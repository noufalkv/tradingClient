import { Platform } from 'react-native';


// FOR LOCAL

// export const BASE_URL =
//   Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
// export const BASE_URL = 'https://17c48dd02937.ngrok-free.app';


// export const SOCKET_URL =
//   Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';


// export const TRADINGVIEW_WEB_URI =
//   Platform.OS == 'ios' ? `http://localhost:3001/` : `http://localhost:3001/`;


// FOR PRODUCTION UPDATE THESE DEPLOYMENT URI and CREATE BUILD
// or you can setup more automation using like NODE__DEV or config env
// if you want more flexibility


export const BASE_URL = 'http://54.183.199.104:3000';
export const SOCKET_URL = 'http://54.183.199.104:4000';
export const TRADINGVIEW_WEB_URI = `http://54.183.199.104:3001`;


export const CHECK_EMAIL = `${BASE_URL}/auth/check-email`;
export const EMAIL_LOGIN = `${BASE_URL}/auth/login`;
export const REFRESH_TOKEN = `${BASE_URL}/auth/refresh-token`;
export const VERIFY_OTP = `${BASE_URL}/auth/verify-otp`;
export const SEND_OTP = `${BASE_URL}/auth/send-otp`;
export const REGISTER = `${BASE_URL}/auth/register`;
export const OAUTH = `${BASE_URL}/auth/oauth`;