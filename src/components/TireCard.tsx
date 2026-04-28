import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormField } from './FormField';
import { SearchableSelect } from './SearchableSelect';
import { OTHER_OPTION_VALUE, OTHER_TIRE_BRAND_LABEL, TIRE_BRANDS } from '../lib/catalog';
import { formatTireSizeInput } from '../lib/formatters';
import type { TireReportFormInput } from '../lib/validation';
import { getTreadWarning } from '../lib/validation';

type TireCardProps = {
  index: number;
  label: string;
  register: UseFormRegister<TireReportFormInput>;
  errors: FieldErrors<TireReportFormInput>;
  treadDepth?: unknown;
  tireBrandChoice: string;
  onTireBrandSelect: (selectedBrand: string) => void;
  onManualTireBrandChange: (value: string) => void;
  onTireSizeChange: (value: string) => void;
  copyBrandToAll?: boolean;
  copySizeToAll?: boolean;
  onCopyBrandToAllChange?: (checked: boolean) => void;
  onCopySizeToAllChange?: (checked: boolean) => void;
  isTireBrandLocked?: boolean;
  isTireSizeLocked?: boolean;
};

const toOptionalNumber = (value: unknown) => {
  if (value === '' || value === null || typeof value === 'undefined') return undefined;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export function TireCard({
  index,
  label,
  register,
  errors,
  treadDepth,
  tireBrandChoice,
  onTireBrandSelect,
  onManualTireBrandChange,
  onTireSizeChange,
  copyBrandToAll,
  copySizeToAll,
  onCopyBrandToAllChange,
  onCopySizeToAllChange,
  isTireBrandLocked = false,
  isTireSizeLocked = false,
}: TireCardProps) {
  const tireErrors = errors.tires?.[index];
  const warning = getTreadWarning(toOptionalNumber(treadDepth));
  const sizeField = register(`tires.${index}.size`);
  const manualTireBrandField = register(`tires.${index}.tireBrand`);
  const isManualTireBrand = tireBrandChoice === OTHER_OPTION_VALUE;
  const tireBrandOptions = [...TIRE_BRANDS, OTHER_TIRE_BRAND_LABEL];
  const isFirstCard = index === 0;

  return (
    <section className="tire-card">
      <input type="hidden" {...register(`tires.${index}.position`)} />

      <div className="tire-card__header">
        <h3>{label}</h3>
        {warning ? <span className="badge badge--warning">Wymaga uwagi</span> : <span className="badge">Bez uwag</span>}
      </div>

      {isFirstCard ? (
        <div className="copy-options" aria-label="Szybkie kopiowanie danych opon">
          <label className="copy-option">
            <input
              type="checkbox"
              checked={Boolean(copyBrandToAll)}
              onChange={(event) => onCopyBrandToAllChange?.(event.target.checked)}
            />
            <span>Ta sama marka opon dla wszystkich kół</span>
          </label>
          <label className="copy-option">
            <input
              type="checkbox"
              checked={Boolean(copySizeToAll)}
              onChange={(event) => onCopySizeToAllChange?.(event.target.checked)}
            />
            <span>Ten sam rozmiar opony dla wszystkich kół</span>
          </label>
        </div>
      ) : null}

      <div className="grid grid--two">
        <FormField label="Marka opony" hint="Zacznij pisać, żeby zawęzić listę" error={tireErrors?.tireBrand?.message}>
          <SearchableSelect
            value={tireBrandChoice === OTHER_OPTION_VALUE ? OTHER_TIRE_BRAND_LABEL : tireBrandChoice}
            options={tireBrandOptions}
            placeholder="Wybierz lub wyszukaj markę opony"
            searchPlaceholder="Wpisz markę opony"
            disabled={isTireBrandLocked}
            onChange={onTireBrandSelect}
          />
          {isManualTireBrand ? (
            <input
              className="field__extra-input"
              placeholder="Wpisz markę opony"
              disabled={isTireBrandLocked}
              {...manualTireBrandField}
              onChange={(event) => {
                manualTireBrandField.onChange(event);
                onManualTireBrandChange(event.target.value);
              }}
            />
          ) : (
            <input type="hidden" {...register(`tires.${index}.tireBrand`)} />
          )}
        </FormField>

        <FormField label="Rozmiar" hint="Wpisz np. 2055516 → 205/55 R16" error={tireErrors?.size?.message}>
          <input
            inputMode="numeric"
            placeholder="205/55 R16"
            maxLength={10}
            disabled={isTireSizeLocked}
            {...sizeField}
            onChange={(event) => {
              event.target.value = formatTireSizeInput(event.target.value);
              sizeField.onChange(event);
              onTireSizeChange(event.target.value);
            }}
          />
        </FormField>

        <FormField label="Głębokość bieżnika (mm)" hint="Podaj wartość w milimetrach" error={tireErrors?.treadDepthMm?.message}>
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="5.2"
            {...register(`tires.${index}.treadDepthMm`, { valueAsNumber: true })}
          />
        </FormField>

        <FormField label="DOT" hint="Ostatnie 4 cyfry, np. 2322" error={tireErrors?.dotCode?.message}>
          <input inputMode="numeric" placeholder="2322" maxLength={4} {...register(`tires.${index}.dotCode`)} />
        </FormField>

        <FormField label="Ocena" error={tireErrors?.rating?.message}>
          <select {...register(`tires.${index}.rating`, { valueAsNumber: true })}>
            <option value="1">1 — bardzo słaba</option>
            <option value="2">2 — słaba</option>
            <option value="3">3 — średnia</option>
            <option value="4">4 — dobra</option>
            <option value="5">5 — bardzo dobra</option>
          </select>
        </FormField>
      </div>

      <FormField label="Uwagi" error={tireErrors?.notes?.message}>
        <textarea rows={3} placeholder="Opcjonalne uwagi do tej opony" {...register(`tires.${index}.notes`)} />
      </FormField>

      {warning ? <p className="inline-warning">{warning}</p> : null}
    </section>
  );
}
