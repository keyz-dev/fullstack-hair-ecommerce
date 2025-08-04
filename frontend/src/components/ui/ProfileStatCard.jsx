import React from 'react';
import { colorThemes } from "../../constants/theme";

const ProfileStatCard = ({
  title,
  value,
  description,
  icon: Icon,
  colorTheme = "white",
  className = "",
  isLoading = false,
  ...props
}) => {
  const theme = colorThemes[colorTheme] || colorThemes.white;

  return (
    <div
      className={`${theme.background} rounded-lg p-4 border ${theme.border} hover:shadow-sm transition-shadow duration-200 ${className}`}
      {...props}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`${theme.iconBg} p-2 rounded-lg flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${theme.iconColor}`} />
        </div>
        <h3 className="text-sm font-medium text-gray-900 leading-tight">
          {title}
        </h3>
      </div>

      {/* Value */}
      <div className="text-xl font-bold text-gray-900 mb-1">
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
        ) : (
          typeof value === "number" ? value.toLocaleString() : value
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default ProfileStatCard; 