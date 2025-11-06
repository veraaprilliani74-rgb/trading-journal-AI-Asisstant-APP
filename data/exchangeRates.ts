
export const exchangeRates: { [key: string]: number } = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 157.50,
  IDR: 16250,
};

export const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  IDR: 'Rp',
};

export const availableCurrencies = Object.keys(exchangeRates);
