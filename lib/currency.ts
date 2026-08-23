export type CurrencyCode =
  | "IDR"
  | "USD"
  | "AUD"
  | "EUR"
  | "JPY"
  | "KRW"
  | "CNY";

export interface CurrencyConfig {
  code: CurrencyCode;
  label: string;
  symbol: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: "IDR", label: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "USD", label: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "EUR", label: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "KRW", label: "Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "CNY", label: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
];

export interface ExchangeRatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

/**
 * Fallback baseline exchange rates against 1 IDR in case external API is temporarily down
 */
export const FALLBACK_RATES: Record<string, number> = {
  USD: 0.000057,
  AUD: 0.000079,
  EUR: 0.000048,
  JPY: 0.00899,
  KRW: 0.07839,
  CNY: 0.00038,
};

/**
 * Fetches real-time exchange rates from Frankfurter API with 6-hour Next.js revalidation cache
 */
export async function getExchangeRates(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=IDR&to=USD,AUD,EUR,JPY,KRW,CNY",
      {
        next: { revalidate: 21600 }, // 6 hours cache
      }
    );

    if (!res.ok) {
      console.warn(`Frankfurter API returned status ${res.status}, using fallback rates.`);
      return FALLBACK_RATES;
    }

    const data: ExchangeRatesResponse = await res.json();
    return data.rates || FALLBACK_RATES;
  } catch (error) {
    console.warn("Failed to fetch from Frankfurter API, using fallback rates:", error);
    return FALLBACK_RATES;
  }
}

/**
 * Formats an estimate string for a given amount in IDR into target foreign currency.
 * If target currency is IDR or rate is not found, returns null so the UI can gracefully omit it.
 * Example output: "≈ $145 USD", "≈ ¥31,450 JPY", "≈ €205 EUR"
 */
export function formatCurrencyEstimate(
  amountInIdr: number,
  targetCurrency: CurrencyCode,
  rates: Record<string, number> | null
): string | null {
  if (targetCurrency === "IDR") return null;
  if (!rates) return null;

  const rate = rates[targetCurrency];
  if (!rate || typeof rate !== "number" || isNaN(rate) || rate <= 0) {
    return null;
  }

  const converted = amountInIdr * rate;
  const currencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === targetCurrency);
  const symbol = currencyInfo?.symbol || "";

  // Decide decimal places: 0 for JPY, KRW or amounts >= 100, 2 for smaller amounts
  let formattedNumber: string;
  if (targetCurrency === "JPY" || targetCurrency === "KRW" || converted >= 50) {
    formattedNumber = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(Math.round(converted));
  } else {
    formattedNumber = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  }

  return `≈ ${symbol}${formattedNumber} ${targetCurrency}`;
}
