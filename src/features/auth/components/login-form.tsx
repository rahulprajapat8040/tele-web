import { useLoginForm } from '@/hooks/use-login-form';
import type { LoginPayload } from '@/lib/interfaces/auth/login-form.interface';
import { useWatch } from 'react-hook-form';
import { PhoneNumberStep } from './phone-step';
import { OtpVerificationStep } from './otp-verfication';
import { getNationalPhoneNumber } from '@/lib/utils/utils';

interface LoginFormProps {
  deviceToken?: string;
  deviceType?: LoginPayload['deviceType'];
}

export const LoginForm = ({
  deviceToken,
  deviceType = 'WEB',
}: LoginFormProps) => {
  const {
    form,
    step,
    handleSendOtp,
    handleVerifyOtp,
    handleResendOtp,
    handleBack,
  } = useLoginForm({
    deviceToken,
    deviceType,
  });

  const {
    control,
    register,
    formState: { errors },
  } = form;

  const phone = useWatch({
    control,
    name: 'phone',
  });

  const countryCode = useWatch({
    control,
    name: 'countryCode',
  });

  return (
    <form onSubmit={form.handleSubmit(handleVerifyOtp)} className="w-full">
      {step === 'PHONE' ? (
        <PhoneNumberStep form={form} onContinue={handleSendOtp} />
      ) : (
        <OtpVerificationStep
          phoneNumber={getNationalPhoneNumber(phone, countryCode)}
          countryCode={countryCode}
          register={register}
          errors={errors}
          onBack={handleBack}
          onResend={handleResendOtp}
        />
      )}
    </form>
  );
};
