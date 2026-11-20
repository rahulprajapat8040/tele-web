import { useEffect } from 'react';
import { usePhoneInput } from 'react-international-phone';
import { CountrySelector } from './country-selector';

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onCountryCodeChange: (code: string) => void;
  error?: string;
}

export const PhoneNumberInput = ({
  value,
  onChange,
  onBlur,
  onCountryCodeChange,
  error,
}: PhoneNumberInputProps) => {
  const { inputValue, handlePhoneValueChange, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'in',
      value,
      onChange: ({ phone }) => {
        onChange(phone);
      },
      forceDialCode: false,
    });

  useEffect(() => {
    onCountryCodeChange(`+${country.dialCode}`);
  }, [country.dialCode, onCountryCodeChange]);

  return (
    <div className="space-y-4 text-start">
      <CountrySelector
        selectedCountry={country.iso2}
        onSelect={(iso2) => setCountry(iso2)}
      />

      <div className="group relative">
        <label
          htmlFor="phone"
          className="absolute -top-2 left-3 z-10 bg-background px-2 text-xs font-medium text-muted transition-colors group-focus-within:text-[#8774e1]"
        >
          Your phone number
        </label>

        <input
          id="phone"
          type="tel"
          value={inputValue}
          onChange={handlePhoneValueChange}
          onBlur={onBlur}
          autoComplete="tel"
          placeholder="Enter phone number"
          className={`h-12 w-full rounded-2xl border bg-transparent px-4 text-sm outline-none transition-all ${
            error
              ? 'border-error'
              : 'border-[#555] focus:border-[#8774e1] focus:ring-1 focus:ring-[#8774e1]/30'
          }`}
        />

        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    </div>
  );
};
