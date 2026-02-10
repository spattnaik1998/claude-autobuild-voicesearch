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
      bg-white border border-slate-200
      rounded-xl shadow-sm
    `,
    highlighted: `
      bg-gradient-to-br from-slate-50 to-blue-50
      border border-blue-200 rounded-xl shadow-sm
    `,
    elevated: `
      bg-white rounded-xl
      shadow-lg
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
