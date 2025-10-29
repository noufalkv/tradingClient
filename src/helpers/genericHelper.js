import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

import { DeviceDetailsPayload } from '@/services/types/api';

export const addAppDetailsToPayload = async <T extends object>(
  payload: T & DeviceDetailsPayload
): Promise<T & DeviceDetailsPayload> => {
  try {
    const appVersion = DeviceInfo.getVersion();
    payload.version = `${appVersion}`;
    payload.deviceId = await DeviceInfo.getUniqueId();
  } catch (e) {
    // You might want to handle this error or log it somewhere
  }
  return payload;
};

export const fetchDeviceIP = async () => {
  try {
    // Add the '!' operator to assert that Config.IP_URL is defined
    const response = await fetch(Config.IP_URL!);
    const data = await response.json();
    return data.ip;
  } catch (e) {
    //throw ‘Unable to detect internet connection on you mobile.
    //Please check your data package or Wi-Fi settings’;
  }
  return '0.0.0.0';
};

export const isJsonObject = (str: string) => {
  try {
    const json = JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const getSkiplyVersion = () => DeviceInfo.getVersion();

export const getDeviceId = async () => {
  try {
    return await DeviceInfo.getUniqueId();
  } catch (e) {
    return '0';
  }
};

export const getDeviceIP = async () => {
  try {
    return await DeviceInfo.getIpAddress();
  } catch (e) {
    return '00.000.00.00';
  }
};
