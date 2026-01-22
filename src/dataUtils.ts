import { subDays } from 'date-fns';
import { SubscriptionData, Filters, MetricsSummary, DateRange } from './types';

export function filterData(
  data: SubscriptionData[],
  filters: Filters
): SubscriptionData[] {
  const endDate = new Date();
  const startDate = getStartDate(filters.dateRange, endDate);

  return data.filter(item => {
    const itemDate = new Date(item.date);
    const dateMatch = itemDate >= startDate && itemDate <= endDate;
    const platformMatch = filters.platform === 'All' || item.platform === filters.platform;
    const planMatch = filters.planType === 'All' || item.planType === filters.planType;

    return dateMatch && platformMatch && planMatch;
  });
}

function getStartDate(range: DateRange, endDate: Date): Date {
  switch (range) {
    case '7days':
      return subDays(endDate, 7);
    case '30days':
      return subDays(endDate, 30);
    case '90days':
      return subDays(endDate, 90);
    case '1year':
      return subDays(endDate, 365);
  }
}

export function aggregateByDate(data: SubscriptionData[]): SubscriptionData[] {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = {
        date: item.date,
        platform: 'All' as const,
        planType: 'All' as const,
        activeSubscriptions: 0,
        newSubscriptions: 0,
        cancellations: 0,
        mrr: 0,
        trialConversions: 0,
        trials: 0
      };
    }

    acc[item.date].activeSubscriptions += item.activeSubscriptions;
    acc[item.date].newSubscriptions += item.newSubscriptions;
    acc[item.date].cancellations += item.cancellations;
    acc[item.date].mrr += item.mrr;
    acc[item.date].trialConversions += item.trialConversions;
    acc[item.date].trials += item.trials;

    return acc;
  }, {} as Record<string, SubscriptionData>);

  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
}

export function calculateMetrics(
  currentData: SubscriptionData[],
  previousData: SubscriptionData[]
): MetricsSummary {
  const current = sumMetrics(currentData);
  const previous = sumMetrics(previousData);

  const trialConversionRate = current.trials > 0
    ? (current.trialConversions / current.trials) * 100
    : 0;

  const previousTrialConversionRate = previous.trials > 0
    ? (previous.trialConversions / previous.trials) * 100
    : 0;

  return {
    activeSubscriptions: current.activeSubscriptions,
    newSubscriptions: current.newSubscriptions,
    cancellations: current.cancellations,
    mrr: current.mrr,
    trialConversionRate,
    activeChange: calculateChange(current.activeSubscriptions, previous.activeSubscriptions),
    newChange: calculateChange(current.newSubscriptions, previous.newSubscriptions),
    cancellationChange: calculateChange(current.cancellations, previous.cancellations),
    mrrChange: calculateChange(current.mrr, previous.mrr),
    trialConversionChange: trialConversionRate - previousTrialConversionRate
  };
}

function sumMetrics(data: SubscriptionData[]) {
  if (data.length === 0) {
    return {
      activeSubscriptions: 0,
      newSubscriptions: 0,
      cancellations: 0,
      mrr: 0,
      trialConversions: 0,
      trials: 0
    };
  }

  // For active subscriptions and MRR, take the latest value
  const latest = data[data.length - 1];

  // For new, cancellations, and trial conversions, sum them up
  return data.reduce((acc, item) => ({
    activeSubscriptions: latest.activeSubscriptions,
    newSubscriptions: acc.newSubscriptions + item.newSubscriptions,
    cancellations: acc.cancellations + item.cancellations,
    mrr: latest.mrr,
    trialConversions: acc.trialConversions + item.trialConversions,
    trials: acc.trials + item.trials
  }), {
    activeSubscriptions: 0,
    newSubscriptions: 0,
    cancellations: 0,
    mrr: 0,
    trialConversions: 0,
    trials: 0
  });
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function getPreviousPeriodData(
  allData: SubscriptionData[],
  filters: Filters
): SubscriptionData[] {
  const endDate = subDays(new Date(), getDaysForRange(filters.dateRange) + 1);
  const startDate = getStartDate(filters.dateRange, endDate);

  return allData.filter(item => {
    const itemDate = new Date(item.date);
    const dateMatch = itemDate >= startDate && itemDate <= endDate;
    const platformMatch = filters.platform === 'All' || item.platform === filters.platform;
    const planMatch = filters.planType === 'All' || item.planType === filters.planType;

    return dateMatch && platformMatch && planMatch;
  });
}

function getDaysForRange(range: DateRange): number {
  switch (range) {
    case '7days': return 7;
    case '30days': return 30;
    case '90days': return 90;
    case '1year': return 365;
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ja-JP').format(value);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return value.toFixed(decimals) + '%';
}
