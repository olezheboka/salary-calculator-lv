import { isSupportedYear } from './tax/config';
import type { DisabilityGroup, PensionType } from './tax/types';

export type Lang = 'lv' | 'ru' | 'en';
export type Mode = 'gross' | 'net';
export type Period = 'monthly' | 'yearly';

export const DEFAULTS = {
  lang: 'lv' as Lang,
  year: 2026,
  mode: 'gross' as Mode,
  period: 'monthly' as Period,
  amount: 1500,
  dependents: 0,
  book: true,
  pension: 'none' as PensionType,
  disability: 'none' as DisabilityGroup,
  repressed: false,
} as const;

export type UrlState = {
  lang: Lang;
  year: number;
  mode: Mode;
  period: Period;
  amount: number;
  dependents: number;
  book: boolean;
  pension: PensionType;
  disability: DisabilityGroup;
  repressed: boolean;
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const parseYear = (raw: string | null): number => {
  if (!raw) return DEFAULTS.year;
  const n = Number(raw);
  if (!Number.isFinite(n) || !isSupportedYear(n)) return DEFAULTS.year;
  return n;
};

const parseAmount = (raw: string | null): number => {
  if (raw === null) return DEFAULTS.amount;
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULTS.amount;
  return clamp(n, 0, 1e9);
};

const parseDeps = (raw: string | null): number => {
  if (raw === null) return DEFAULTS.dependents;
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULTS.dependents;
  return clamp(Math.trunc(n), 0, 50);
};

export const getInitialState = (): UrlState => {
  if (typeof window === 'undefined') {
    return {
      lang: DEFAULTS.lang,
      year: DEFAULTS.year,
      mode: DEFAULTS.mode,
      period: DEFAULTS.period,
      amount: DEFAULTS.amount,
      dependents: DEFAULTS.dependents,
      book: DEFAULTS.book,
      pension: DEFAULTS.pension,
      disability: DEFAULTS.disability,
      repressed: DEFAULTS.repressed,
    };
  }
  const params = new URLSearchParams(window.location.search);

  const langRaw = params.get('lang');
  const lang: Lang = langRaw === 'ru' || langRaw === 'en' ? langRaw : DEFAULTS.lang;

  const mode: Mode = params.get('mode') === 'net' ? 'net' : DEFAULTS.mode;
  const period: Period = params.get('period') === 'yearly' ? 'yearly' : DEFAULTS.period;
  const book = params.get('book') === 'false' ? false : DEFAULTS.book;

  const pensionRaw = params.get('pension');
  const pension: PensionType =
    pensionRaw === 'service' || pensionRaw === 'old_age' ? pensionRaw : DEFAULTS.pension;

  const disabilityRaw = params.get('disability');
  const disability: DisabilityGroup =
    disabilityRaw === '1' || disabilityRaw === '2' || disabilityRaw === '3'
      ? disabilityRaw
      : DEFAULTS.disability;

  const repressed = params.get('repressed') === 'true';

  return {
    lang,
    year: parseYear(params.get('year')),
    mode,
    period,
    amount: parseAmount(params.get('salary')),
    dependents: parseDeps(params.get('deps')),
    book,
    pension,
    disability,
    repressed,
  };
};

export const buildUrlSearch = (s: UrlState): string => {
  const params = new URLSearchParams();
  if (s.lang !== DEFAULTS.lang) params.set('lang', s.lang);
  if (s.year !== DEFAULTS.year) params.set('year', s.year.toString());
  if (s.mode !== DEFAULTS.mode) params.set('mode', s.mode);
  if (s.period !== DEFAULTS.period) params.set('period', s.period);
  if (s.amount !== DEFAULTS.amount) params.set('salary', s.amount.toString());
  if (s.dependents !== DEFAULTS.dependents) params.set('deps', s.dependents.toString());
  if (s.book !== DEFAULTS.book) params.set('book', 'false');
  if (s.pension !== DEFAULTS.pension) params.set('pension', s.pension);
  if (s.disability !== DEFAULTS.disability) params.set('disability', s.disability);
  if (s.repressed !== DEFAULTS.repressed) params.set('repressed', 'true');
  return params.toString();
};
