import { round } from './round';
import type { TaxCalculationResult, TaxInput } from './types';

export function calculateTaxFromGross(
  grossVal: number,
  depCount: number,
  hasBook: boolean,
  input: TaxInput,
): TaxCalculationResult {
  const { rules, pensionType, disabilityGroup, isRepressed } = input;
  const safeGross = Math.max(0, grossVal || 0);

  let rateEmp = rules.vsaoiEmployee;
  let rateEmployer = rules.vsaoiEmployer;

  if (pensionType === 'old_age') {
    rateEmp = rules.vsaoiPensionerEmployee;
    rateEmployer = rules.vsaoiPensionerEmployer;
  } else if (pensionType === 'service') {
    rateEmp = rules.vsaoiServiceEmployee;
    rateEmployer = rules.vsaoiServiceEmployer;
  }

  const vsaoiEmp = round(safeGross * rateEmp);

  let appliedNonTaxable = 0;
  let reliefDependents = 0;
  let reliefDisability = 0;
  let reliefRepressed = 0;

  if (hasBook) {
    if (pensionType !== 'none' || disabilityGroup !== 'none') {
      appliedNonTaxable = rules.specialNonTaxable;
    } else {
      appliedNonTaxable = rules.nonTaxableMin;
    }

    reliefDependents = round(depCount * rules.dependentRelief);

    if (disabilityGroup === '1' || disabilityGroup === '2') reliefDisability = rules.disabilityRelief12;
    if (disabilityGroup === '3') reliefDisability = rules.disabilityRelief3;

    if (isRepressed) reliefRepressed = rules.repressedRelief;
  }

  const totalReliefs = reliefDependents + reliefDisability + reliefRepressed;

  const taxBase = Math.max(0, round(safeGross - vsaoiEmp - appliedNonTaxable - totalReliefs));

  let iin = 0;
  if (taxBase > rules.iinThreshold) {
    const highPart = round(taxBase - rules.iinThreshold);
    const lowPart = rules.iinThreshold;
    const iinLow = round(lowPart * rules.iinRateLow);
    const iinHigh = round(highPart * rules.iinRateHigh);
    iin = iinLow + iinHigh;
  } else {
    iin = round(taxBase * rules.iinRateLow);
  }

  const net = round(safeGross - vsaoiEmp - iin);
  const vsaoiEmployer = round(safeGross * rateEmployer);
  const riskDuty = safeGross > 0 ? rules.riskDuty : 0;
  const totalEmployerCost = round(safeGross + vsaoiEmployer + riskDuty);

  return {
    gross: safeGross,
    net,
    vsaoiEmployee: vsaoiEmp,
    iin,
    employerVsaoi: vsaoiEmployer,
    riskDuty,
    totalEmployerCost,
    nonTaxableMinApplied: appliedNonTaxable,
    reliefDependents,
    reliefDisability,
    reliefRepressed,
    totalReliefsApplied: totalReliefs,
    taxBase,
    rateEmp,
    rateEmployer,
  };
}

export function calculateGrossFromNet(
  targetNet: number,
  depCount: number,
  hasBook: boolean,
  input: TaxInput,
): TaxCalculationResult {
  let low = targetNet;
  let high = targetNet * 2.5;
  let calculatedGross = 0;

  for (let iterations = 0; iterations < 25; iterations++) {
    const mid = (low + high) / 2;
    const res = calculateTaxFromGross(mid, depCount, hasBook, input);
    if (Math.abs(res.net - targetNet) < 0.05) {
      calculatedGross = mid;
      break;
    }
    if (res.net < targetNet) low = mid;
    else high = mid;
    calculatedGross = mid;
  }
  return calculateTaxFromGross(calculatedGross, depCount, hasBook, input);
}
