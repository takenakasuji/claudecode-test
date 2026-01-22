import { Filters as FilterType, DateRange, Platform, PlanType } from '../types';

interface FiltersProps {
  filters: FilterType;
  onChange: (filters: FilterType) => void;
}

export function Filters({ filters, onChange }: FiltersProps) {
  const dateRanges: { value: DateRange; label: string }[] = [
    { value: '7days', label: '過去7日間' },
    { value: '30days', label: '過去30日間' },
    { value: '90days', label: '過去90日間' },
    { value: '1year', label: '過去1年間' }
  ];

  const platforms: { value: Platform; label: string }[] = [
    { value: 'All', label: '全プラットフォーム' },
    { value: 'iOS', label: 'iOS' },
    { value: 'Android', label: 'Android' }
  ];

  const planTypes: { value: PlanType; label: string }[] = [
    { value: 'All', label: '全プラン' },
    { value: 'monthly', label: '月額プラン' },
    { value: 'annual', label: '年額プラン' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">フィルター</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            期間
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onChange({ ...filters, dateRange: e.target.value as DateRange })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {dateRanges.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            プラットフォーム
          </label>
          <select
            value={filters.platform}
            onChange={(e) => onChange({ ...filters, platform: e.target.value as Platform })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {platforms.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            プランタイプ
          </label>
          <select
            value={filters.planType}
            onChange={(e) => onChange({ ...filters, planType: e.target.value as PlanType })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {planTypes.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
