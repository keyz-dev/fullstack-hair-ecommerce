import { ArrowUp, ArrowDown } from "lucide-react";
import { colorThemes } from "../../constants/theme";

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  colorTheme = "white",
  className = "",
  ...props
}) => {
  const theme = colorThemes[colorTheme] || colorThemes.white;
  const TrendIcon = trend === "up" ? ArrowUp : ArrowDown;
  const trendColor = trend === "up" ? "text-green-500" : "text-red-500";
  const trendBgColor = trend === "up" ? "bg-green-100" : "bg-red-100";

  return (
    <div
      className={`${theme.background} rounded-sm p-3 border ${theme.border} hover:shadow-xs transition-shadow duration-200 w-[180px] lg:w-[250px] mb-3 ${className}`}
      {...props}
    >
      {/* Header with Icon */}
      <div className="flex items-center gap-4 mb-3 sm:mb-4">
        <div className={`${theme.iconBg} p-2 sm:p-3 rounded-xl flex-shrink-0`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-lg font-medium text-primary mb-1 sm:mb-2 leading-tight">
          {title}
        </h3>
      </div>

      {trendValue && (
        <div
          className={`${trendBgColor} px-2 py-1 rounded-sm flex items-center gap-1`}
        >
          <TrendIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${trendColor}`} />
          <span className={`text-xs sm:text-sm font-medium ${trendColor}`}>
            {trendValue}%
          </span>
        </div>
      )}
      {/* Value */}
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2 sm:mb-3">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs sm:text-sm text-placeholder leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatCard;
