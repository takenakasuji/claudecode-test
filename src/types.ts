export type Platform = 'iOS' | 'Android' | 'All';
export type PlanType = 'monthly' | 'annual' | 'All';
export type DateRange = '7days' | '30days' | '90days' | '1year';

export interface SubscriptionData {
  date: string;
  platform: Platform;
  planType: PlanType;
  activeSubscriptions: number;
  newSubscriptions: number;
  cancellations: number;
  mrr: number;
  trialConversions: number;
  trials: number;
}

export interface Filters {
  dateRange: DateRange;
  platform: Platform;
  planType: PlanType;
}

export interface MetricsSummary {
  activeSubscriptions: number;
  newSubscriptions: number;
  cancellations: number;
  mrr: number;
  trialConversionRate: number;
  activeChange: number;
  newChange: number;
  cancellationChange: number;
  mrrChange: number;
  trialConversionChange: number;
}
