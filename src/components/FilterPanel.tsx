import React from 'react';
import { FilterState, Platform, PlanType } from '../types';
import { format, addDays } from 'date-fns';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFilterChange({
      ...filters,
      [field]: new Date(value),
    });
  };

  const handlePlatformChange = (platform: Platform) => {
    onFilterChange({
      ...filters,
      platform,
    });
  };

  const handlePlanTypeChange = (planType: PlanType) => {
    onFilterChange({
      ...filters,
      planType,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">フィルター</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 期間フィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            開始日
          </label>
          <input
            type="date"
            value={format(filters.startDate, 'yyyy-MM-dd')}
            max={format(addDays(filters.endDate, -1), 'yyyy-MM-dd')}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            終了日
          </label>
          <input
            type="date"
            value={format(filters.endDate, 'yyyy-MM-dd')}
            min={format(addDays(filters.startDate, 1), 'yyyy-MM-dd')}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* プラットフォームフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            プラットフォーム
          </label>
          <div className="flex gap-2">
            {(['All', 'iOS', 'Android'] as Platform[]).map((platform) => (
              <button
                key={platform}
                onClick={() => handlePlatformChange(platform)}
                className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
                  filters.platform === platform
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* プランタイプフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            プラン
          </label>
          <div className="flex gap-2">
            {(['All', 'Monthly', 'Yearly'] as PlanType[]).map((planType) => (
              <button
                key={planType}
                onClick={() => handlePlanTypeChange(planType)}
                className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
                  filters.planType === planType
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {planType === 'Monthly' ? '月額' : planType === 'Yearly' ? '年額' : 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
