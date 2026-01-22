import { SubscriptionData, FilterState, AggregatedMetrics } from './types';
import { isWithinInterval, format } from 'date-fns';

// フィルタリングされたデータを取得
export function filterData(
  data: SubscriptionData[],
  filters: FilterState
): SubscriptionData[] {
  return data.filter((item) => {
    const dateMatch = isWithinInterval(item.date, {
      start: filters.startDate,
      end: filters.endDate,
    });

    const platformMatch =
      filters.platform === 'All' || item.platform === filters.platform;

    const planTypeMatch =
      filters.planType === 'All' || item.planType === filters.planType;

    return dateMatch && platformMatch && planTypeMatch;
  });
}

// 日付ごとにデータを集計
export function aggregateByDate(data: SubscriptionData[]): any[] {
  const grouped = data.reduce((acc, item) => {
    const dateKey = format(item.date, 'yyyy-MM-dd');

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        activeSubscriptions: 0,
        newSubscriptions: 0,
        cancellations: 0,
        mrr: 0,
        trialConversions: 0,
        totalTrials: 0,
      };
    }

    acc[dateKey].activeSubscriptions += item.activeSubscriptions;
    acc[dateKey].newSubscriptions += item.newSubscriptions;
    acc[dateKey].cancellations += item.cancellations;
    acc[dateKey].mrr += item.mrr;
    acc[dateKey].trialConversions += item.trialConversions;
    acc[dateKey].totalTrials += item.totalTrials;

    return acc;
  }, {} as Record<string, any>);

  return Object.values(grouped).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

// KPIメトリクスを計算
export function calculateMetrics(
  currentData: SubscriptionData[],
  previousData: SubscriptionData[]
): AggregatedMetrics {
  const currentMetrics = aggregateMetrics(currentData);
  const previousMetrics = aggregateMetrics(previousData);

  return {
    activeSubscriptions: currentMetrics.activeSubscriptions,
    newSubscriptions: currentMetrics.newSubscriptions,
    cancellations: currentMetrics.cancellations,
    mrr: currentMetrics.mrr,
    trialConversionRate: currentMetrics.trialConversionRate,
    activeChange: calculateChange(
      currentMetrics.activeSubscriptions,
      previousMetrics.activeSubscriptions
    ),
    newChange: calculateChange(
      currentMetrics.newSubscriptions,
      previousMetrics.newSubscriptions
    ),
    cancellationChange: calculateChange(
      currentMetrics.cancellations,
      previousMetrics.cancellations
    ),
    mrrChange: calculateChange(currentMetrics.mrr, previousMetrics.mrr),
    trialConversionChange: calculateChange(
      currentMetrics.trialConversionRate,
      previousMetrics.trialConversionRate
    ),
  };
}

function aggregateMetrics(data: SubscriptionData[]) {
  const totalActive = data.reduce((sum, item) => sum + item.activeSubscriptions, 0);
  const totalNew = data.reduce((sum, item) => sum + item.newSubscriptions, 0);
  const totalCancellations = data.reduce((sum, item) => sum + item.cancellations, 0);
  const totalMRR = data.reduce((sum, item) => sum + item.mrr, 0);
  const totalConversions = data.reduce((sum, item) => sum + item.trialConversions, 0);
  const totalTrials = data.reduce((sum, item) => sum + item.totalTrials, 0);

  return {
    activeSubscriptions: Math.floor(totalActive / data.length) || 0,
    newSubscriptions: totalNew,
    cancellations: totalCancellations,
    mrr: totalMRR,
    trialConversionRate: totalTrials > 0 ? (totalConversions / totalTrials) * 100 : 0,
  };
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// プラットフォーム別の集計
export function aggregateByPlatform(data: SubscriptionData[]): any[] {
  const grouped = data.reduce((acc, item) => {
    const platform = item.platform;

    if (!acc[platform]) {
      acc[platform] = {
        platform,
        activeSubscriptions: 0,
        newSubscriptions: 0,
        mrr: 0,
      };
    }

    acc[platform].activeSubscriptions += item.activeSubscriptions;
    acc[platform].newSubscriptions += item.newSubscriptions;
    acc[platform].mrr += item.mrr;

    return acc;
  }, {} as Record<string, any>);

  return Object.values(grouped);
}

// プラン別の集計
export function aggregateByPlan(data: SubscriptionData[]): any[] {
  const grouped = data.reduce((acc, item) => {
    const planType = item.planType;

    if (!acc[planType]) {
      acc[planType] = {
        planType,
        activeSubscriptions: 0,
        newSubscriptions: 0,
        mrr: 0,
      };
    }

    acc[planType].activeSubscriptions += item.activeSubscriptions;
    acc[planType].newSubscriptions += item.newSubscriptions;
    acc[planType].mrr += item.mrr;

    return acc;
  }, {} as Record<string, any>);

  return Object.values(grouped);
}
