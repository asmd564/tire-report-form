import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { FormField } from './components/FormField';
import { SearchableSelect } from './components/SearchableSelect';
import { TireCard } from './components/TireCard';
import {
  getModelsForMake,
  OTHER_MAKE_LABEL,
  OTHER_MODEL_LABEL,
  OTHER_OPTION_VALUE,
  OTHER_TIRE_BRAND_LABEL,
  VEHICLE_CATALOG,
} from './lib/catalog';
import { normalizeVinInput } from './lib/formatters';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import {
  WHEEL_POSITIONS,
  createDefaultValues,
  normalizeReportPayload,
  tireReportSchema,
  type TireReportFormInput,
  type TireReportFormValues,
} from './lib/validation';

type SubmitStatus =
  | { type: 'idle'; message: string }
  | { type: 'loading'; message: string }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

function App() {
  const defaultValues = useMemo(() => createDefaultValues(), []);
  const [status, setStatus] = useState<SubmitStatus>({ type: 'idle', message: '' });
  const [vehicleMakeChoice, setVehicleMakeChoice] = useState('');
  const [vehicleModelChoice, setVehicleModelChoice] = useState('');
  const [tireBrandChoices, setTireBrandChoices] = useState<string[]>(() => WHEEL_POSITIONS.map(() => ''));
  const [copyFirstTireBrandToAll, setCopyFirstTireBrandToAll] = useState(false);
  const [copyFirstTireSizeToAll, setCopyFirstTireSizeToAll] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TireReportFormInput, unknown, TireReportFormValues>({
    resolver: zodResolver(tireReportSchema) as unknown as Resolver<TireReportFormInput, unknown, TireReportFormValues>,
    defaultValues,
    mode: 'onBlur',
  });

  const tires = watch('tires');
  const vehicleMakeOptions = useMemo(
    () => [...VEHICLE_CATALOG.map((vehicle) => vehicle.make), OTHER_MAKE_LABEL],
    [],
  );
  const vehicleModelOptions = useMemo(() => getModelsForMake(vehicleMakeChoice), [vehicleMakeChoice]);
  const vehicleModelSelectOptions = useMemo(
    () => (vehicleMakeChoice ? [...vehicleModelOptions, OTHER_MODEL_LABEL] : []),
    [vehicleMakeChoice, vehicleModelOptions],
  );
  const isManualVehicleMake = vehicleMakeChoice === OTHER_OPTION_VALUE;
  const isManualVehicleModel = isManualVehicleMake || vehicleModelChoice === OTHER_OPTION_VALUE;
  const vinField = register('vin');

  const resetForm = () => {
    reset(createDefaultValues());
    setVehicleMakeChoice('');
    setVehicleModelChoice('');
    setTireBrandChoices(WHEEL_POSITIONS.map(() => ''));
    setCopyFirstTireBrandToAll(false);
    setCopyFirstTireSizeToAll(false);
  };

  const tireIndexesToUpdate = (sourceIndex: number, shouldCopyToAll: boolean) => {
    if (sourceIndex === 0 && shouldCopyToAll) return WHEEL_POSITIONS.map((_, index) => index);
    return [sourceIndex];
  };

  const setTireBrandValue = (index: number, value: string) => {
    setValue(`tires.${index}.tireBrand` as `tires.${number}.tireBrand`, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const setTireSizeValue = (index: number, value: string) => {
    setValue(`tires.${index}.size` as `tires.${number}.size`, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleTireBrandSelect = (index: number, selectedBrand: string) => {
    const nextChoice = selectedBrand === OTHER_TIRE_BRAND_LABEL ? OTHER_OPTION_VALUE : selectedBrand;
    const nextFormValue = nextChoice === OTHER_OPTION_VALUE ? '' : nextChoice;
    const indexes = tireIndexesToUpdate(index, copyFirstTireBrandToAll);

    setTireBrandChoices((current) =>
      current.map((choice, choiceIndex) => (indexes.includes(choiceIndex) ? nextChoice : choice)),
    );
    indexes.forEach((targetIndex) => setTireBrandValue(targetIndex, nextFormValue));
  };

  const handleManualTireBrandChange = (index: number, value: string) => {
    const indexes = tireIndexesToUpdate(index, copyFirstTireBrandToAll);
    indexes.forEach((targetIndex) => setTireBrandValue(targetIndex, value));
  };

  const handleTireSizeChange = (index: number, value: string) => {
    if (index !== 0 || !copyFirstTireSizeToAll) return;
    WHEEL_POSITIONS.forEach((_, targetIndex) => setTireSizeValue(targetIndex, value));
  };

  const handleCopyFirstTireBrandToggle = (checked: boolean) => {
    setCopyFirstTireBrandToAll(checked);

    if (!checked) return;

    const firstChoice = tireBrandChoices[0] || '';
    const firstBrand = firstChoice && firstChoice !== OTHER_OPTION_VALUE ? firstChoice : String(tires?.[0]?.tireBrand ?? '');

    setTireBrandChoices(WHEEL_POSITIONS.map(() => firstChoice));
    WHEEL_POSITIONS.forEach((_, targetIndex) => setTireBrandValue(targetIndex, firstBrand));
  };

  const handleCopyFirstTireSizeToggle = (checked: boolean) => {
    setCopyFirstTireSizeToAll(checked);

    if (!checked) return;

    const firstSize = String(tires?.[0]?.size ?? '');
    WHEEL_POSITIONS.forEach((_, targetIndex) => setTireSizeValue(targetIndex, firstSize));
  };

  const onSubmit = async (values: TireReportFormValues) => {
    if (!isSupabaseConfigured || !supabase) {
      setStatus({
        type: 'error',
        message: 'Brakuje konfiguracji Supabase. Uzupełnij VITE_SUPABASE_URL oraz VITE_SUPABASE_ANON_KEY.',
      });
      return;
    }

    setStatus({ type: 'loading', message: 'Zapisujemy raport...' });

    try {
      const payload = normalizeReportPayload(values);
      const { error } = await supabase.from('tire_reports').insert(payload);

      if (error) throw error;

      resetForm();
      setStatus({ type: 'success', message: 'Raport został zapisany. Możesz szybko dodać kolejne zgłoszenie.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Nie udało się zapisać raportu. Spróbuj ponownie.',
      });
    }
  };

  const statusClass = status.type === 'idle' ? 'status status--hidden' : `status status--${status.type}`;

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero__content">
          <span className="eyebrow">Motocontroler.com</span>
          <h1>Formularz raportu opon</h1>
        </div>
      </section>

      <form className="report-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="card">
          <div className="section-heading">
            <h2>Dane pojazdu</h2>
          </div>

          <div className="grid grid--two">
            <FormField label="Marka" error={errors.vehicleMake?.message}>
              <SearchableSelect
                value={vehicleMakeChoice === OTHER_OPTION_VALUE ? OTHER_MAKE_LABEL : vehicleMakeChoice}
                options={vehicleMakeOptions}
                placeholder="Wybierz lub wyszukaj markę"
                searchPlaceholder="Wpisz markę, np. BMW"
                onChange={(selectedMake) => {
                  const nextMake = selectedMake === OTHER_MAKE_LABEL ? OTHER_OPTION_VALUE : selectedMake;
                  setVehicleMakeChoice(nextMake);
                  setVehicleModelChoice('');
                  setValue('vehicleModel', '', { shouldDirty: true, shouldValidate: true });

                  if (!nextMake || nextMake === OTHER_OPTION_VALUE) {
                    setValue('vehicleMake', '', { shouldDirty: true, shouldValidate: true });
                    return;
                  }

                  setValue('vehicleMake', nextMake, { shouldDirty: true, shouldValidate: true });
                }}
              />
              {isManualVehicleMake ? (
                <input className="field__extra-input" placeholder="Wpisz markę pojazdu" {...register('vehicleMake')} />
              ) : (
                <input type="hidden" {...register('vehicleMake')} />
              )}
            </FormField>

            <FormField label="Model" error={errors.vehicleModel?.message}>
              {isManualVehicleMake ? (
                <input placeholder="Wpisz model pojazdu" {...register('vehicleModel')} />
              ) : (
                <>
                  <SearchableSelect
                    value={vehicleModelChoice === OTHER_OPTION_VALUE ? OTHER_MODEL_LABEL : vehicleModelChoice}
                    options={vehicleModelSelectOptions}
                    disabled={!vehicleMakeChoice}
                    placeholder={vehicleMakeChoice ? 'Wybierz lub wyszukaj model' : 'Najpierw wybierz markę'}
                    searchPlaceholder="Wpisz model"
                    onChange={(selectedModel) => {
                      const nextModel = selectedModel === OTHER_MODEL_LABEL ? OTHER_OPTION_VALUE : selectedModel;
                      setVehicleModelChoice(nextModel);

                      if (!nextModel || nextModel === OTHER_OPTION_VALUE) {
                        setValue('vehicleModel', '', { shouldDirty: true, shouldValidate: true });
                        return;
                      }

                      setValue('vehicleModel', nextModel, { shouldDirty: true, shouldValidate: true });
                    }}
                  />
                  {isManualVehicleModel ? (
                    <input className="field__extra-input" placeholder="Wpisz model pojazdu" {...register('vehicleModel')} />
                  ) : (
                    <input type="hidden" {...register('vehicleModel')} />
                  )}
                </>
              )}
            </FormField>

            <FormField label="VIN" error={errors.vin?.message}>
              <input
                placeholder="WBA3A5C50DF000000"
                maxLength={17}
                {...vinField}
                onChange={(event) => {
                  event.target.value = normalizeVinInput(event.target.value);
                  vinField.onChange(event);
                }}
              />
            </FormField>

            <FormField label="Email zgłaszającego (opcjonalnie)" error={errors.submitterEmail?.message}>
              <input type="email" placeholder="jan@example.com" {...register('submitterEmail')} />
            </FormField>
          </div>
        </section>

        <section className="card">
          <div className="section-heading">
            <h2>Ocena kół</h2>
          </div>

          <div className="tire-grid">
            {WHEEL_POSITIONS.map((position, index) => (
              <TireCard
                key={position.key}
                index={index}
                label={position.label}
                register={register}
                errors={errors}
                treadDepth={tires?.[index]?.treadDepthMm}
                tireBrandChoice={tireBrandChoices[index] ?? ''}
                onTireBrandSelect={(selectedBrand) => handleTireBrandSelect(index, selectedBrand)}
                onManualTireBrandChange={(value) => handleManualTireBrandChange(index, value)}
                onTireSizeChange={(value) => handleTireSizeChange(index, value)}
                copyBrandToAll={index === 0 ? copyFirstTireBrandToAll : undefined}
                copySizeToAll={index === 0 ? copyFirstTireSizeToAll : undefined}
                onCopyBrandToAllChange={index === 0 ? handleCopyFirstTireBrandToggle : undefined}
                onCopySizeToAllChange={index === 0 ? handleCopyFirstTireSizeToggle : undefined}
                isTireBrandLocked={index > 0 && copyFirstTireBrandToAll}
                isTireSizeLocked={index > 0 && copyFirstTireSizeToAll}
              />
            ))}
          </div>
        </section>

        <div className={statusClass} role="status" aria-live="polite">{status.message}</div>

        <div className="actions">
          <button
            type="button"
            className="button button--secondary"
            onClick={() => {
              resetForm();
              setStatus({ type: 'idle', message: '' });
            }}
            disabled={isSubmitting}
          >
            Wyczyść formularz
          </button>
          <button type="submit" className="button" disabled={isSubmitting}>
            {isSubmitting ? 'Zapisywanie...' : 'Zapisz raport'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default App;
