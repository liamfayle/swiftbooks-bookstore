import { useMemo } from "react";

export const useCurrencyFormat = () =>
  useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: 2,
      }),
    [],
  );

export const useNumberFormat = () => useMemo(() => new Intl.NumberFormat(), []);
