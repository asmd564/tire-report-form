import { z } from 'zod';

export const WHEEL_POSITIONS = [
  { key: 'front_left', label: 'Przód-L' },
  { key: 'front_right', label: 'Przód-P' },
  { key: 'rear_left', label: 'Tył-L' },
  { key: 'rear_right', label: 'Tył-P' },
] as const;

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i;
const TIRE_SIZE_REGEX = /^\d{3}\/\d{2}\s?R\d{2}$/i;

const isValidDotDate = (value: string) => {
  if (!/^\d{4}$/.test(value)) return false;
  const week = Number(value.slice(0, 2));
  return week >= 1 && week <= 53;
};

const optionalEmailSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .refine((value) => !value || z.string().email().safeParse(value).success, {
    message: 'Podaj poprawny adres email albo zostaw pole puste.',
  });

const normalizeNumberInput = (value: unknown) => {
  if (value === '' || value === null || typeof value === 'undefined') return undefined;
  if (typeof value === 'number' && Number.isNaN(value)) return undefined;
  return Number(value);
};

export const tireSchema = z.object({
  position: z.enum(['front_left', 'front_right', 'rear_left', 'rear_right']),
  tireBrand: z
    .string()
    .trim()
    .min(2, 'Podaj markę opony.')
    .max(80, 'Marka opony jest zbyt długa.'),
  size: z
    .string()
    .trim()
    .regex(TIRE_SIZE_REGEX, 'Podaj rozmiar w formacie np. 205/55 R16.'),
  treadDepthMm: z.preprocess(
    normalizeNumberInput,
    z
      .number({
        required_error: 'Podaj głębokość bieżnika w mm.',
        invalid_type_error: 'Podaj głębokość bieżnika w mm.',
      })
      .min(0, 'Głębokość nie może być ujemna.')
      .max(20, 'Podana wartość wygląda na zbyt wysoką.'),
  ),
  dotCode: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'Podaj ostatnie 4 cyfry DOT, np. 2322.')
    .refine(isValidDotDate, 'Pierwsze dwie cyfry DOT muszą oznaczać tydzień 01–53.'),
  rating: z.preprocess(
    normalizeNumberInput,
    z
      .number({ required_error: 'Wybierz ocenę.', invalid_type_error: 'Wybierz ocenę.' })
      .int('Ocena musi być liczbą całkowitą.')
      .min(1, 'Minimalna ocena to 1.')
      .max(5, 'Maksymalna ocena to 5.'),
  ),
  notes: z.string().trim().max(500, 'Uwagi mogą mieć maksymalnie 500 znaków.').optional().or(z.literal('')),
});

export const tireReportSchema = z.object({
  vehicleMake: z
    .string()
    .trim()
    .min(2, 'Podaj markę pojazdu.')
    .max(80, 'Marka pojazdu jest zbyt długa.'),
  vehicleModel: z
    .string()
    .trim()
    .min(1, 'Podaj model pojazdu.')
    .max(80, 'Model pojazdu jest zbyt długi.'),
  vin: z
    .string()
    .trim()
    .regex(VIN_REGEX, 'VIN musi mieć 17 znaków i nie może zawierać liter I, O ani Q.'),
  submitterEmail: optionalEmailSchema,
  tires: z.array(tireSchema).length(4, 'Raport musi zawierać ocenę 4 kół.'),
});

export type TireReportFormInput = z.input<typeof tireReportSchema>;
export type TireReportFormValues = z.output<typeof tireReportSchema>;

export const createDefaultValues = (): TireReportFormInput => ({
  vehicleMake: '',
  vehicleModel: '',
  vin: '',
  submitterEmail: '',
  tires: WHEEL_POSITIONS.map((position) => ({
    position: position.key,
    tireBrand: '',
    size: '',
    treadDepthMm: '' as unknown as number,
    dotCode: '',
    rating: 3,
    notes: '',
  })),
});

export const getTreadWarning = (depth?: number) => {
  if (typeof depth !== 'number' || Number.isNaN(depth)) return null;

  if (depth < 1.6) {
    return 'Bardzo niski bieżnik — warto pilnie zweryfikować stan opony.';
  }

  if (depth < 3) {
    return 'Bieżnik wymaga uwagi. Formularz można wysłać, ale raport oznaczy tę oponę jako wymagającą kontroli.';
  }

  return null;
};

export const normalizeReportPayload = (values: TireReportFormValues) => ({
  vehicle_make: values.vehicleMake.trim(),
  vehicle_model: values.vehicleModel.trim(),
  vin: values.vin.trim().toUpperCase(),
  submitter_email: values.submitterEmail?.trim() || null,
  tires: values.tires.map((tire) => ({
    position: tire.position,
    tire_brand: tire.tireBrand.trim(),
    size: tire.size.trim().toUpperCase().replace(/\s*R/i, ' R'),
    tread_depth_mm: Number(tire.treadDepthMm),
    dot_code: tire.dotCode.trim(),
    rating: Number(tire.rating),
    notes: tire.notes?.trim() || null,
    warning: getTreadWarning(Number(tire.treadDepthMm)),
  })),
});
