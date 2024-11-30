import { ReactNode } from 'react';

interface GridProps {
  children: ReactNode;
  cols?: number | { sm?: number; md?: number; lg?: number };
  gap?: number;
  className?: string;
}

export function Grid({ children, cols = 1, gap = 4, className = '' }: GridProps) {
  const getColsClass = () => {
    if (typeof cols === 'number') {
      return `grid-cols-${cols}`;
    }

    return [
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`
    ]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div
      className={`
        grid grid-cols-1 ${getColsClass()}
        gap-${gap}
        ${className}
      `}
    >
      {children}
    </div>
  );
} 