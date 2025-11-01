import AccountProtectedScreen from '../screens/auth/AccountProtectedScreen';
import AuthVerificationScreen from '../screens/auth/AuthVerificationScreen';
import ConfirmPinScreen from '../screens/auth/ConfirmPinScreen';
import EmailOtpScreen from '../screens/auth/EmailOtpScreen';
import EmailPasswordScreen from '../screens/auth/EmailPasswordScreen';
import EmailScreen from '../screens/auth/EmailScreen';
import ForgotPassword from '../screens/auth/ForgotPassword';
import LoginScreen from '../screens/auth/LoginScreen';
import PersonalDetailScreen from '../screens/auth/PersonalDetailScreen';
import PhoneScreen from '../screens/auth/PhoneScreen';
import PinScreen from '../screens/auth/PinScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import SplashScreen from '../screens/onboarding/SplashScreen';
import Stock from '../screens/stock/Stock';
import TradingView from '../screens/stock/TradingView';
import Transaction from '../screens/stock/Transaction';
import TransactionSuccess from '../screens/stock/TransactionSuccess';

export const authStacks = [
  {
    name: 'SplashScreen',
    component: SplashScreen,
  },
  {
    name: 'LoginScreen',
    component: LoginScreen,
  },
  {
    name: 'EmailScreen',
    component: EmailScreen,
  },
  {
    name: 'RegisterScreen',
    component: RegisterScreen,
  },

  {
    name: 'PhoneScreen',
    component: PhoneScreen,
  },
  {
    name: 'AuthVerificationScreen',
    component: AuthVerificationScreen,
  },
  {
    name: 'EmailPasswordScreen',
    component: EmailPasswordScreen,
  },
  {
    name: 'EmailOtpScreen',
    component: EmailOtpScreen,
  },
  {
    name: 'PersonalDetailScreen',
    component: PersonalDetailScreen,
  },
  {
    name: 'PinScreen',
    component: PinScreen,
  },
  {
    name: 'ConfirmPinScreen',
    component: ConfirmPinScreen,
  },
  {
    name: 'AccountProtectedScreen',
    component: AccountProtectedScreen,
  },
  {
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    name: 'ProfileScreen',
    component: ProfileScreen,
  },
];

export const dashboardStacks = [
  {
    name: 'Stock',
    component: Stock,
  },
  {
    name: 'TradingView',
    component: TradingView,
  },
  {
    name: 'Transaction',
    component: Transaction,
  },
  {
    name: 'TransactionSuccess',
    component: TransactionSuccess,
  },
];

export const mergedStacks = [...authStacks, ...dashboardStacks];
