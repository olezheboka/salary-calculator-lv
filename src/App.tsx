import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Minus, Calendar, TrendingDown, Info, ArrowUpRight, CheckCircle2, Wallet, 
  Users, BookCheck, Landmark, Briefcase, Ban, Clock, Accessibility, Armchair 
} from 'lucide-react';
import { motion, useTransform, animate, useMotionValue } from 'framer-motion';

// --- FLAG ICONS ---

const FlagLV = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 32 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="24" fill="#9E3039"/>
    <rect y="9.6" width="32" height="4.8" fill="#FFF"/>
  </svg>
);

const FlagRU = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 32 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="24" fill="#FFF"/>
    <rect y="8" width="32" height="8" fill="#0039A6"/>
    <rect y="16" width="32" height="8" fill="#D52B1E"/>
  </svg>
);

const FlagEN = ({ className = "" }: { className?: string }) => (
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
      desc1: "Šis statuss tiek piešķirts cilvēkiem, kuri cieta no komunistiskā vai nacistiskā režīma represijām.",
      list1: [{ b: "Izsūtītie:", t: "Cilvēki, kuri tika deportēti." }],
      title2: "2. NPK persona (Cīnītājs)",
      list2: [{ b: "Bruņotā pretošanās:", t: "Nacionālie partizāni." }]
    },
    tax_env: "nodokļu vide",
    min_wage_info: "Min. alga",
    non_taxable: "Neapliekamais min.",
    relief_min: "Neapliekamais minimums",
    relief_dep: "Par apgādājamiem",
    relief_dis: "Par invaliditāti",
    relief_rep: "Par represētā statusu"
  },
  ru: {
    flag: FlagRU,
    label: "RU",
    title: "Калькулятор зарплаты",
    subtitle: "Расчёт зарплаты в Латвии",
    gross: "Брутто",
    net: "Нетто",
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
      title1: "1. Политически репрессированное лицо или участник НДС",
      desc1: "Статус присваивается людям, пострадавшим от репрессий.",
      list1: [{ b: "Высланные:", t: "Люди, депортированные в спецлагеря." }],
      title2: "2. Участник национального движения сопротивления (Борец)",
      list2: [{ b: "Сопротивление:", t: "Национальные партизаны." }]
    },
    tax_env: "налоговая среда",
    min_wage_info: "Мин. зарплата",
    non_taxable: "Необлагаемый мин.",
    relief_min: "Необлагаемый минимум",
    relief_dep: "За иждивенцев",
    relief_dis: "За инвалидность",
    relief_rep: "За статус репрессированного"
  },
  en: {
    flag: FlagEN,
    label: "EN",
    title: "Salary calculator",
    subtitle: "Latvian salary calculation",
    gross: "Gross",
    net: "Net",
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
      book_yes: "Tax book is submitted.",
      book_no: "Tax book is not submitted.",
      dep_prefix: "Registered dependents:",
      status_prefix: "Applied status:",
      pension_old: "old-age pensioner",
      pension_service: "service pensioner",
      disability: "group disability",
      repressed: "repressed person"
    },
    tooltip: {
      title1: "1. Politically Repressed Person",
      desc1: "Status granted to people who suffered from repressions.",
      list1: [{ b: "Deported:", t: "People deported to camps." }],
      title2: "2. NRM Person",
      list2: [{ b: "Resistance:", t: "Freedom fighters." }]
    },
    tax_env: "tax environment",
    min_wage_info: "Min wage",
    non_taxable: "Non-taxable min.",
    relief_min: "Non-taxable minimum",
    relief_dep: "For dependents",
    relief_dis: "For disability",
    relief_rep: "For repressed status"
  }
};

type TaxRules = {
  minWage: number;
  nonTaxableMin: number;
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

const TAX_CONFIG: Record<number, TaxRules> = {
  2025: {
    minWage: 740, nonTaxableMin: 510, vsaoiEmployee: 0.105, vsaoiEmployer: 0.2359,
    vsaoiPensionerEmployee: 0.0925, vsaoiPensionerEmployer: 0.2077,
    vsaoiServiceEmployee: 0.0976, vsaoiServiceEmployer: 0.2194,
    iinRateLow: 0.255, iinRateHigh: 0.33, iinThreshold: 8775, dependentRelief: 250,
    riskDuty: 0.36, disabilityRelief12: 154, disabilityRelief3: 120,
    repressedRelief: 154, specialNonTaxable: 500
  },
  2026: {
    minWage: 780, nonTaxableMin: 550, vsaoiEmployee: 0.105, vsaoiEmployer: 0.2359,
    vsaoiPensionerEmployee: 0.0925, vsaoiPensionerEmployer: 0.2077,
    vsaoiServiceEmployee: 0.0976, vsaoiServiceEmployer: 0.2194,
    iinRateLow: 0.255, iinRateHigh: 0.33, iinThreshold: 8775, dependentRelief: 250,
    riskDuty: 0.36, disabilityRelief12: 154, disabilityRelief3: 120,
    repressedRelief: 154, specialNonTaxable: 500
  }
};

const round = (num: number) => Math.floor(num * 100) / 100;

const AnimatedCounter = ({ value, className }: { value: number | undefined, className?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    try {
      return new Intl.NumberFormat('lv-LV', { style: 'currency', currency: 'EUR' }).format(latest);
    } catch (e) { return "€0.00"; }
  });

  useEffect(() => {
    const target = (typeof value === 'number' && Number.isFinite(value)) ? value : 0;
    const controls = animate(count, target, { duration: 0.75, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

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
  const [pensionType, setPensionType] = useState<'none' | 'service' | 'old_age'>('none');
  const [disabilityGroup, setDisabilityGroup] = useState<'none' | '1' | '2' | '3'>('none');
  const [isRepressed, setIsRepressed] = useState(false);
  const [showRepressedTooltip, setShowRepressedTooltip] = useState(false);

  const rules = TAX_CONFIG[year] || TAX_CONFIG[2026];
  const t = TRANSLATIONS[lang];

  const calculateTaxFromGross = (grossVal: number, depCount: number, hasBook: boolean) => {
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
      appliedNonTaxable = (pensionType !== 'none' || disabilityGroup !== 'none') ? rules.specialNonTaxable : rules.nonTaxableMin;
      reliefDependents = round(depCount * rules.dependentRelief);
      if (disabilityGroup === '1' || disabilityGroup === '2') reliefDisability = rules.disabilityRelief12;
      else if (disabilityGroup === '3') reliefDisability = rules.disabilityRelief3;
      if (isRepressed) reliefRepressed = rules.repressedRelief;
    }

    const totalReliefs = reliefDependents + reliefDisability + reliefRepressed;
    const taxBase = Math.max(0, round(safeGross - vsaoiEmp - appliedNonTaxable - totalReliefs));
    let iin = (taxBase > rules.iinThreshold) 
      ? round(rules.iinThreshold * rules.iinRateLow) + round((taxBase - rules.iinThreshold) * rules.iinRateHigh)
      : round(taxBase * rules.iinRateLow);

    const net = round(safeGross - vsaoiEmp - iin);
    const vsaoiEmployer = round(safeGross * rateEmployer);
    const riskDuty = safeGross > 0 ? rules.riskDuty : 0; 
    
    return {
      gross: safeGross, net, vsaoiEmployee: vsaoiEmp, iin, employerVsaoi: vsaoiEmployer,
      riskDuty, totalEmployerCost: round(safeGross + vsaoiEmployer + riskDuty),
      nonTaxableMinApplied: appliedNonTaxable, reliefDependents, reliefDisability,
      reliefRepressed, totalReliefsApplied: totalReliefs, taxBase, rateEmp, rateEmployer
    };
  };

  const results = useMemo(() => {
    let inputVal = (typeof amount === 'string' && amount === '') ? 0 : Number(amount);
    if (period === 'yearly') inputVal /= 12;

    if (mode === 'gross') return calculateTaxFromGross(inputVal, dependents, taxBookSubmitted);
    
    let low = inputVal, high = inputVal * 3, calcGross = inputVal;
    for (let i = 0; i < 25; i++) {
      const mid = (low + high) / 2;
      if (calculateTaxFromGross(mid, dependents, taxBookSubmitted).net < inputVal) low = mid;
      else high = mid;
      calcGross = mid;
    }
    return calculateTaxFromGross(calcGross, dependents, taxBookSubmitted);
  }, [amount, dependents, taxBookSubmitted, mode, year, period, pensionType, disabilityGroup, isRepressed, rules]);

  const displayVal = (val: number) => period === 'yearly' ? val * 12 : val;
  const generateSummary = () => {
    const s = [];
    s.push(`${t.summary.calc_prefix} ${year}. ${period === 'monthly' ? t.summary.period_month : t.summary.period_year} ${mode === 'gross' ? t.gross.toLowerCase() : t.net.toLowerCase()} ${t.summary.salary}.`);
    s.push(taxBookSubmitted ? t.summary.book_yes : t.summary.book_no);
    if (dependents > 0) s.push(`${t.summary.dep_prefix} ${dependents}.`);
    const statusParts = [];
    if (pensionType === 'old_age') statusParts.push(t.summary.pension_old);
    if (pensionType === 'service') statusParts.push(t.summary.pension_service);
    if (disabilityGroup !== 'none') statusParts.push(`${disabilityGroup}. ${t.summary.disability}`);
    if (isRepressed) statusParts.push(t.summary.repressed);
    if (statusParts.length > 0) s.push(`${t.summary.status_prefix} ${statusParts.join(", ")}.`);
    return s.join(" ");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-6xl flex justify-end mb-4 px-4 relative">
         <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            {(['lv', 'ru', 'en'] as const).map((l) => {
               const LangIcon = TRANSLATIONS[l].flag;
               return (
                 <button key={l} onClick={() => setLang(l)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors relative z-10 ${lang === l ? 'text-indigo-900' : 'text-slate-500'}`}>
                   <LangIcon className="w-4 h-3 rounded-[2px]" />
                   {TRANSLATIONS[l].label}
                   {lang === l && <motion.div layoutId="lang" className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10" />}
                 </button>
               );
            })}
         </div>
      </div>

      <div className="mb-10 text-center">
         <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-900 pb-2">{t.title}</h1>
         <p className="text-slate-400 font-medium">{t.subtitle}</p>
      </div>

      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        <div className="p-6 md:p-10 lg:w-7/12 border-r border-slate-100 flex flex-col gap-6">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex">
            {['gross', 'net'].map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`flex-1 py-3 px-2 text-[10px] md:text-sm font-bold rounded-xl relative transition-colors ${mode === m ? 'text-indigo-900' : 'text-slate-500'}`}>
                {m === 'gross' ? t.gross_to_net : t.net_to_gross}
                {mode === m && <motion.div layoutId="mode" className="absolute inset-0 bg-white shadow-md rounded-xl -z-10" />}
              </button>
            ))}
          </div>

          <div>
             <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{period === 'monthly' ? t.salary_monthly : t.salary_yearly}</label>
                <div className="bg-slate-100 p-1 rounded-xl flex">
                   {['monthly', 'yearly'].map((p) => (
                     <button key={p} onClick={() => setPeriod(p as any)} className={`px-3 py-1.5 text-xs font-bold rounded-lg relative ${period === p ? 'text-indigo-900' : 'text-slate-500'}`}>
                        {p === 'monthly' ? t.monthly : t.yearly}
                        {period === p && <motion.div layoutId="period" className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10" />}
                     </button>
                   ))}
                </div>
             </div>
             <div className="flex items-center relative">
                <span className="absolute left-6 text-3xl text-slate-400">€</span>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-14 pr-4 py-5 text-4xl md:text-5xl font-bold bg-slate-50 rounded-3xl outline-none focus:bg-white border-2 border-transparent focus:border-indigo-500 transition-all" />
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col justify-between">
                <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Users size={18} className="text-indigo-500"/>{t.dependents}</label>
                <div className="flex items-center justify-between bg-white rounded-2xl p-1.5 shadow-sm">
                   <button onClick={() => setDependents(Math.max(0, dependents - 1))} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500"><Minus size={20}/></button>
                   <span className="text-2xl font-bold text-slate-800">{dependents}</span>
                   <button onClick={() => setDependents(dependents + 1)} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-slate-100 text-indigo-600"><Plus size={20}/></button>
                </div>
             </div>
             <div onClick={() => setTaxBookSubmitted(!taxBookSubmitted)} className={`cursor-pointer rounded-3xl border p-5 flex flex-col justify-between transition-all ${taxBookSubmitted ? 'bg-indigo-50 border-indigo-500 ring-1' : 'bg-white border-slate-200'}`}>
                <span className="text-sm font-bold flex items-center gap-2"><BookCheck size={18} className={taxBookSubmitted ? 'text-indigo-600' : 'text-slate-400'}/>{t.tax_book}</span>
                <span className="text-xs mt-1 text-slate-500">{taxBookSubmitted ? t.submitted : t.not_submitted}</span>
             </div>
          </div>

          <div className="border-t pt-6 space-y-5">
             <div>
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-2"><Armchair size={16}/>{t.pension}</label>
                <div className="bg-slate-100/50 p-1 rounded-2xl flex">
                   {[
                     { id: 'none', label: t.none, icon: Ban }, 
                     { id: 'service', label: t.service, icon: Briefcase }, 
                     { id: 'old_age', label: t.old_age, icon: Clock }
                   ].map((opt) => (
                     <button key={opt.id} onClick={() => setPensionType(opt.id as any)} className={`flex-1 py-2 text-xs font-bold rounded-xl relative flex items-center justify-center gap-1.5 ${pensionType === opt.id ? 'text-indigo-900' : 'text-slate-400'}`}>
                        <opt.icon size={14}/>{opt.label}
                        {pensionType === opt.id && <motion.div layoutId="pension" className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10" />}
                     </button>
                   ))}
                </div>
             </div>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col h-full">
                   <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5"><Accessibility size={16}/>{t.disability}</label>
                   <div className="bg-slate-100/50 p-1 rounded-2xl flex flex-1 items-stretch">
                      {['none', '1', '2', '3'].map((grp) => (
                        <button key={grp} onClick={() => setDisabilityGroup(grp as any)} className={`flex-1 flex items-center justify-center py-2 text-[10px] font-bold rounded-xl relative ${disabilityGroup === grp ? 'text-indigo-900' : 'text-slate-400'}`}>
                           {grp === 'none' ? t.none : (grp + '. ' + t.group_1.split('.')[1])}
                           {disabilityGroup === grp && <motion.div layoutId="disability" className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10" />}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="flex flex-col h-full">
                   <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5"><Landmark size={16}/>{t.status}</label>
                   <div onClick={() => setIsRepressed(!isRepressed)} className={`cursor-pointer rounded-2xl border p-3 flex-1 flex items-center justify-between transition-all ${isRepressed ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-center gap-1.5 pr-2">
                        <span className="text-[10px] font-bold leading-tight">{t.status_label}</span>
                        <div onMouseEnter={() => setShowRepressedTooltip(true)} onMouseLeave={() => setShowRepressedTooltip(false)} className="text-slate-400 relative">
                           <Info size={14} />
                           {showRepressedTooltip && (
                             <div className="absolute bottom-full left-0 w-64 p-3 bg-white shadow-2xl rounded-xl border z-50 text-[10px] text-slate-600">
                                <p className="font-bold text-indigo-900 mb-1">{t.tooltip.title1}</p>
                                <ul className="list-disc pl-3 space-y-1 mb-2">
                                  {t.tooltip.list1.map((item: {b:string, t:string}, idx: number) => <li key={idx}><b>{item.b}</b> {item.t}</li>)}
                                </ul>
                                <p className="font-bold text-indigo-900 mb-1">{t.tooltip.title2}</p>
                                <ul className="list-disc pl-3 space-y-1">
                                  {t.tooltip.list2.map((item: {b:string, t:string}, idx: number) => <li key={idx}><b>{item.b}</b> {item.t}</li>)}
                                </ul>
                             </div>
                           )}
                        </div>
                      </div>
                      <div className={`w-8 h-5 rounded-full p-0.5 transition-colors ${isRepressed ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isRepressed ? 'translate-x-3' : ''}`} />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="p-6 md:p-10 lg:w-5/12 bg-slate-900 text-slate-300 flex flex-col gap-6">
           <div className="bg-slate-800/50 rounded-3xl border border-slate-700/50 p-8 flex-1">
              <h3 className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-2 mb-3"><Wallet size={14}/>{t.results_title}</h3>
              <p className="text-[10px] text-slate-500 border-l-2 border-indigo-900/50 pl-3 mb-8">{generateSummary()}</p>
              <div className="mb-6"><Row label={t.gross_salary} value={displayVal(results.gross)} isWhite size="lg"/></div>
              <div className="h-px bg-slate-700/50 mb-6"/>
              <div className="space-y-3 mb-6">
                 <Row label={`${t.social_tax} (${(results.rateEmp * 100).toFixed(2)}%)`} value={displayVal(results.vsaoiEmployee)} isNegative/>
                 <Row label={t.income_tax} value={displayVal(results.iin)} isNegative/>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50 mb-6">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase mb-3"><TrendingDown size={12}/>{t.reliefs_title}</div>
                 <div className="space-y-2">
                    {results.nonTaxableMinApplied > 0 && <Row label={t.relief_min} value={displayVal(results.nonTaxableMinApplied)} isNeutral size="sm"/>}
                    {results.reliefDependents > 0 && <Row label={t.relief_dep} value={displayVal(results.reliefDependents)} isNeutral size="sm"/>}
                    {results.reliefDisability > 0 && <Row label={t.relief_dis} value={displayVal(results.reliefDisability)} isNeutral size="sm"/>}
                    {results.reliefRepressed > 0 && <Row label={t.relief_rep} value={displayVal(results.reliefRepressed)} isNeutral size="sm"/>}
                 </div>
              </div>
              <div className="h-px bg-slate-700/50 mb-4"/>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1">
                 <span className="text-sm font-medium text-emerald-400">{t.final_net}</span>
                 <div className="text-5xl font-bold text-emerald-400"><AnimatedCounter value={displayVal(results.net)}/></div>
              </div>
           </div>
           <div className="bg-slate-800/30 rounded-3xl border border-slate-800 p-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">{t.employer_costs}</h3>
              <div className="space-y-3 mb-4">
                 <Row label={`${t.social_tax} (${(results.rateEmployer * 100).toFixed(2)}%)`} value={displayVal(results.employerVsaoi)} isNeutral/>
                 <Row label={t.risk_duty} value={displayVal(results.riskDuty)} isNeutral/>
              </div>
              <div className="h-px bg-slate-800 mb-4"/>
              <Row label={t.total_cost} value={displayVal(results.totalEmployerCost)} isWhite/>
           </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, isWhite, isNegative, isNeutral, size }: any) => (
  <div className="flex justify-between items-start gap-2">
    <span className={`leading-tight ${size === 'sm' ? 'text-xs' : 'text-sm'} ${isWhite ? 'text-white' : isNeutral ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
    <span className={`tabular-nums font-medium shrink-0 ${size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-xs' : 'text-sm'} ${isWhite ? 'text-white' : isNegative ? 'text-red-300' : isNeutral ? 'text-slate-500' : 'text-slate-300'}`}>
      {isNegative && "-"} <AnimatedCounter value={value}/>
    </span>
  </div>
);

export default SalaryCalculator;