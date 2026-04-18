import type { ReactNode } from 'react';
import { AnimatedCounter } from './AnimatedCounter';

export const TableRows = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-3">{children}</div>
);

type TableRowProps = {
  label: string;
  value: number | undefined;
  isNeutral?: boolean;
  isBold?: boolean;
  size?: 'sm' | 'md';
};

export const TableRow = ({ label, value, isNeutral = false, isBold = false, size = 'md' }: TableRowProps) => {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const textColor = isNeutral ? 'text-slate-500' : 'text-slate-700';
  const valueColor = isNeutral ? 'text-slate-500' : isBold ? 'text-slate-900' : 'text-slate-700';
  const weight = isBold ? 'font-bold' : 'font-medium';

  return (
    <div className={`flex justify-between items-start gap-3 ${textSize}`}>
      <span className={`${textColor} leading-tight`}>{label}</span>
      <span className={`tabular-nums ${valueColor} ${weight} whitespace-nowrap shrink-0`}>
        <AnimatedCounter value={value} />
      </span>
    </div>
  );
};
