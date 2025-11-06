
import React, { createContext, useState, useContext, useMemo } from 'react';
import { exchangeRates, currencySymbols, availableCurrencies } from '../data/exchangeRates';

interface ConvertedAmount {
  value: number;
  formatted: string;
  symbol: string;
  currency: string;
}

interface CurrencyContextType {
  selectedCurrency: string;
  currencies: string[];
  setSelectedCurrency: (currency: string) => void;
  convert: (amountInUsd: number) => ConvertedAmount;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const convert = useMemo(() => (amountInUsd: number): ConvertedAmount => {
    const rate = exchangeRates[selectedCurrency] || 1;
    const symbol = currencySymbols[selectedCurrency] || '$';
    const convertedAmount = amountInUsd * rate;

    // Handle currencies that don't typically use decimals
    const fractionDigits = ['JPY', 'IDR'].includes(selectedCurrency) ? 0 : 2;

    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    
    return {
      value: convertedAmount,
      formatted: formatter.format(convertedAmount),
      symbol,
      currency: selectedCurrency
    };
  }, [selectedCurrency]);


  const value = {
    selectedCurrency,
    currencies: availableCurrencies,
    setSelectedCurrency,
    convert,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
