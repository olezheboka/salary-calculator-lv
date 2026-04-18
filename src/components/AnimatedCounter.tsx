import { useEffect } from 'react';
import { animate, m, useMotionValue, useTransform } from 'framer-motion';

type Props = {
  value: number | undefined;
  className?: string;
};

export const AnimatedCounter = ({ value, className }: Props) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    try {
      return new Intl.NumberFormat('lv-LV', { style: 'currency', currency: 'EUR' }).format(latest);
    } catch {
      return '€0.00';
    }
  });

  useEffect(() => {
    const target = typeof value === 'number' && Number.isFinite(value) ? value : 0;
    const controls = animate(count, target, { duration: 0.75, ease: 'easeOut' });
    return controls.stop;
  }, [value, count]);

  return <m.span className={className}>{rounded}</m.span>;
};
