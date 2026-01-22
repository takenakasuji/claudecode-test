import { useState, useMemo } from 'react';
import { Filters } from './components/Filters';
import { MetricCard } from './components/MetricCard';
import { Charts } from './components/Charts';
import { getSubscriptionData } from './dataGenerator';
import {
  filterData,
  aggregateByDate,
  calculateMetrics,
  getPreviousPeriodData
} from './dataUtils';
import { Filters as FilterType } from './types';

function App() {
  const [filters, setFilters] = useState<FilterType>({
    dateRange: '30days',
    platform: 'All',
    planType: 'All'
  });

  const allData = useMemo(() => getSubscriptionData(), []);

  const { metrics, chartData } = useMemo(() => {
    const currentFiltered = filterData(allData, filters);
    const previousFiltered = getPreviousPeriodData(allData, filters);

    const currentAggregated = aggregateByDate(currentFiltered);
    const previousAggregated = aggregateByDate(previousFiltered);

    const metrics = calculateMetrics(currentAggregated, previousAggregated);

    return {
      metrics,
      chartData: currentAggregated
    };
  }, [allData, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            サブスクリプション分析ダッシュボード
          </h1>
          <p className="text-gray-600">
            モバイルアプリのサブスクリプション契約状況を確認できます
          </p>
        </div>

        {/* Filters */}
        <Filters filters={filters} onChange={setFilters} />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricCard
            title="有効サブスク数"
            value={metrics.activeSubscriptions}
            change={metrics.activeChange}
            format="number"
          />
          <MetricCard
            title="新規契約"
            value={metrics.newSubscriptions}
            change={metrics.newChange}
            format="number"
          />
          <MetricCard
            title="解約"
            value={metrics.cancellations}
            change={metrics.cancellationChange}
            format="number"
            inverse={true}
          />
          <MetricCard
            title="MRR"
            value={metrics.mrr}
            change={metrics.mrrChange}
            format="currency"
          />
          <MetricCard
            title="トライアル転換率"
            value={metrics.trialConversionRate}
            change={metrics.trialConversionChange}
            format="percentage"
          />
        </div>

        {/* Charts */}
        <Charts data={chartData} />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>※ このダッシュボードはデモ用のダミーデータを使用しています</p>
        </div>
      </div>
    </div>
  );
}

export default App;
