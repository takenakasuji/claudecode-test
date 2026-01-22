import { formatCurrency, formatNumber, formatPercentage } from '../dataUtils';

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  format: 'number' | 'currency' | 'percentage';
  inverse?: boolean;
}

export function MetricCard({ title, value, change, format, inverse = false }: MetricCardProps) {
  const formattedValue = format === 'currency'
    ? formatCurrency(value)
    : format === 'percentage'
    ? formatPercentage(value, 1)
    : formatNumber(value);

  const isPositive = inverse ? change < 0 : change > 0;
  const changeColor = change === 0
    ? 'text-gray-500'
    : isPositive
    ? 'text-green-600'
    : 'text-red-600';

  const changeIcon = change === 0
    ? '→'
    : isPositive
    ? '↑'
    : '↓';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-gray-900">{formattedValue}</p>
        <div className={`flex items-center text-sm font-semibold ${changeColor}`}>
          <span className="mr-1">{changeIcon}</span>
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">前期比</p>
    </div>
  );
}
