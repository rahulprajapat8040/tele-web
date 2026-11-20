import type {
  LoginFormValues,
  LoginPayload,
  LoginStep,
} from '@/lib/interfaces/auth/login-form.interface';
import { generateDeviceId, getNationalPhoneNumber } from '@/lib/utils';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApiMutation } from './use-api-mutation';
import { authApi } from '@/api/auth/auth.api';

interface UseLoginFormOptions {
  deviceToken?: string;
  deviceType?: LoginPayload['deviceType'];
}

export const useLoginForm = ({
  deviceToken,
  deviceType = 'WEB',
}: UseLoginFormOptions = {}) => {
  const [step, setStep] = useState<LoginStep>('PHONE');

  const deviceId = useRef(generateDeviceId()).current;

  const form = useForm<LoginFormValues>({
    mode: 'onChange',
    defaultValues: {
      phone: '',
      countryCode: '+91',
      otp: '',
      keepSignedIn: true,
    },
  });

  const { trigger, getValues, resetField } = form;

  const { mutate: mutateSendOTP } = useApiMutation(authApi.sendOTP, {
    onSuccess() {
      console.log('OTP Send successfully');
    },
  });

  const { mutate: mutateLogin } = useApiMutation(authApi.login, {
    onSuccess() {
      console.log('Login Send successfully');
    },
  });

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    const isValid = await trigger('phone');

    if (!isValid) return;

    const values = getValues();

    const phoneNo = getNationalPhoneNumber(values.phone, values.countryCode);

    if (!phoneNo) return;

    const payload = {
      countryCode: values.countryCode,
      phoneNo,
    };
    mutate: mutateSendOTP(payload);

    // TODO: Integrate Send OTP API
    console.log('SEND OTP PAYLOAD:', payload);

    setStep('OTP');
  };

  // Step 2: Verify OTP and login
  const handleVerifyOtp = async (values: LoginFormValues) => {
    const phoneNo = getNationalPhoneNumber(values.phone, values.countryCode);

    const payload: LoginPayload = {
      deviceId,
      ...(deviceToken ? { deviceToken } : {}),
      deviceType,
      countryCode: values.countryCode,
      phoneNo,
      otp: values.otp,
    };

    mutateLogin(payload);
    // TODO: Integrate Login API
  };

  // Resend OTP
  const handleResendOtp = () => {
    const values = getValues();

    const payload = {
      countryCode: values.countryCode,
      phoneNo: getNationalPhoneNumber(values.phone, values.countryCode),
    };

    mutate: mutateSendOTP(payload);
  };

  // Go back to phone step
  const handleBack = () => {
    resetField('otp');
    setStep('PHONE');
  };

  return {
    form,
    step,
    handleSendOtp,
    handleVerifyOtp,
    handleResendOtp,
    handleBack,
  };
};
