import type { TaxRules } from './types';

export const TAX_CONFIG: Record<number, TaxRules> = {
  2025: {
    minWage: 740,
    nonTaxableMin: 510,
    priorMinWage: 700,
    priorNonTaxableMin: 510,
    vsaoiEmployee: 0.105,
    vsaoiEmployer: 0.2359,
    vsaoiPensionerEmployee: 0.0925,
    vsaoiPensionerEmployer: 0.2077,
    vsaoiServiceEmployee: 0.0976,
    vsaoiServiceEmployer: 0.2194,
    iinRateLow: 0.255,
    iinRateHigh: 0.33,
    iinThreshold: 8775,
    dependentRelief: 250,
    riskDuty: 0.36,
    disabilityRelief12: 154,
    disabilityRelief3: 120,
    repressedRelief: 154,
    specialNonTaxable: 500,
  },
  2026: {
    minWage: 780,
    nonTaxableMin: 550,
    priorMinWage: 740,
    priorNonTaxableMin: 510,
    vsaoiEmployee: 0.105,
    vsaoiEmployer: 0.2359,
    vsaoiPensionerEmployee: 0.0925,
    vsaoiPensionerEmployer: 0.2077,
    vsaoiServiceEmployee: 0.0976,
    vsaoiServiceEmployer: 0.2194,
    iinRateLow: 0.255,
    iinRateHigh: 0.33,
    iinThreshold: 8775,
    dependentRelief: 250,
    riskDuty: 0.36,
    disabilityRelief12: 154,
    disabilityRelief3: 120,
    repressedRelief: 154,
    specialNonTaxable: 500,
  },
};

export const SUPPORTED_YEARS = [2025, 2026] as const;
export type SupportedYear = (typeof SUPPORTED_YEARS)[number];

export const isSupportedYear = (y: number): y is SupportedYear =>
  (SUPPORTED_YEARS as readonly number[]).includes(y);
