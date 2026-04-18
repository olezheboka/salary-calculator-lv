export type TaxRules = {
  minWage: number;
  nonTaxableMin: number;
  priorMinWage: number;
  priorNonTaxableMin: number;
  vsaoiEmployee: number;
  vsaoiEmployer: number;
  vsaoiPensionerEmployee: number;
  vsaoiPensionerEmployer: number;
  vsaoiServiceEmployee: number;
  vsaoiServiceEmployer: number;
  iinRateLow: number;
  iinRateHigh: number;
  iinThreshold: number;
  dependentRelief: number;
  riskDuty: number;
  disabilityRelief12: number;
  disabilityRelief3: number;
  repressedRelief: number;
  specialNonTaxable: number;
};

export type TaxCalculationResult = {
  gross: number;
  net: number;
  vsaoiEmployee: number;
  iin: number;
  employerVsaoi: number;
  riskDuty: number;
  totalEmployerCost: number;
  nonTaxableMinApplied: number;
  reliefDependents: number;
  reliefDisability: number;
  reliefRepressed: number;
  totalReliefsApplied: number;
  taxBase: number;
  rateEmp: number;
  rateEmployer: number;
};

export type PensionType = 'none' | 'service' | 'old_age';
export type DisabilityGroup = 'none' | '1' | '2' | '3';

export type TaxInput = {
  rules: TaxRules;
  pensionType: PensionType;
  disabilityGroup: DisabilityGroup;
  isRepressed: boolean;
};
