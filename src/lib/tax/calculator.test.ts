import { describe, expect, it } from 'vitest';

import { calculateGrossFromNet, calculateTaxFromGross } from './calculator';
import { TAX_CONFIG } from './config';
import type { DisabilityGroup, PensionType, TaxInput } from './types';

const buildInput = (
  year: number,
  overrides: Partial<Omit<TaxInput, 'rules'>> = {},
): TaxInput => ({
  rules: TAX_CONFIG[year],
  pensionType: 'none',
  disabilityGroup: 'none',
  isRepressed: false,
  ...overrides,
});

describe('calculateTaxFromGross', () => {
  it('computes 1500 gross 2026 with tax book', () => {
    const r = calculateTaxFromGross(1500, 0, true, buildInput(2026));

    expect(r.vsaoiEmployee).toBe(157.5);
    expect(r.nonTaxableMinApplied).toBe(550);
    expect(r.reliefDependents).toBe(0);
    expect(r.taxBase).toBe(792.5);
    expect(r.iin).toBe(202.09);
    expect(r.net).toBe(1140.41);
    expect(r.employerVsaoi).toBe(353.85);
    expect(r.riskDuty).toBe(0.36);
    expect(r.totalEmployerCost).toBe(1854.21);
  });

  it('applies pensioner rate and special non-taxable with 2 dependents (2026)', () => {
    const r = calculateTaxFromGross(
      2000,
      2,
      true,
      buildInput(2026, { pensionType: 'old_age' as PensionType }),
    );

    expect(r.rateEmp).toBe(0.0925);
    expect(r.vsaoiEmployee).toBe(185);
    expect(r.nonTaxableMinApplied).toBe(500);
    expect(r.reliefDependents).toBe(500);
    expect(r.taxBase).toBe(815);
    expect(r.iin).toBe(207.83);
    expect(r.net).toBe(1607.17);
  });

  it('applies progressive IIN above threshold (20000 gross 2025)', () => {
    const r = calculateTaxFromGross(20000, 0, true, buildInput(2025));

    expect(r.vsaoiEmployee).toBe(2100);
    expect(r.nonTaxableMinApplied).toBe(510);
    expect(r.taxBase).toBe(17390);
    // 8775 * 0.255 = 2237.6325 → 2237.63; 8615 * 0.33 = 2842.95; sum = 5080.58
    expect(r.iin).toBe(5080.58);
    expect(r.net).toBe(12819.42);
  });

  it('gives zero reliefs when tax book is not submitted', () => {
    const r = calculateTaxFromGross(1000, 3, false, buildInput(2026));

    expect(r.nonTaxableMinApplied).toBe(0);
    expect(r.reliefDependents).toBe(0);
    expect(r.reliefDisability).toBe(0);
    expect(r.reliefRepressed).toBe(0);
    expect(r.taxBase).toBe(895);
    expect(r.iin).toBe(228.23);
    expect(r.net).toBe(666.77);
  });

  it('applies disability group 1 relief and special non-taxable', () => {
    const r = calculateTaxFromGross(
      2000,
      0,
      true,
      buildInput(2026, { disabilityGroup: '1' as DisabilityGroup }),
    );

    expect(r.nonTaxableMinApplied).toBe(500);
    expect(r.reliefDisability).toBe(154);
    expect(r.taxBase).toBe(2000 - 210 - 500 - 154);
  });

  it('applies disability group 3 relief amount', () => {
    const r = calculateTaxFromGross(
      2000,
      0,
      true,
      buildInput(2026, { disabilityGroup: '3' as DisabilityGroup }),
    );

    expect(r.reliefDisability).toBe(120);
  });

  it('applies repressed relief', () => {
    const r = calculateTaxFromGross(
      2000,
      0,
      true,
      buildInput(2026, { isRepressed: true }),
    );

    expect(r.reliefRepressed).toBe(154);
    expect(r.nonTaxableMinApplied).toBe(550);
  });

  it('returns zeros for zero gross and skips risk duty', () => {
    const r = calculateTaxFromGross(0, 0, true, buildInput(2026));

    expect(r.gross).toBe(0);
    expect(r.vsaoiEmployee).toBe(0);
    expect(r.iin).toBe(0);
    expect(r.net).toBe(0);
    expect(r.riskDuty).toBe(0);
    expect(r.totalEmployerCost).toBe(0);
  });

  it('clamps negative gross to zero', () => {
    const r = calculateTaxFromGross(-500, 0, true, buildInput(2026));
    expect(r.gross).toBe(0);
    expect(r.net).toBe(0);
  });

  it('never returns a negative tax base when reliefs exceed income', () => {
    const r = calculateTaxFromGross(
      300,
      5,
      true,
      buildInput(2026, { disabilityGroup: '1', isRepressed: true }),
    );
    expect(r.taxBase).toBe(0);
    expect(r.iin).toBe(0);
  });
});

describe('calculateGrossFromNet', () => {
  it('inverts 1140.41 net back to ~1500 gross (2026, book)', () => {
    const r = calculateGrossFromNet(1140.41, 0, true, buildInput(2026));
    expect(Math.abs(r.gross - 1500)).toBeLessThan(0.1);
    expect(Math.abs(r.net - 1140.41)).toBeLessThan(0.1);
  });

  it('inverts 1607.17 net for pensioner with 2 deps (2026, book)', () => {
    const r = calculateGrossFromNet(
      1607.17,
      2,
      true,
      buildInput(2026, { pensionType: 'old_age' }),
    );
    expect(Math.abs(r.gross - 2000)).toBeLessThan(0.1);
  });

  it('inverts 12819.42 net in the high IIN band (2025, book)', () => {
    const r = calculateGrossFromNet(12819.42, 0, true, buildInput(2025));
    expect(Math.abs(r.gross - 20000)).toBeLessThan(0.1);
  });
});
