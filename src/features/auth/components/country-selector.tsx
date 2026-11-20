import { useEffect, useRef, useState } from 'react';
import { defaultCountries, parseCountry } from 'react-international-phone';

interface CountrySelectorProps {
  selectedCountry: string;
  onSelect: (iso2: string) => void;
}

const countries = defaultCountries.map(parseCountry);

export const CountrySelector = ({
  selectedCountry,
  onSelect,
}: CountrySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.dialCode.includes(search.replace('+', '')),
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDropdown();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  const closeDropdown = () => {
    setIsOpen(false);
    setSearch('');
  };

  const handleSelect = (iso2: string) => {
    onSelect(iso2);
    closeDropdown();
  };

  const getFlag = (iso2: string) =>
    iso2
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(char.charCodeAt(0) + 127397),
      );

  const selected = countries.find((item) => item.iso2 === selectedCountry);

  return (
    <div ref={wrapperRef} className="relative">
      <label
        className={`absolute -top-2 left-3 z-10 bg-background px-2 text-xs font-medium ${
          isOpen ? 'text-[#8774e1]' : 'text-muted'
        }`}
      >
        Country
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-12 w-full items-center justify-between rounded-2xl border bg-transparent px-4 text-sm transition-all ${
          isOpen
            ? 'border-[#8774e1] ring-1 ring-[#8774e1]/30'
            : 'border-[#555] hover:border-gray-400'
        }`}
      >
        <span>{selected?.name}</span>

        <svg
          className={`h-5 w-5 text-muted transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="telegram-country-popover absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-white/5 bg-background shadow-2xl shadow-black/40">
          {/* Search */}
          <div className="sticky top-0 z-10 border-b border-white/5 bg-background p-3">
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country"
              className="h-10 w-full rounded-lg bg-white/5 px-3 text-sm outline-none transition-colors focus:bg-white/10"
            />
          </div>

          {/* Countries */}
          <div className="telegram-country-list max-h-70 overflow-y-auto p-1.5">
            {filteredCountries.map((item) => {
              const active = item.iso2 === selectedCountry;

              return (
                <button
                  key={item.iso2}
                  type="button"
                  onClick={() => handleSelect(item.iso2)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                    active
                      ? 'bg-[#8774e1]/15 text-[#a99af0]'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-xl">{getFlag(item.iso2)}</span>

                  <span className="flex-1 truncate text-sm">{item.name}</span>

                  <span className="text-sm text-muted">+{item.dialCode}</span>

                  {active && <span className="text-[#8774e1]">✓</span>}
                </button>
              );
            })}

            {filteredCountries.length === 0 && (
              <p className="py-8 text-center text-sm text-muted">
                No countries found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
