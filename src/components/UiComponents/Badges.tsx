import React from 'react';
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from './Icons';

type BadgeType = 'success' | 'error' | 'warning' | 'info' | 'light';

interface BadgeProps {
  type: BadgeType;
  label: string;
  rounded?: 'full' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  customTheme?: boolean;
  color?: string;
  fontWeight?: 'bold' | 'semibold' | 'extrabold' | 'medium' | 'normal';
}

const Badges: Record<BadgeType, { icon: React.ReactNode; color: string }> = {
  success: {
    icon: <SuccessIcon />,
    color: 'bg-emerald-100 text-emerald-700',
  },
  error: {
    icon: <ErrorIcon />,
    color: 'bg-red-100 text-red-700',
  },

  warning: {
    icon: <WarningIcon />,
    color: 'bg-amber-100 text-amber-700',
  },
  info: {
    icon: <InfoIcon />,
    color: 'bg-teal-100 text-teal-700',
  },
  light: {
    icon: <InfoIcon />,
    color: 'bg-pink-100 text-pink-700',
  },
};

const Badge: React.FC<BadgeProps> = ({
  type,
  label,
  rounded = 'full',
  textSize = 'xs',
  customTheme = false,
  color = '',
  fontWeight = 'normal',
}) => {
  const roundedClass = `rounded-${rounded}`;
  const textSizeClass = `text-${textSize}`;
  let badgeStyle = '';
  if (customTheme) {
    badgeStyle = `inline-flex items-center justify-center ${roundedClass} px-2.5 py-1 ${color}    cursor-pointer space-x-1`;
  } else {
    badgeStyle = `inline-flex items-center justify-center ${roundedClass} px-2.5 py-1 ${Badges[type].color} cursor-pointer space-x-1`;
  }

  const fontWeightStyle = `font-${fontWeight}`;
  return (
    <span className={badgeStyle}>
      {Badges[type].icon}
      <p
        className={`whitespace-wrap ${textSizeClass} capitalize  ${fontWeightStyle}`}
      >
        {label}
      </p>
    </span>
  );
};
export default Badge;
