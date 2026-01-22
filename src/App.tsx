import { useState, useMemo } from 'react';
import { FilterState } from './types';
import { generateSubscriptionData } from './dataGenerator';
import {
  filterData,
  aggregateByDate,
  calculateMetrics,
  aggregateByPlatform,
  aggregateByPlan,
} from './dataUtils';
import { FilterPanel } from './components/FilterPanel';
import { MetricCard } from './components/MetricCard';
import {
  TimeSeriesChart,
  MRRChart,
  PlatformChart,
  PlanChart,
} from './components/Charts';
import { subDays, startOfDay } from 'date-fns';

function App() {
  // 全データを生成（90日分）
  const allData = useMemo(() => generateSubscriptionData(90), []);

  // フィルターの初期状態
  const [filters, setFilters] = useState<FilterState>({
    startDate: subDays(startOfDay(new Date()), 30),
    endDate: startOfDay(new Date()),
    platform: 'All',
    planType: 'All',
  });

  // フィルタリングされたデータ
  const filteredData = useMemo(
    () => filterData(allData, filters),
    [allData, filters]
  );

  // 前期間のデータ（比較用）
  const previousFilters = useMemo(() => {
    const daysDiff = Math.floor(
      (filters.endDate.getTime() - filters.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return {
      ...filters,
      startDate: subDays(filters.startDate, daysDiff + 1),
      endDate: subDays(filters.endDate, daysDiff + 1),
    };
  }, [filters]);

  const previousData = useMemo(
    () => filterData(allData, previousFilters),
    [allData, previousFilters]
  );

  // メトリクスを計算
  const metrics = useMemo(
    () => calculateMetrics(filteredData, previousData),
    [filteredData, previousData]
  );

  // チャート用のデータを集計
  const timeSeriesData = useMemo(
    () => aggregateByDate(filteredData),
    [filteredData]
  );

  const platformData = useMemo(
    () => aggregateByPlatform(filteredData),
    [filteredData]
  );

  const planData = useMemo(
    () => aggregateByPlan(filteredData),
    [filteredData]
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            サブスクリプション分析ダッシュボード
          </h1>
          <p className="text-purple-100">
            モバイルアプリのサブスクリプション契約状況をリアルタイムで可視化
          </p>
        </div>

        {/* フィルターパネル */}
        <FilterPanel filters={filters} onFilterChange={setFilters} />

        {/* KPIカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <MetricCard
            title="有効サブスク数"
            value={metrics.activeSubscriptions}
            change={metrics.activeChange}
            icon="📊"
            format="number"
          />
          <MetricCard
            title="新規サブスク"
            value={metrics.newSubscriptions}
            change={metrics.newChange}
            icon="🎉"
            format="number"
          />
          <MetricCard
            title="解約数"
            value={metrics.cancellations}
            change={metrics.cancellationChange}
            icon="😞"
            format="number"
          />
          <MetricCard
            title="MRR"
            value={metrics.mrr}
            change={metrics.mrrChange}
            icon="💰"
            format="currency"
          />
          <MetricCard
            title="トライアル転換率"
            value={metrics.trialConversionRate}
            change={metrics.trialConversionChange}
            icon="🎯"
            format="percentage"
          />
        </div>

        {/* チャート */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="lg:col-span-2">
            <TimeSeriesChart
              data={timeSeriesData}
              title="サブスクリプション推移"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MRRChart data={timeSeriesData} />
          <PlatformChart data={platformData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlanChart data={planData} />
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              インサイト
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-gray-800">成長トレンド</p>
                  <p className="text-sm text-gray-600">
                    {metrics.activeChange > 0
                      ? `有効サブスクが前期比 ${metrics.activeChange.toFixed(1)}% 増加しています。`
                      : `有効サブスクが前期比 ${Math.abs(metrics.activeChange).toFixed(1)}% 減少しています。`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📈</span>
                <div>
                  <p className="font-semibold text-gray-800">収益状況</p>
                  <p className="text-sm text-gray-600">
                    現在のMRRは ${metrics.mrr.toLocaleString()} で、
                    {metrics.mrrChange > 0
                      ? `前期比 ${metrics.mrrChange.toFixed(1)}% 増加しています。`
                      : `前期比 ${Math.abs(metrics.mrrChange).toFixed(1)}% 減少しています。`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-semibold text-gray-800">
                    トライアル転換
                  </p>
                  <p className="text-sm text-gray-600">
                    トライアル転換率は {metrics.trialConversionRate.toFixed(1)}% で、
                    {metrics.trialConversionChange > 0
                      ? '改善傾向にあります。'
                      : '低下傾向にあります。'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center text-purple-100 text-sm">
          <p>© 2026 Subscription Analytics Dashboard - All rights reserved</p>
        </div>
      </div>
    </div>
  );
}

export default App;
