import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium
    rounded-lg transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-500 to-indigo-600
      text-white shadow-md hover:shadow-lg
      hover:from-blue-600 hover:to-indigo-700
      active:shadow-sm
    `,
    secondary: `
      bg-slate-100 text-slate-900
      hover:bg-slate-200 active:bg-slate-150
      border border-slate-200
    `,
    ghost: `
      bg-transparent text-blue-600
      hover:bg-blue-50 active:bg-blue-100
    `,
    danger: `
      bg-red-500 text-white hover:bg-red-600
      active:bg-red-700 shadow-md hover:shadow-lg
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="w-5 h-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !isLoading && icon}
      {children}
    </button>
  );
};
