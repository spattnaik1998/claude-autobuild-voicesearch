import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlighted' | 'elevated';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hoverable = false,
  className = '',
  children,
  ...props
}) => {
  const variants = {
    default: `
      bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
      rounded-xl shadow-sm dark:shadow-sm dark:shadow-black/20
    `,
    highlighted: `
      bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30
      border border-blue-200 dark:border-blue-800 rounded-xl shadow-sm dark:shadow-sm dark:shadow-black/20
    `,
    elevated: `
      bg-white dark:bg-slate-800 rounded-xl
      shadow-lg dark:shadow-lg dark:shadow-black/30
    `,
  };

  return (
    <div
      className={`
        ${variants[variant]}
        transition-all duration-200
        ${hoverable ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
