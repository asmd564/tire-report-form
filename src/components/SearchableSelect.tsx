import { useEffect, useMemo, useRef, useState } from 'react';

type SearchableSelectProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  noResultsText?: string;
};

const normalize = (value: string) =>
  value
    .toLocaleLowerCase('pl')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export function SearchableSelect({
  value,
  options,
  onChange,
  placeholder,
  searchPlaceholder = 'Szukaj...',
  disabled = false,
  noResultsText = 'Brak wyników',
}: SearchableSelectProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery(value);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [isOpen, value]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) return options;

    return options.filter((option) => normalize(option).includes(normalizedQuery));
  }, [options, query]);

  const chooseOption = (option: string) => {
    onChange(option);
    setQuery(option);
    setIsOpen(false);
  };

  return (
    <div className="search-select" ref={wrapperRef}>
      <div className="search-select__control">
        <input
          type="text"
          value={query}
          disabled={disabled}
          placeholder={disabled ? placeholder : value ? searchPlaceholder : placeholder}
          autoComplete="off"
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && isOpen && filteredOptions[0]) {
              event.preventDefault();
              chooseOption(filteredOptions[0]);
              return;
            }

            if (event.key === 'Escape') {
              setIsOpen(false);
              setQuery(value);
            }
          }}
        />
        <button
          type="button"
          className="search-select__toggle"
          aria-label="Pokaż opcje"
          disabled={disabled}
          onClick={() => {
            if (!disabled) setIsOpen((current) => !current);
          }}
        >
          ▾
        </button>
      </div>

      {isOpen && !disabled ? (
        <div className="search-select__menu" role="listbox">
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <button
                type="button"
                key={option}
                className={option === value ? 'search-select__option search-select__option--selected' : 'search-select__option'}
                onClick={() => chooseOption(option)}
              >
                {option}
              </button>
            ))
          ) : (
            <div className="search-select__empty">{noResultsText}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
