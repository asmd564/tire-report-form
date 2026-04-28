export const formatTireSizeInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 7);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 5) {
    return `${digits.slice(0, 3)}/${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}/${digits.slice(3, 5)} R${digits.slice(5)}`;
};

export const normalizeVinInput = (value: string) => value.toUpperCase().replace(/[IOQ\s-]/g, '').slice(0, 17);
