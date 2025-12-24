import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Minus, Calendar, TrendingDown, Info, ArrowUpRight, CheckCircle2, Wallet, 
  Users, BookCheck, Landmark, Briefcase, Ban, Clock, Accessibility, Armchair, Gavel, Globe 
} from 'lucide-react';
import { motion, useTransform, animate, useMotionValue, AnimatePresence } from 'framer-motion';

// --- FLAG ICONS ---

const FlagLV = ({ className = "" }) => (
  <svg viewBox="0 0 32 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="24" fill="#9E3039"/>
    <rect y="9.6" width="32" height="4.8" fill="#FFF"/>
  </svg>
);

const FlagRU = ({ className = "" }) => (
  <svg viewBox="0 0 32 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="24" fill="#FFF"/>
    <rect y="8" width="32" height="8" fill="#0039A6"/>
    <rect y="16" width="32" height="8" fill="#D52B1E"/>
  </svg>
);

const FlagEN = ({ className = "" }) => (
  <svg viewBox="0 0 32 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="24" fill="#012169"/>
    <path d="M0 0 L32 24 M32 0 L0 24" stroke="#FFF" strokeWidth="3"/>
    <path d="M0 0 L32 24 M32 0 L0 24" stroke="#C8102E" strokeWidth="1.5"/>
    <path d="M16 0 V24 M0 12 H32" stroke="#FFF" strokeWidth="5"/>
    <path d="M16 0 V24 M0 12 H32" stroke="#C8102E" strokeWidth="3"/>
  </svg>
);

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  lv: {
    flag: FlagLV,
    label: "LV",
    title: "Algas kalkulators",
    subtitle: "Latvijas algas aprēķins",
    gross: "Bruto",
    net: "Neto",
    gross_full: "Bruto (Uz papīra)",
    net_full: "Neto (Uz rokas)",
    gross_to_net: "Bruto → Neto (uz rokas)",
    net_to_gross: "Neto → Bruto (uz papīra)",
    monthly: "Mēnesī",
    yearly: "Gadā",
    salary_monthly: "Alga mēnesī",
    salary_yearly: "Alga gadā",
    dependents: "Apgādājamie",
    tax_book: "Nodokļu grāmatiņa",
    submitted: "Iesniegta pie darba devēja",
    not_submitted: "Nav iesniegta pie darba devēja",
    pension: "Pensija",
    disability: "Invaliditāte",
    status: "Statuss",
    status_label: "Politiski represēta vai NPK persona",
    none: "Nav",
    service: "Izdienas",
    old_age: "Vecuma",
    group_1: "1. gr",
    group_2: "2. gr",
    group_3: "3. gr",
    results_title: "Rezultāts",
    gross_salary: "Bruto alga (uz papīra)",
    social_tax: "Sociālais nodoklis",
    income_tax: "Iedzīvotāju ienākuma nodoklis",
    reliefs_title: "Piemērotie atvieglojumi",
    min_wage_error: "Minimālā alga",
    employer_costs: "Darba devēja izmaksas",
    risk_duty: "Riska nodeva",
    total_cost: "Izmaksas kopā",
    final_net: "Neto alga (uz rokas)",
    summary: {
      calc_prefix: "Aprēķins veikts",
      period_month: "mēneša",
      period_year: "gada",
      salary: "algai",
      book_yes: "Nodokļu grāmatiņa ir iesniegta pie darba devēja.",
      book_no: "Nodokļu grāmatiņa nav iesniegta pie darba devēja.",
      dep_prefix: "Reģistrēti apgādājamie:",
      status_prefix: "Piemērots statuss:",
      pension_old: "vecuma pensionārs",
      pension_service: "izdienas pensionārs",
      disability: "grupas invalīds",
      repressed: "represēta persona"
    },
    tooltip: {
      title1: "1. Politiski represēta persona (Cietušais)",
      desc1: "Šis statuss tiek piešķirts cilvēkiem, kuri cieta no komunistiskā vai nacistiskā režīma represijām. Tā ir vislielākā grupa, kurā ietilpst:",
      list1: [
        { b: "Izsūtītie:", t: "Cilvēki, kuri tika deportēti (piem., 1941. vai 1949. gadā) vai nometināti speciālās nometinājuma vietās." },
        { b: "Ieslodzītie:", t: "Personas, kas turētas cietumos, nometnēs vai geto politisku motīvu dēļ." },
        { b: "Dzimušie izsūtījumā:", t: "Bērni, kuri piedzima vecākiem nometinājumā represiju laikā." }
      ],
      title2: "2. NPK persona (Cīnītājs)",
      desc2: "Šis statuss ir piešķirts cilvēkiem, kuri aktīvi pretojās okupācijas režīmiem. Ietilpst:",
      list2: [
        { b: "Bruņotā pretošanās:", t: "Nacionālie partizāni (\"mežabrāļi\") un citi brīvības cīnītāji." },
        { b: "Neapbruņotā pretošanās:", t: "Pagrīdes dalībnieki, brīvvalsts ideju izplatītāji." }
      ]
    },
    tax_env: "nodokļu vide",
    min_wage_info: "Minimālā alga",
    non_taxable: "Neapliekamais minimums",
    fixed: "Fiksēts",
    relief_min: "Neapliekamais minimums",
    relief_dep: "Par apgādājamiem",
    relief_dis: "Par invaliditāti",
    relief_rep: "Par represētā statusu",
    no_reliefs: "Nav piemērotu atvieglojumu"
  },
  en: {
    flag: FlagEN,
    label: "EN",
    title: "Salary calculator",
    subtitle: "Latvian salary calculation",
    gross: "Gross",
    net: "Net",
    gross_full: "Gross (On paper)",
    net_full: "Net (In hand)",
    gross_to_net: "Gross → Net (In hand)",
    net_to_gross: "Net → Gross (On paper)",
    monthly: "Monthly",
    yearly: "Yearly",
    salary_monthly: "Monthly Salary",
    salary_yearly: "Yearly Salary",
    dependents: "Dependents",
    tax_book: "Tax Book",
    submitted: "Submitted to employer",
    not_submitted: "Not submitted to employer",
    pension: "Pension",
    disability: "Disability",
    status: "Status",
    status_label: "Politically repressed or NRM person",
    none: "None",
    service: "Service",
    old_age: "Old Age",
    group_1: "Grp 1",
    group_2: "Grp 2",
    group_3: "Grp 3",
    results_title: "Results",
    gross_salary: "Gross Salary (On paper)",
    social_tax: "Social Security Tax",
    income_tax: "Personal Income Tax",
    reliefs_title: "Applied Reliefs",
    min_wage_error: "Minimum wage",
    employer_costs: "Employer Costs",
    risk_duty: "Risk Duty",
    total_cost: "Total Cost",
    final_net: "Net Salary (In hand)",
    summary: {
      calc_prefix: "Calculation for",
      period_month: "monthly",
      period_year: "yearly",
      salary: "salary",
      book_yes: "Tax book is submitted to employer.",
      book_no: "Tax book is not submitted to employer.",
      dep_prefix: "Registered dependents:",
      status_prefix: "Applied status:",
      pension_old: "old-age pensioner",
      pension_service: "service pensioner",
      disability: "group disability",
      repressed: "repressed person"
    },
    tooltip: {
      title1: "1. Politically Repressed Person (Victim)",
      desc1: "Status granted to people who suffered from communist or Nazi regime repressions. Includes:",
      list1: [
        { b: "Deported:", t: "People deported (e.g., in 1941 or 1949) or settled in special camps." },
        { b: "Imprisoned:", t: "Persons held in prisons, camps, or ghettos for political or national reasons." },
        { b: "Born in exile:", t: "Children born to parents while in settlement during repressions." }
      ],
      title2: "2. NRM Person (National Resistance Movement)",
      desc2: "Status granted to people who actively resisted occupation regimes. Includes:",
      list2: [
        { b: "Armed resistance:", t: "National partisans ('Forest Brothers') and others fighting with arms." },
        { b: "Unarmed resistance:", t: "Underground members, distributors of independence ideas." }
      ]
    },
    tax_env: "tax environment",
    min_wage_info: "Min wage",
    non_taxable: "Non-taxable min",
    fixed: "Fixed",
    relief_min: "Non-taxable minimum",
    relief_dep: "For dependents",
    relief_dis: "For disability",
    relief_rep: "For repressed status",
    no_reliefs: "No reliefs applied"
  },
  ru: {
    flag: FlagRU,
    label: "RU",
    title: "Калькулятор зарплаты",
    subtitle: "Расчёт зарплаты в Латвии",
    gross: "Брутто",
    net: "Нетто",
    gross_full: "Брутто (На бумаге)",
    net_full: "Нетто (На руки)",
    gross_to_net: "Брутто → Нетто (на руки)",
    net_to_gross: "Нетто → Брутто (на бумаге)",
    monthly: "В месяц",
    yearly: "В год",
    salary_monthly: "Зарплата в месяц",
    salary_yearly: "Зарплата в год",
    dependents: "Иждивенцы",
    tax_book: "Налоговая книжка",
    submitted: "Подана работодателю",
    not_submitted: "Не подана работодателю",
    pension: "Пенсия",
    disability: "Инвалидность",
    status: "Статус",
    status_label: "Политически репрессированное лицо или участник НДС",
    none: "Нет",
    service: "Выслуга",
    old_age: "Возраст",
    group_1: "1 гр",
    group_2: "2 гр",
    group_3: "3 гр",
    results_title: "Результат",
    gross_salary: "Брутто зарплата (на бумаге)",
    social_tax: "Социальный налог",
    income_tax: "Подоходный налог",
    reliefs_title: "Примененные льготы",
    min_wage_error: "Минимальная зарплата",
    employer_costs: "Расходы работодателя",
    risk_duty: "Пошлина риска",
    total_cost: "Всего расходов",
    final_net: "Нетто зарплата (на руки)",
    summary: {
      calc_prefix: "Расчет для",
      period_month: "месячной",
      period_year: "годовой",
      salary: "зарплаты",
      book_yes: "Налоговая книжка подана работодателю.",
      book_no: "Налоговая книжка не подана работодателю.",
      dep_prefix: "Зарегистрировано иждивенцев:",
      status_prefix: "Применен статус:",
      pension_old: "пенсионер по возрасту",
      pension_service: "пенсионер по выслуге",
      disability: "группа инвалидности",
      repressed: "репрессированное лицо"
    },
    tooltip: {
      title1: "1. Политически репрессированное лицо (Жертва)",
      desc1: "Статус присваивается людям, пострадавшим от репрессий коммунистического или нацистского режимов. Включает:",
      list1: [
        { b: "Высланные:", t: "Люди, депортированные (напр. в 1941 или 1949) или поселенные в спецлагерях." },
        { b: "Заключенные:", t: "Лица, содержавшиеся в тюрьмах, лагерях или гетто по политическим мотивам." },
        { b: "Родившиеся в ссылке:", t: "Дети, родившиеся у родителей во время нахождения в ссылке." }
      ],
      title2: "2. Участник национального движения сопротивления (Борец)",
      desc2: "Статус присваивается людям, активно сопротивлявшимся оккупационным режимам. Включает:",
      list2: [
        { b: "Вооруженное сопротивление:", t: "Национальные партизаны («лесные братья») и др." },
        { b: "Невооруженное сопротивление:", t: "Подпольщики, распространители идей независимости." }
      ]
    },
    tax_env: "налоговая среда",
    min_wage_info: "Мин. зарплата",
    non_taxable: "Необлагаемый минимум",
    fixed: "Фикс.",
    relief_min: "Необлагаемый минимум",
    relief_dep: "За иждивенцев",
    relief_dis: "За инвалидность",
    relief_rep: "За статус репрессированного",
    no_reliefs: "Льготы не применены"
  }
};

// --- Types & Configuration ---
type TaxRules = {
  minWage: number;
  nonTaxableMin: number;
  vsaoiEmployee: number;
  vsaoiEmployer: number;
  // Pensioner Rates
  vsaoiPensionerEmployee: number;
  vsaoiPensionerEmployer: number;
  vsaoiServiceEmployee: number;
  vsaoiServiceEmployer: number;
  // General Rates
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

// --- UPDATED TAX CONFIG FOR 2025/2026 ---
const TAX_CONFIG: Record<number, TaxRules> = {
  2025: {
    minWage: 740,
    nonTaxableMin: 510,
    vsaoiEmployee: 0.105,
    vsaoiEmployer: 0.2359,
    // Pensioner (Old Age) Rates
    vsaoiPensionerEmployee: 0.0925, 
    vsaoiPensionerEmployer: 0.2077, // Fixed to 20.77
    // Service Pensioner Rates
    vsaoiServiceEmployee: 0.0976, // Fixed to 9.76
    vsaoiServiceEmployer: 0.2194, // Fixed to 21.94
    
    iinRateLow: 0.255,
    iinRateHigh: 0.33,
    iinThreshold: 8775,
    dependentRelief: 250,
    riskDuty: 0.36,
    disabilityRelief12: 154,
    disabilityRelief3: 120,
    repressedRelief: 154,
    specialNonTaxable: 500
  },
  2026: {
    minWage: 780,
    nonTaxableMin: 550,
    vsaoiEmployee: 0.105,
    vsaoiEmployer: 0.2359,
    // Pensioner (Old Age) Rates
    vsaoiPensionerEmployee: 0.0925, 
    vsaoiPensionerEmployer: 0.2077, 
    // Service Pensioner Rates
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
    specialNonTaxable: 500
  }
};

// --- Helper: Safe Rounding (Banker's rounding simulation / Standard Round) ---
const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

// --- Helper: Safe Animated Counter ---
const AnimatedCounter = ({ value, className }: { value: number | undefined, className?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    try {
      return new Intl.NumberFormat('lv-LV', { style: 'currency', currency: 'EUR' }).format(latest);
    } catch (e) {
      return "€0.00";
    }
  });

  useEffect(() => {
    const target = (typeof value === 'number' && Number.isFinite(value)) ? value : 0;
    const controls = animate(count, target, { duration: 0.75, ease: "easeOut" });
    return controls.stop;
  }, [value]);

  return <motion.span className={className}>{rounded}</motion.span>;
};

const SalaryCalculator = () => {
  const [lang, setLang] = useState<'lv' | 'ru' | 'en'>('lv');
  const [year, setYear] = useState<number>(2026);
  const [mode, setMode] = useState('gross');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  const [amount, setAmount] = useState<number | string>(1500);
  const [dependents, setDependents] = useState(0);
  const [taxBookSubmitted, setTaxBookSubmitted] = useState(true);

  // --- Parameters ---
  const [pensionType, setPensionType] = useState<'none' | 'service' | 'old_age'>('none');
  const [disabilityGroup, setDisabilityGroup] = useState<'none' | '1' | '2' | '3'>('none');
  const [isRepressed, setIsRepressed] = useState(false);
  
  // Tooltip State
  const [showRepressedTooltip, setShowRepressedTooltip] = useState(false);

  const rules = useMemo(() => TAX_CONFIG[year] || TAX_CONFIG[2026], [year]);
  const t = TRANSLATIONS[lang];

  // --- Calculation Logic ---
  const calculateTaxFromGross = (grossVal: number, depCount: number, hasBook: boolean) => {
    try {
      const safeGross = Math.max(0, grossVal || 0);

      // 1. VSAOI Rates (Updated logic for all types)
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
      
      // 2. Reliefs Breakdown
      let appliedNonTaxable = 0;
      let reliefDependents = 0;
      let reliefDisability = 0;
      let reliefRepressed = 0;
      
      if (hasBook) {
        // Special Non-taxable minimum rule for Pensioners AND Disabled
        if (pensionType !== 'none' || disabilityGroup !== 'none') {
           appliedNonTaxable = rules.specialNonTaxable; // 500 EUR
        } else {
           appliedNonTaxable = rules.nonTaxableMin; // Standard 510/550
        }
        
        reliefDependents = round(depCount * rules.dependentRelief);
        
        if (disabilityGroup === '1' || disabilityGroup === '2') reliefDisability = rules.disabilityRelief12;
        if (disabilityGroup === '3') reliefDisability = rules.disabilityRelief3;
        
        if (isRepressed) reliefRepressed = rules.repressedRelief;
      }

      const totalReliefs = reliefDependents + reliefDisability + reliefRepressed;

      // 3. Tax Base
      const taxBase = Math.max(0, round(safeGross - vsaoiEmp - appliedNonTaxable - totalReliefs));

      // 4. IIN
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
        net: net,
        vsaoiEmployee: vsaoiEmp,
        iin: iin,
        employerVsaoi: vsaoiEmployer,
        riskDuty: riskDuty,
        totalEmployerCost: totalEmployerCost,
        nonTaxableMinApplied: appliedNonTaxable,
        reliefDependents,
        reliefDisability,
        reliefRepressed,
        totalReliefsApplied: totalReliefs,
        taxBase: taxBase,
        rateEmp: rateEmp,
        rateEmployer: rateEmployer
      };
    } catch (error) {
      return { 
        gross: 0, net: 0, vsaoiEmployee: 0, iin: 0, employerVsaoi: 0, riskDuty: 0, totalEmployerCost: 0, 
        nonTaxableMinApplied: 0, reliefDependents: 0, reliefDisability: 0, reliefRepressed: 0, 
        totalReliefsApplied: 0, taxBase: 0, rateEmp: 0, rateEmployer: 0 
      };
    }
  };

  const calculateGrossFromNet = (targetNet: number, depCount: number, hasBook: boolean) => {
    try {
      let low = targetNet;
      let high = targetNet * 2.5; 
      let calculatedGross = 0;
      let iterations = 0;

      while (iterations < 25) {
        const mid = (low + high) / 2;
        const res = calculateTaxFromGross(mid, depCount, hasBook);
        if (Math.abs(res.net - targetNet) < 0.05) {
          calculatedGross = mid;
          break;
        }
        if (res.net < targetNet) low = mid;
        else high = mid;
        iterations++;
        calculatedGross = mid;
      }
      return calculateTaxFromGross(calculatedGross, depCount, hasBook);
    } catch (e) {
       return calculateTaxFromGross(0, depCount, hasBook);
    }
  };

  const [results, setResults] = useState<any>({});

  useEffect(() => {
    let inputVal = typeof amount === 'string' && amount === '' ? 0 : Number(amount);
    if (period === 'yearly') inputVal = inputVal / 12;

    const res = mode === 'gross' 
      ? calculateTaxFromGross(inputVal, dependents, taxBookSubmitted)
      : calculateGrossFromNet(inputVal, dependents, taxBookSubmitted);
    
    setResults(res);
  }, [amount, dependents, taxBookSubmitted, mode, year, period, pensionType, disabilityGroup, isRepressed, lang]);

  const displayVal = (val: number | undefined) => {
    if (val === undefined) return 0;
    return period === 'yearly' ? val * 12 : val;
  };

  const iinLabel = results.taxBase > rules.iinThreshold 
    ? `${t.income_tax} (${(rules.iinRateLow * 100).toFixed(1)}% / ${(rules.iinRateHigh * 100).toFixed(0)}%)` 
    : `${t.income_tax} (${(rules.iinRateLow * 100).toFixed(1)}%)`;

  const vsaoiLabel = `${t.social_tax} (${((results.rateEmp || rules.vsaoiEmployee) * 100).toFixed(2)}%)`;
  const employerVsaoiLabel = `${t.social_tax} (${((results.rateEmployer || rules.vsaoiEmployer) * 100).toFixed(2)}%)`;

  // --- Natural Language Summary Generator ---
  const generateSummary = () => {
    const sentences = [];
    
    const modeText = mode === 'gross' ? t.gross.toLowerCase() : t.net.toLowerCase();
    const periodText = period === 'monthly' ? t.summary.period_month : t.summary.period_year;

    // 1. Base Info
    sentences.push(`${t.summary.calc_prefix} ${year}. ${t.summary.period_year} ${periodText} ${modeText} ${t.summary.salary}.`);

    // 2. Tax Book
    if (taxBookSubmitted) {
        sentences.push(t.summary.book_yes);
    } else {
        sentences.push(t.summary.book_no);
    }

    // 3. Dependents
    if (dependents > 0) {
        sentences.push(`${t.summary.dep_prefix} ${dependents}.`);
    }

    // 4. Statuses
    const statusParts = [];
    if (pensionType === 'old_age') statusParts.push(t.summary.pension_old);
    if (pensionType === 'service') statusParts.push(t.summary.pension_service);
    if (disabilityGroup !== 'none') statusParts.push(`${disabilityGroup}. ${t.summary.disability}`);
    if (isRepressed) statusParts.push(t.summary.repressed);

    if (statusParts.length > 0) {
        const statusString = statusParts.join(", ");
        sentences.push(`${t.summary.status_prefix} ${statusString}.`);
    }

    return sentences.join(" ");
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      
      {/* HEADER WITH LANGUAGE SWITCHER */}
      <div className="w-full max-w-6xl flex justify-end mb-4 px-4 relative">
         <div className="bg-slate-100 p-1 rounded-xl flex relative isolate gap-1">
            {(['lv', 'ru', 'en'] as const).map((l) => {
               const LangIcon = TRANSLATIONS[l].flag;
               return (
                 <button 
                   key={l}
                   onClick={() => setLang(l)}
                   className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors uppercase relative z-10 ${
                     lang === l ? 'text-indigo-900' : 'text-slate-500 hover:text-slate-700'
                   }`}
                 >
                   <LangIcon className="w-4 h-3 rounded-[2px] shadow-sm object-cover" />
                   {TRANSLATIONS[l].label}
                   {lang === l && (
                     <motion.div 
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
         <h1 className="text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-800 to-indigo-900 pb-2">
            {t.title}
         </h1>
         <p className="text-slate-400 font-medium">{t.subtitle}</p>
      </div>

      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row items-stretch min-h-[700px]">
        
        {/* LEFT SIDE */}
        <div className="p-10 lg:w-7/12 flex flex-col border-r border-slate-100 relative">
          
          <div className="flex flex-col gap-6 h-full">
             
             {/* Switcher */}
             <div className="bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl flex relative isolate">
                {[
                  { id: 'gross', label: t.gross_to_net },
                  { id: 'net', label: t.net_to_gross }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setMode(option.id)}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors relative z-10 ${
                      mode === option.id ? 'text-indigo-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {option.label}
                    {mode === option.id && (
                      <motion.div layoutId="active-pill" className="absolute inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-xl -z-10" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                    )}
                  </button>
                ))}
             </div>

             {/* Input */}
             <div className="relative group">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{period === 'monthly' ? t.salary_monthly : t.salary_yearly}</label>
                  
                  <div className="bg-slate-100 p-1 rounded-xl flex relative isolate">
                    {[
                      { id: 'monthly', label: t.monthly },
                      { id: 'yearly', label: t.yearly }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPeriod(opt.id as any)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors relative z-10 ${
                          period === opt.id ? 'text-indigo-900' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {opt.label}
                        {period === opt.id && (
                          <motion.div
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
                  <span className="absolute left-6 text-3xl text-slate-400 group-focus-within:text-indigo-500 transition-colors">€</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => { const val = e.target.value; setAmount(val === '' ? '' : Number(val)); }}
                    onBlur={() => { if (amount === '') setAmount(0); }}
                    className="w-full pl-14 pr-4 py-5 text-5xl font-bold text-slate-800 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  />
                </div>
                {getMinWageError()}
             </div>

             {/* Main Controls Grid */}
             <div className="grid md:grid-cols-2 gap-6">
                
                {/* 1. DEPENDENTS */}
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col justify-between">
                   <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <Users size={18} className="text-indigo-500" />
                      {t.dependents}
                   </label>
                   <div className="flex items-center justify-between bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200">
                      <button onClick={() => setDependents(Math.max(0, dependents - 1))} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 active:scale-95 transition-transform"><Minus size={20} /></button>
                      <span className="text-2xl font-bold text-slate-800 w-8 text-center">{dependents}</span>
                      <button onClick={() => setDependents(dependents + 1)} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-slate-100 text-indigo-600 active:scale-95 transition-transform"><Plus size={20} /></button>
                   </div>
                </div>

                {/* 2. TAX BOOK */}
                <motion.div onClick={() => setTaxBookSubmitted(!taxBookSubmitted)} whileTap={{ scale: 0.98 }} className={`group cursor-pointer rounded-3xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-200 ${taxBookSubmitted ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-start z-10 h-full">
                     <div className="flex flex-col justify-between h-full">
                        <span className={`text-sm font-bold flex items-center gap-2 ${taxBookSubmitted ? 'text-indigo-900' : 'text-slate-700'}`}>
                           <BookCheck size={18} className={taxBookSubmitted ? 'text-indigo-600' : 'text-slate-400'} />
                           {t.tax_book}
                        </span>
                        <span className={`text-xs mt-1 ${taxBookSubmitted ? 'text-indigo-600' : 'text-slate-500'}`}>{taxBookSubmitted ? t.submitted : t.not_submitted}</span>
                     </div>
                     <div className={`w-12 h-7 rounded-full p-1 transition-colors ${taxBookSubmitted ? 'bg-indigo-600' : 'bg-slate-200'}`}><motion.div layout className={`w-5 h-5 bg-white rounded-full shadow-sm ${taxBookSubmitted ? 'ml-auto' : ''}`} /></div>
                  </div>
                </motion.div>
             </div>

             {/* --- SECONDARY SECTION --- */}
             <div className="border-t border-slate-100 pt-6 mt-2">
               
               <div className="space-y-5">
                 {/* 3. PENSION */}
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Armchair size={16} />
                      {t.pension}
                   </label>
                   <div className="bg-slate-100/50 p-1 rounded-2xl flex relative isolate">
                      {[
                        { id: 'none', label: t.none, icon: Ban }, 
                        { id: 'service', label: t.service, icon: Briefcase }, 
                        { id: 'old_age', label: t.old_age, icon: Clock }
                      ].map((opt) => (
                        <button key={opt.id} onClick={() => setPensionType(opt.id as any)} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all relative z-10 flex items-center justify-center gap-1.5 ${pensionType === opt.id ? 'text-indigo-900' : 'text-slate-400 hover:text-slate-600'}`}>
                          <opt.icon size={14} />
                          {opt.label}
                          {pensionType === opt.id && <motion.div layoutId="pension-pill" className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                        </button>
                      ))}
                   </div>
                 </div>

                 {/* Row for Disability & Status */}
                 <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* 4. DISABILITY (Flexible Column) */}
                    <div className="flex flex-col h-full">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Accessibility size={16} />
                          {t.disability}
                       </label>
                       <div className="bg-slate-100/50 p-1 rounded-2xl flex-1 flex items-stretch relative isolate h-full">
                         {[
                           {id: 'none', label: t.none}, 
                           {id: '1', label: t.group_1}, 
                           {id: '2', label: t.group_2}, 
                           {id: '3', label: t.group_3}
                         ].map((grp) => (
                           <button key={grp.id} onClick={() => setDisabilityGroup(grp.id as any)} className={`flex-1 flex items-center justify-center py-2 text-[10px] font-bold rounded-xl transition-all relative z-10 ${disabilityGroup === grp.id ? 'text-indigo-900' : 'text-slate-400 hover:text-slate-600'}`}>
                             {grp.label}
                             {disabilityGroup === grp.id && <motion.div layoutId="disability-pill" className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                           </button>
                         ))}
                       </div>
                    </div>

                    {/* 5. STATUS (Flexible Column with Wrapping Text & Tooltip) */}
                    <div className="flex flex-col h-full">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                         <Landmark size={16} />
                         {t.status}
                      </label>
                      <motion.div 
                        onClick={() => setIsRepressed(!isRepressed)} 
                        whileTap={{ scale: 0.98 }} 
                        className={`group cursor-pointer rounded-2xl border p-3 flex-1 flex items-center justify-between transition-all duration-200 min-h-[44px] h-full ${isRepressed ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:border-slate-300'} relative`}
                      >
                         <div className="flex items-center gap-1.5 flex-1 pr-2">
                            <span className={`text-[10px] font-bold leading-tight whitespace-normal ${isRepressed ? 'text-indigo-900' : 'text-slate-500'}`}>
                              {t.status_label}
                            </span>
                            
                            {/* INFO BUTTON */}
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setShowRepressedTooltip(!showRepressedTooltip); }}
                              onMouseEnter={() => setShowRepressedTooltip(true)}
                              onMouseLeave={() => setShowRepressedTooltip(false)}
                              className="text-slate-400 hover:text-indigo-500 transition-colors p-0.5 rounded-full hover:bg-slate-100 flex-shrink-0"
                            >
                              <Info size={14} />
                            </button>

                            {/* TOOLTIP CONTENT */}
                            <AnimatePresence>
                              {showRepressedTooltip && (
                                <motion.div 
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
                                        {t.tooltip.list1.map((item, i) => (
                                          <li key={i}><span className="font-semibold text-slate-700">{item.b}</span> {item.t}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div>
                                      <h4 className="text-[11px] font-bold text-indigo-900 mb-1 leading-tight">{t.tooltip.title2}</h4>
                                      <p className="text-[10px] text-slate-500 leading-relaxed mb-1.5">{t.tooltip.desc2}</p>
                                      <ul className="text-[10px] text-slate-600 space-y-1 list-disc pl-3 marker:text-indigo-400">
                                        {t.tooltip.list2.map((item, i) => (
                                          <li key={i}><span className="font-semibold text-slate-700">{item.b}</span> {item.t}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white border-b border-r border-slate-100 transform rotate-45"></div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                         </div>
                         <div className={`w-8 h-5 rounded-full p-0.5 transition-colors shrink-0 ${isRepressed ? 'bg-indigo-600' : 'bg-slate-200'}`}><motion.div layout className={`w-4 h-4 bg-white rounded-full shadow-sm ${isRepressed ? 'ml-auto' : ''}`} /></div>
                      </motion.div>
                    </div>
                 </div>
               </div>
             </div>

             {/* --- Bottom Section: Year & Info --- */}
             <div className="pt-4 border-t border-slate-100 mt-auto">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Calendar size={14} /> {t.summary.calc_prefix}</span>
                  <div className="bg-slate-100 p-1 rounded-xl flex">
                    {[2025, 2026].map((y) => (
                      <button key={y} onClick={() => setYear(y)} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors relative z-10 flex items-center gap-1.5 ${year === y ? 'text-indigo-900' : 'text-slate-500 hover:text-slate-700'}`}>
                         {y} {year === y && <motion.div layoutId="active-year-pill-bottom" className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="flex gap-4 items-start p-5 rounded-3xl bg-slate-50/80 border border-slate-100 text-xs text-slate-600">
                  <Info className="w-5 h-5 shrink-0 mt-0.5 text-indigo-400" />
                  <div>
                     <p className="font-bold text-slate-800 mb-1">{year}. {lang === 'lv' ? 'gada' : ''} {t.tax_env}:</p>
                     <ul className="space-y-1.5 pl-1">
                       {year === 2026 ? (
                         <>
                           <li className="flex items-center gap-2"><ArrowUpRight size={14} className="text-emerald-500" />{t.min_wage_info}: <strong>€780</strong> (+40€)</li>
                           <li className="flex items-center gap-2"><ArrowUpRight size={14} className="text-emerald-500" />{t.non_taxable}: <strong>€550</strong> (+40€)</li>
                         </>
                       ) : (
                         <>
                           <li className="flex items-center gap-2"><ArrowUpRight size={14} className="text-emerald-500" />{t.min_wage_info}: <strong>€740</strong> (+40€)</li>
                           <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" />{t.non_taxable}: <strong>€510</strong> ({t.fixed})</li>
                         </>
                       )}
                     </ul>
                  </div>
               </div>
             </div>
          </div>
        </div>

        {/* RIGHT SIDE: Results */}
        <div className="p-10 lg:w-5/12 bg-slate-900 text-slate-300 flex flex-col justify-between">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6">
            
            {/* Employee Section */}
            <div className="bg-slate-800/50 rounded-3xl border border-slate-700/50 p-8 flex-1 flex flex-col justify-start">
              
              {/* Header: Rezultāts + Natural Language Summary */}
              <div className="mb-8">
                 <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Wallet size={14} /> {t.results_title} ({year})
                 </h3>
                 {rules && (
                   <p className="text-[10px] leading-relaxed text-slate-500 font-sans border-l-2 border-indigo-900/50 pl-3">
                      {generateSummary()}
                   </p>
                 )}
              </div>

              <div className="mb-6"><Row label={t.gross_salary} value={displayVal(results.gross)} size="lg" isWhite /></div>
              <div className="h-px bg-slate-700/50 my-4"></div>
              <div className="space-y-3 mb-6">
                <Row label={vsaoiLabel} value={displayVal(results.vsaoiEmployee)} isNegative />
                <Row label={iinLabel} value={displayVal(results.iin)} isNegative />
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50 mb-6">
                <div className="flex items-center gap-2 mb-3"><TrendingDown className="text-slate-500 w-3 h-3" /><span className="text-[10px] font-bold text-slate-500 uppercase">{t.reliefs_title}</span></div>
                <div className="space-y-2">
                   {results.nonTaxableMinApplied > 0 && (
                     <Row label={t.relief_min} value={displayVal(results.nonTaxableMinApplied)} size="sm" isNeutral />
                   )}
                   {results.reliefDependents > 0 && (
                     <Row label={t.relief_dep} value={displayVal(results.reliefDependents)} size="sm" isNeutral />
                   )}
                   {results.reliefDisability > 0 && (
                     <Row label={t.relief_dis} value={displayVal(results.reliefDisability)} size="sm" isNeutral />
                   )}
                   {results.reliefRepressed > 0 && (
                     <Row label={t.relief_rep} value={displayVal(results.reliefRepressed)} size="sm" isNeutral />
                   )}
                   
                   {/* Fallback if no reliefs */}
                   {results.nonTaxableMinApplied === 0 && results.totalReliefsApplied === 0 && (
                     <span className="text-[10px] text-slate-500 italic">{t.no_reliefs}</span>
                   )}
                </div>
              </div>
              <div className="h-px bg-slate-700/50 my-4"></div>
              <div className="pt-2">
                <div className="flex justify-between items-end">
                   <span className="text-sm font-medium text-emerald-400">{t.final_net}</span>
                   <div className="text-5xl font-bold text-emerald-400 tracking-tight"><AnimatedCounter value={displayVal(results.net)} /></div>
                </div>
              </div>
            </div>

            {/* Employer Section */}
            <div className="bg-slate-800/30 rounded-3xl border border-slate-800 p-8">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t.employer_costs}</h3>
               <div className="space-y-3 mb-4">
                 <Row label={employerVsaoiLabel} value={displayVal(results.employerVsaoi)} isNeutral />
                 <Row label={t.risk_duty} value={displayVal(results.riskDuty)} isNeutral />
               </div>
               <div className="h-px bg-slate-800 my-4"></div>
               <Row label={t.total_cost} value={displayVal(results.totalEmployerCost)} isWhite />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, size = 'md', isNegative = false, isWhite = false, isNeutral = false }: any) => {
  const textSize = size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-xs' : 'text-sm';
  const textColor = isWhite ? 'text-white' : isNegative ? 'text-red-300' : isNeutral ? 'text-slate-500' : 'text-slate-300';
  const labelColor = isWhite ? 'text-white' : isNeutral ? 'text-slate-500' : 'text-slate-400';
  return (
    <div className={`flex justify-between items-center`}>
      <span className={`${textSize} ${labelColor}`}>{label}</span>
      <span className={`tabular-nums ${textSize} ${textColor} font-medium`}>{isNegative && "-"}<AnimatedCounter value={value} /></span>
    </div>
  );
};

export default SalaryCalculator;