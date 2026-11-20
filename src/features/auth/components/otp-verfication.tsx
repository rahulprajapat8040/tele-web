import type { LoginFormValues } from '@/lib/interfaces/auth/login-form.interface';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface OtpVerificationStepProps {
  phoneNumber: string;
  countryCode: string;
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  onBack: () => void;
  onResend: () => void;
}

export const OtpVerificationStep = ({
  phoneNumber,
  countryCode,
  register,
  errors,
  onBack,
  onResend,
}: OtpVerificationStepProps) => {
  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Enter verification code
        </h2>

        <p className="text-sm leading-relaxed text-muted">
          We've sent a verification code to{' '}
          <span className="font-medium text-foreground">
            {countryCode} {phoneNumber}
          </span>
        </p>

        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-[#8774e1] hover:text-[#a99af0]"
        >
          Change phone number
        </button>
      </div>

      {/* OTP Input */}
      <div className="space-y-2">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="Enter OTP"
          {...register('otp', {
            required: 'Please enter the verification code',
            pattern: {
              value: /^\d{4,6}$/,
              message: 'Enter a valid 4–6 digit OTP',
            },
            setValueAs: (value: string) => value.replace(/\D/g, '').slice(0, 6),
          })}
          className="h-14 w-full rounded-2xl border border-[#555] bg-transparent px-4 text-center text-xl tracking-[0.5em] text-foreground outline-none transition-all placeholder:text-sm placeholder:tracking-normal placeholder:text-muted focus:border-[#8774e1] focus:ring-1 focus:ring-[#8774e1]/30"
        />

        {errors.otp && (
          <p className="text-xs text-error">{errors.otp.message}</p>
        )}
      </div>

      {/* Resend OTP */}
      <div className="text-center">
        <button
          type="button"
          onClick={onResend}
          className="text-sm font-medium text-[#8774e1] transition-colors hover:text-[#a99af0]"
        >
          Didn't receive the code? Resend OTP
        </button>
      </div>

      {/* Verify */}
      <button
        type="submit"
        className="group relative w-full overflow-hidden rounded-xl bg-[#8774e1] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#8774e1]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7662d5] active:scale-[0.98]"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Verify & Login
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-7-7 7 7-7 7"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};
