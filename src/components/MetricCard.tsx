import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  format?: 'number' | 'currency' | 'percentage';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  format = 'number',
}) => {
  const formatValue = (val: string | number): string => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val;

    if (format === 'currency') {
      return `$${numVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    } else if (format === 'percentage') {
      return `${numVal.toFixed(1)}%`;
    } else {
      return numVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
  };

  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBg = isPositive ? 'bg-green-100' : 'bg-red-100';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {formatValue(value)}
          </p>
          <div className={`inline-flex items-center px-2 py-1 rounded-full ${changeBg}`}>
            <span className={`text-sm font-semibold ${changeColor}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};
