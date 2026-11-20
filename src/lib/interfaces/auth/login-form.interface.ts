export type LoginStep = 'PHONE' | 'OTP';

export interface LoginFormValues {
  phone: string;
  countryCode: string;
  otp: string;
  keepSignedIn: boolean;
}

export interface LoginPayload {
  deviceId: string;
  deviceToken?: string;
  deviceType: 'ANDROID' | 'IOS' | 'WEB';
  countryCode: string;
  phoneNo: string;
  otp: string;
}
