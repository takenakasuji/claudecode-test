export type Platform = 'iOS' | 'Android' | 'All';
export type PlanType = 'Monthly' | 'Yearly' | 'All';

export interface SubscriptionData {
  date: Date;
  platform: 'iOS' | 'Android';
  planType: 'Monthly' | 'Yearly';
  activeSubscriptions: number;
  newSubscriptions: number;
  cancellations: number;
  mrr: number;
  trialConversions: number;
  totalTrials: number;
}

export interface FilterState {
  startDate: Date;
  endDate: Date;
  platform: Platform;
  planType: PlanType;
}

export interface AggregatedMetrics {
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
