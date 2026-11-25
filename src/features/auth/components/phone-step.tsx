import type { LoginFormValues } from '@/lib/interfaces/auth/login-form.interface';
import { useCallback } from 'react';
import { Controller, useWatch } from 'react-hook-form';

import type { UseFormReturn } from 'react-hook-form';
import { PhoneNumberInput } from './phone-input';
import { getNationalPhoneNumber } from '@/lib/utils/utils';

interface PhoneNumberStepProps {
  form: UseFormReturn<LoginFormValues>;
  onContinue: () => void;
}

export const PhoneNumberStep = ({ form, onContinue }: PhoneNumberStepProps) => {
  const {
    control,
    register,
    setValue,
    formState: { errors, isValid },
  } = form;

  const countryCode = useWatch({
    control,
    name: 'countryCode',
  });

  const handleCountryCodeChange = useCallback(
    (code: string) => {
      setValue('countryCode', code, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  return (
    <div className="space-y-7">
      <Controller
        name="phone"
        control={control}
        rules={{
          validate: (value) => {
            const number = getNationalPhoneNumber(value, countryCode);

            const totalDigits = value.replace(/\D/g, '').length;

            if (!number) {
              return 'Phone number is required';
            }

            if (number.length < 6) {
              return 'Phone number must have at least 6 digits';
            }

            if (totalDigits > 15) {
              return 'Phone number is too long';
            }

            return true;
          },
        }}
        render={({ field }) => (
          <PhoneNumberInput
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            onCountryCodeChange={handleCountryCodeChange}
            error={errors.phone?.message}
          />
        )}
      />

      {/* Keep Signed In */}
      <label className="group flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          {...register('keepSignedIn')}
          className="peer sr-only"
        />

        <span className="flex h-5 w-5 items-center justify-center rounded-md border border-gray-500/50 transition-all duration-200 group-hover:border-[#8774e1] peer-checked:border-[#8774e1] peer-checked:bg-[#8774e1] peer-focus-visible:ring-2 peer-focus-visible:ring-[#8774e1]/40">
          <svg
            className={`h-3.5 w-3.5 text-white ${
              form.getValues('keepSignedIn') ? 'scale-100' : 'scale-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 12 4 4L19 6"
            />
          </svg>
        </span>

        <span className="text-sm text-muted transition-colors group-hover:text-foreground">
          Keep me signed in
        </span>
      </label>

      {/* Continue */}
      <button
        type="button"
        onClick={onContinue}
        disabled={!isValid}
        className="group relative w-full overflow-hidden rounded-xl bg-[#8774e1] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#8774e1]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7662d5] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Continue
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
