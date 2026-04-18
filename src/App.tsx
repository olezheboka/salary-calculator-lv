import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Accessibility,
  Armchair,
  ArrowUpRight,
  BookCheck,
  Calendar,
  CheckCircle2,
  Info,
  Landmark,
  Minus,
  Plus,
  TrendingDown,
  Users,
} from 'lucide-react';
import { AnimatePresence, m } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { SUPPORTED_YEARS, TAX_CONFIG } from './lib/tax/config';
import { calculateGrossFromNet, calculateTaxFromGross } from './lib/tax/calculator';
import type { TaxCalculationResult } from './lib/tax/types';
import {
  DEFAULTS,
  buildUrlSearch,
  getInitialState,
  type Lang,
  type Mode,
  type Period,
} from './lib/url-state';
import { TRANSLATIONS } from './i18n/translations';
import { AnimatedCounter } from './components/AnimatedCounter';
import { TableRow, TableRows } from './components/TableRow';

const SalaryCalculator = () => {
  const initial = useMemo(() => getInitialState(), []);

  const [lang, setLang] = useState<Lang>(initial.lang);
  const [year, setYear] = useState<number>(initial.year);
  const [mode, setMode] = useState<Mode>(initial.mode);
  const [period, setPeriod] = useState<Period>(initial.period);
  const [amount, setAmount] = useState<number | string>(initial.amount);
  const [dependents, setDependents] = useState(initial.dependents);
  const [taxBookSubmitted, setTaxBookSubmitted] = useState(initial.book);
  const [pensionType, setPensionType] = useState(initial.pension);
  const [disabilityGroup, setDisabilityGroup] = useState(initial.disability);
  const [isRepressed, setIsRepressed] = useState(initial.repressed);
  const [showRepressedTooltip, setShowRepressedTooltip] = useState(false);

  useEffect(() => {
    const numericAmount = typeof amount === 'string' && amount === '' ? 0 : Number(amount);
    const search = buildUrlSearch({
      lang,
      year,
      mode,
      period,
      amount: numericAmount,
      dependents,
      book: taxBookSubmitted,
      pension: pensionType,
      disability: disabilityGroup,
      repressed: isRepressed,
    });
    const newUrl = search ? `?${search}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [lang, year, mode, period, amount, dependents, taxBookSubmitted, pensionType, disabilityGroup, isRepressed]);

  const rules = useMemo(() => TAX_CONFIG[year] || TAX_CONFIG[DEFAULTS.year], [year]);
  const t = TRANSLATIONS[lang];

  const taxInput = useMemo(
    () => ({ rules, pensionType, disabilityGroup, isRepressed }),
    [rules, pensionType, disabilityGroup, isRepressed],
  );

  const getInputLabel = () => {
    if (mode === 'gross') {
      return period === 'monthly' ? t.gross_salary_monthly : t.gross_salary_yearly;
    }
    return period === 'monthly' ? t.net_salary_monthly : t.net_salary_yearly;
  };

  const calcFromGross = useCallback(
    (grossVal: number, depCount: number, hasBook: boolean) =>
      calculateTaxFromGross(grossVal, depCount, hasBook, taxInput),
    [taxInput],
  );

  const calcFromNet = useCallback(
    (targetNet: number, depCount: number, hasBook: boolean) =>
      calculateGrossFromNet(targetNet, depCount, hasBook, taxInput),
    [taxInput],
  );

  const results: TaxCalculationResult = useMemo(() => {
    let inputVal = typeof amount === 'string' && amount === '' ? 0 : Number(amount);
    if (period === 'yearly') inputVal = inputVal / 12;

    return mode === 'gross'
      ? calcFromGross(inputVal, dependents, taxBookSubmitted)
      : calcFromNet(inputVal, dependents, taxBookSubmitted);
  }, [amount, dependents, taxBookSubmitted, mode, period, calcFromGross, calcFromNet]);

  const displayVal = (val: number | undefined) => {
    if (val === undefined) return 0;
    return period === 'yearly' ? val * 12 : val;
  };

  let iinLabel = `${t.income_tax} (${(rules.iinRateLow * 100).toFixed(1)}%)`;
  if (results.taxBase > rules.iinThreshold) {
    iinLabel = `${t.income_tax} (${(rules.iinRateLow * 100).toFixed(1)}% / ${(rules.iinRateHigh * 100).toFixed(0)}%)`;
  }

  const vsaoiLabel = `${t.social_tax} (${((results.rateEmp || rules.vsaoiEmployee) * 100).toFixed(2)}%)`;
  const employerVsaoiLabel = `${t.social_tax} (${((results.rateEmployer || rules.vsaoiEmployer) * 100).toFixed(2)}%)`;

  const generateSummary = () => {
    const sentences = [];
    const modeText = mode === 'gross' ? t.gross.toLowerCase() : t.net.toLowerCase();
    const periodText = period === 'monthly' ? t.summary.period_month : t.summary.period_year;

    sentences.push(`${t.summary.calc_prefix} ${periodText} ${modeText} ${t.summary.salary} (${year}).`);

    if (taxBookSubmitted) sentences.push(t.summary.book_yes);
    else sentences.push(t.summary.book_no);
    if (dependents > 0) sentences.push(`${t.summary.dep_prefix} ${dependents}.`);
    const statusParts = [];
    if (pensionType === 'old_age') statusParts.push(t.summary.pension_old);
    if (pensionType === 'service') statusParts.push(t.summary.pension_service);
    if (disabilityGroup !== 'none') statusParts.push(`${disabilityGroup}. ${t.summary.disability}`);
    if (isRepressed) statusParts.push(t.summary.repressed);
    if (statusParts.length > 0) sentences.push(`${t.summary.status_prefix} ${statusParts.join(', ')}.`);
    return sentences.join(' ');
  };

  const getMinWageError = () => {
    if (!rules) return null;
    const numericAmount = typeof amount === 'number' ? amount : 0;
    const minWageThreshold = period === 'yearly' ? rules.minWage * 12 : rules.minWage;
    if (numericAmount > 0 && numericAmount < minWageThreshold) {
      return (
        <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1 pl-1">
          ⚠️ {t.min_wage_error}: {minWageThreshold} EUR
        </p>
      );
    }
    return null;
  };

  const isGrossMode = mode === 'gross';
  const mainResultLabel = isGrossMode ? t.final_net : t.gross_salary;
  const mainResultValue = isGrossMode ? results.net : results.gross;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">

      {/* HEADER */}
      <div className="w-full max-w-6xl flex justify-end mb-4 px-4 relative">
        <div role="group" aria-label={t.a11y.language} className="bg-slate-100 p-1 rounded-xl flex relative isolate gap-1">
          {(['lv', 'ru', 'en'] as const).map((l) => {
            const LangIcon = TRANSLATIONS[l].flag;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors uppercase relative z-10 ${lang === l ? 'text-indigo-900' : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <LangIcon className="w-4 h-3 rounded-[2px] shadow-sm object-cover" />
                {TRANSLATIONS[l].label}
                {lang === l && (
                  <m.div
                    layoutId="active-lang-pill"
                    className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-800 to-indigo-900 pb-2">
          {t.title}
        </h1>
        <p className="text-slate-400 font-medium">{t.subtitle}</p>
      </div>

      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row items-stretch min-h-[700px]">

        {/* LEFT SIDE */}
        <div className="p-6 md:p-10 lg:w-7/12 flex flex-col border-r border-slate-100 relative">

          <div className="flex flex-col gap-6 h-full">

            {/* Switcher (Mobile Fixed) */}
            <div role="group" aria-label={t.a11y.calculation_mode} className="bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl flex items-stretch relative isolate">
              {[
                { id: 'gross', label: t.gross_to_net },
                { id: 'net', label: t.net_to_gross }
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMode(option.id as Mode)}
                  aria-pressed={mode === option.id}
                  className={`flex-1 py-2 px-2 text-[10px] sm:text-xs md:text-sm font-bold rounded-xl relative z-10 flex items-center justify-center text-center whitespace-normal leading-tight transition-colors ${mode === option.id ? 'text-indigo-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  <span className="relative z-10">{option.label}</span>
                  {mode === option.id && (
                    <m.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Input (Updated Logic) */}
            <div className="relative group">
              <div className="flex justify-between items-center mb-3">
                <label htmlFor="salary-amount" className="text-xs font-bold text-slate-400 uppercase tracking-wider">{getInputLabel()}</label>

                <div role="group" aria-label={t.a11y.period} className="bg-slate-100 p-1 rounded-xl flex relative isolate">
                  {[
                    { id: 'monthly', label: t.monthly },
                    { id: 'yearly', label: t.yearly }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPeriod(opt.id as Period)}
                      aria-pressed={period === opt.id}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors relative z-10 ${period === opt.id ? 'text-indigo-900' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                      {opt.label}
                      {period === opt.id && (
                        <m.div
                          layoutId="period-pill"
                          className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center relative">
                <span aria-hidden="true" className="absolute left-6 text-3xl text-slate-400 group-focus-within:text-indigo-500 transition-colors">€</span>
                <input
                  id="salary-amount"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  aria-label={t.a11y.salary_amount}
                  value={amount}
                  onChange={(e) => { const val = e.target.value; setAmount(val === '' ? '' : Number(val)); }}
                  onBlur={() => { if (amount === '') setAmount(0); }}
                  className="w-full pl-14 pr-4 py-5 text-4xl md:text-5xl font-bold text-slate-800 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none"
                />
              </div>
              {getMinWageError()}
            </div>



            {/* Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col justify-between">
                <span id="dependents-label" className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Users size={18} aria-hidden="true" className="text-indigo-500" />
                  {t.dependents}
                </span>
                <div role="group" aria-labelledby="dependents-label" className="flex items-center justify-between bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200">
                  <button type="button" aria-label={t.a11y.dependents_decrement} onClick={() => setDependents(Math.max(0, dependents - 1))} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 active:scale-95 transition-transform"><Minus size={20} aria-hidden="true" /></button>
                  <span aria-live="polite" className="text-2xl font-bold text-slate-800 w-8 text-center">{dependents}</span>
                  <button type="button" aria-label={t.a11y.dependents_increment} onClick={() => setDependents(dependents + 1)} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-slate-100 text-indigo-600 active:scale-95 transition-transform"><Plus size={20} aria-hidden="true" /></button>
                </div>
              </div>

              <m.button
                type="button"
                role="switch"
                aria-checked={taxBookSubmitted}
                aria-label={t.a11y.tax_book_toggle}
                onClick={() => setTaxBookSubmitted(!taxBookSubmitted)}
                whileTap={{ scale: 0.98 }}
                className={`group cursor-pointer text-left rounded-3xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-200 ${taxBookSubmitted ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white border-slate-200'}`}
              >
                <div className="flex justify-between items-start z-10 h-full w-full">
                  <div className="flex flex-col justify-between h-full">
                    <span className={`text-sm font-bold flex items-center gap-2 ${taxBookSubmitted ? 'text-indigo-900' : 'text-slate-700'}`}>
                      <BookCheck size={18} aria-hidden="true" className={taxBookSubmitted ? 'text-indigo-600' : 'text-slate-400'} />
                      {t.tax_book}
                    </span>
                    <span className={`text-xs mt-1 ${taxBookSubmitted ? 'text-indigo-600' : 'text-slate-500'}`}>{taxBookSubmitted ? t.submitted : t.not_submitted}</span>
                  </div>
                  <div aria-hidden="true" className={`w-12 h-7 rounded-full p-1 transition-colors ${taxBookSubmitted ? 'bg-indigo-600' : 'bg-slate-200'}`}><m.div layout className={`w-5 h-5 bg-white rounded-full shadow-sm ${taxBookSubmitted ? 'ml-auto' : ''}`} /></div>
                </div>
              </m.button>
            </div>

            {/* Secondary (Grouped in Card) */}
            <div className="mt-4">
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200/60 space-y-4">

                {/* Pension (Fixed Layout: Centered & Wrapped) */}
                <div>
                  <span id="pension-label" className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Armchair size={16} aria-hidden="true" />
                    {t.pension}
                  </span>
                  <div role="group" aria-labelledby="pension-label" className="bg-slate-100 p-1 rounded-2xl flex relative isolate items-stretch">
                    {[
                      { id: 'none', label: t.none },
                      { id: 'service', label: t.service },
                      { id: 'old_age', label: t.old_age }
                    ].map((opt) => (
                      <button key={opt.id} type="button" aria-pressed={pensionType === opt.id} onClick={() => setPensionType(opt.id as 'none' | 'service' | 'old_age')} className={`flex-1 py-2 px-2 text-[10px] font-bold rounded-xl transition-all relative z-10 flex items-center justify-center text-center gap-1.5 whitespace-normal leading-tight h-auto min-h-[40px] ${pensionType === opt.id ? 'text-indigo-900' : 'text-slate-400 hover:text-slate-600'}`}>
                        <span>{opt.label}</span>
                        {pensionType === opt.id && <m.div layoutId="pension-pill" className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row for Disability & Status */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col h-full">
                    <span id="disability-label" className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Accessibility size={16} aria-hidden="true" />
                      {t.disability}
                    </span>
                    <div role="group" aria-labelledby="disability-label" className="bg-slate-100 p-1 rounded-2xl flex-1 flex items-stretch relative isolate h-full">
                      {[
                        { id: 'none', label: t.none },
                        { id: '1', label: t.group_1 },
                        { id: '2', label: t.group_2 },
                        { id: '3', label: t.group_3 }
                      ].map((grp) => (
                        <button key={grp.id} type="button" aria-pressed={disabilityGroup === grp.id} onClick={() => setDisabilityGroup(grp.id as 'none' | '1' | '2' | '3')} className={`flex-1 flex items-center justify-center py-2 text-[10px] font-bold rounded-xl transition-all relative z-10 ${disabilityGroup === grp.id ? 'text-indigo-900' : 'text-slate-400 hover:text-slate-600'}`}>
                          {grp.label}
                          {disabilityGroup === grp.id && <m.div layoutId="disability-pill" className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col h-full">
                    <span id="status-label" className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Landmark size={16} aria-hidden="true" />
                      {t.status}
                    </span>
                    <m.div
                      role="switch"
                      tabIndex={0}
                      aria-checked={isRepressed}
                      aria-labelledby="status-label repressed-status-text"
                      onClick={() => setIsRepressed(!isRepressed)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          setIsRepressed(!isRepressed);
                        }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`group cursor-pointer rounded-2xl border p-3 flex-1 flex items-center justify-between transition-all duration-200 min-h-[44px] h-full ${isRepressed ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:border-slate-300'} relative`}
                    >
                      <div className="flex items-center gap-1.5 flex-1 pr-2">
                        <span id="repressed-status-text" className={`text-[10px] font-bold leading-tight whitespace-normal ${isRepressed ? 'text-indigo-900' : 'text-slate-500'}`}>
                          {t.status_label}
                        </span>
                        <button
                          type="button"
                          aria-label={t.a11y.repressed_info}
                          aria-expanded={showRepressedTooltip}
                          aria-controls="repressed-tooltip"
                          onClick={(e) => { e.stopPropagation(); setShowRepressedTooltip(!showRepressedTooltip); }}
                          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') e.stopPropagation(); }}
                          onMouseEnter={() => setShowRepressedTooltip(true)}
                          onMouseLeave={() => setShowRepressedTooltip(false)}
                          className="text-slate-400 hover:text-indigo-500 transition-colors p-0.5 rounded-full hover:bg-slate-100 flex-shrink-0"
                        >
                          <Info size={14} aria-hidden="true" />
                        </button>
                        <AnimatePresence>
                          {showRepressedTooltip && (
                            <m.div
                              id="repressed-tooltip"
                              role="tooltip"
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="absolute bottom-[calc(100%+12px)] left-0 w-[280px] sm:w-96 p-4 bg-white shadow-2xl rounded-2xl border border-slate-100 text-left z-50 overflow-hidden"
                            >
                              <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                                <div className="mb-3">
                                  <h4 className="text-[11px] font-bold text-indigo-900 mb-1 leading-tight">{t.tooltip.title1}</h4>
                                  <p className="text-[10px] text-slate-500 leading-relaxed mb-1.5">{t.tooltip.desc1}</p>
                                  <ul className="text-[10px] text-slate-600 space-y-1 list-disc pl-3 marker:text-indigo-400">
                                    {t.tooltip.list1.map((item, i) => <li key={i}><span className="font-semibold text-slate-700">{item.b}</span> {item.t}</li>)}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-[11px] font-bold text-indigo-900 mb-1 leading-tight">{t.tooltip.title2}</h4>
                                  <p className="text-[10px] text-slate-500 leading-relaxed mb-1.5">{t.tooltip.desc2}</p>
                                  <ul className="text-[10px] text-slate-600 space-y-1 list-disc pl-3 marker:text-indigo-400">
                                    {t.tooltip.list2.map((item, i) => <li key={i}><span className="font-semibold text-slate-700">{item.b}</span> {item.t}</li>)}
                                  </ul>
                                </div>
                              </div>
                              <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white border-b border-r border-slate-100 transform rotate-45"></div>
                            </m.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div aria-hidden="true" className={`w-8 h-5 rounded-full p-0.5 transition-colors shrink-0 ${isRepressed ? 'bg-indigo-600' : 'bg-slate-200'}`}><m.div layout className={`w-4 h-4 bg-white rounded-full shadow-sm ${isRepressed ? 'ml-auto' : ''}`} /></div>
                    </m.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span id="year-label" className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Calendar size={14} aria-hidden="true" /> {t.summary.calc_prefix}</span>
                <div role="group" aria-labelledby="year-label" className="bg-slate-100 p-1 rounded-xl flex">
                  {SUPPORTED_YEARS.map((y) => (
                    <button key={y} type="button" aria-pressed={year === y} onClick={() => setYear(y)} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors relative z-10 flex items-center gap-1.5 ${year === y ? 'text-indigo-900' : 'text-slate-500 hover:text-slate-700'}`}>
                      {y} {year === y && <m.div layoutId="active-year-pill-bottom" className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 items-start p-5 rounded-3xl bg-slate-50/80 border border-slate-100 text-xs text-slate-600">
                <Info aria-hidden="true" className="w-5 h-5 shrink-0 mt-0.5 text-indigo-400" />
                <div>
                  <p className="font-bold text-slate-800 mb-1">{year}. {lang === 'lv' ? 'gada' : ''} {t.tax_env}:</p>
                  <ul className="space-y-1.5 pl-1">
                    {[
                      { label: t.min_wage_info, current: rules.minWage, prior: rules.priorMinWage },
                      { label: t.non_taxable, current: rules.nonTaxableMin, prior: rules.priorNonTaxableMin },
                    ].map(({ label, current, prior }) => {
                      const delta = current - prior;
                      const Icon = delta === 0 ? CheckCircle2 : ArrowUpRight;
                      const annotation = delta === 0 ? t.fixed : `+${delta}€`;
                      return (
                        <li key={label} className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                          <span className="flex items-center gap-2">
                            <Icon size={14} aria-hidden="true" className="text-emerald-500" />
                            {label}:
                          </span>
                          <strong className="pl-6 sm:pl-0">€{current} <span className="font-normal text-slate-500">({annotation})</span></strong>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (NEW DARK HERO DESIGN) */}
        <div className="p-6 md:p-10 lg:w-5/12 bg-slate-50 flex flex-col justify-between border-l border-slate-100">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6">

            {/* TOP HERO CARD: Result & Summary - DARK & BOLD (Colors Swapped) */}
            <div className="bg-slate-900 rounded-[2rem] shadow-xl p-8 flex flex-col justify-start relative overflow-hidden">
              <div className="mb-6 relative z-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  {t.results_title} ({year})
                </h3>
                {rules && (
                  <p className="text-[10px] leading-relaxed text-slate-400 font-sans border-l-2 border-indigo-500/50 pl-3">
                    {generateSummary()}
                  </p>
                )}
              </div>

              {/* Dynamic Big Result with "Badge" style */}
              <div className="relative z-10">
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700/50 flex flex-col items-start gap-1 shadow-inner">
                  <span className="text-xs font-bold text-white uppercase tracking-wider opacity-90">{mainResultLabel}</span>
                  <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 tracking-tight leading-none break-all sm:break-normal">
                    <AnimatedCounter value={displayVal(mainResultValue)} />
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE BLOCK: Taxes & Employer Costs */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              {/* Employee Taxes */}
              <div className="divide-y divide-slate-100">
                <div className="p-6">
                  <TableRows>
                    <TableRow label={vsaoiLabel} value={displayVal(results.vsaoiEmployee)} />
                    <TableRow label={iinLabel} value={displayVal(results.iin)} />
                  </TableRows>
                </div>

                {/* Reliefs Section (Distinct "Badge" Style) */}
                <div className="bg-slate-50/80 p-4 border-t border-b border-slate-100">
                  <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-white/50">
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                      <TrendingDown size={14} aria-hidden="true" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{t.reliefs_title}</span>
                    </div>
                    <TableRows>
                      {results.nonTaxableMinApplied > 0 && <TableRow label={t.relief_min} value={displayVal(results.nonTaxableMinApplied)} isNeutral size="sm" />}
                      {results.reliefDependents > 0 && <TableRow label={t.relief_dep} value={displayVal(results.reliefDependents)} isNeutral size="sm" />}
                      {results.reliefDisability > 0 && <TableRow label={t.relief_dis} value={displayVal(results.reliefDisability)} isNeutral size="sm" />}
                      {results.reliefRepressed > 0 && <TableRow label={t.relief_rep} value={displayVal(results.reliefRepressed)} isNeutral size="sm" />}
                      {results.nonTaxableMinApplied === 0 && results.totalReliefsApplied === 0 && <span className="text-[10px] text-slate-400 italic pl-1">{t.no_reliefs}</span>}
                    </TableRows>
                  </div>
                </div>

                {/* Employer Costs */}
                <div className="p-6">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t.employer_costs}</h3>
                  <TableRows>
                    <TableRow label={employerVsaoiLabel} value={displayVal(results.employerVsaoi)} isNeutral />
                    <TableRow label={t.risk_duty} value={displayVal(results.riskDuty)} isNeutral />
                    <div className="pt-3 border-t border-slate-100 mt-2">
                      <TableRow label={t.total_cost} value={displayVal(results.totalEmployerCost)} isBold />
                    </div>
                  </TableRows>
                </div>
              </div>
            </div>

            {/* Warning Card for High Income (Moved Here) */}
            {(results.gross * (period === 'monthly' ? 12 : 1)) > 200000 && (
              <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 flex gap-4 text-amber-900 mt-auto">
                <Info aria-hidden="true" className="shrink-0 text-amber-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-bold text-sm mb-1.5">{t.summary.warning_title}</h3>
                  <p className="text-xs leading-relaxed opacity-90">{t.summary.warning_text}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Analytics />
      <SpeedInsights />
    </div >
  );
};

export default SalaryCalculator;
