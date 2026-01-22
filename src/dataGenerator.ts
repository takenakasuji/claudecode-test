import { SubscriptionData } from './types';
import { subDays, startOfDay } from 'date-fns';

// リアルなトレンドとスパイクを持つダミーデータを生成
export function generateSubscriptionData(days: number = 90): SubscriptionData[] {
  const data: SubscriptionData[] = [];
  const today = startOfDay(new Date());

  // ベースとなるメトリクス
  let iOSMonthlyBase = 1200;
  let iOSYearlyBase = 800;
  let androidMonthlyBase = 900;
  let androidYearlyBase = 600;

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dayOfWeek = date.getDay();

    // 週末効果（土日は新規が少ない）
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.0;

    // 成長トレンド（徐々に増加）
    const growthFactor = 1 + ((days - i) / days) * 0.3;

    // ランダムなスパイク（5%の確率で発生）
    const hasSpike = Math.random() < 0.05;
    const spikeFactor = hasSpike ? 1.5 + Math.random() * 0.5 : 1.0;

    // ノイズ
    const noise = 0.9 + Math.random() * 0.2;

    // iOS Monthly
    const iOSMonthlyActive = Math.floor(iOSMonthlyBase * growthFactor * noise);
    const iOSMonthlyNew = Math.floor(40 * weekendFactor * spikeFactor * noise);
    const iOSMonthlyCancellations = Math.floor(15 * noise);
    const iOSMonthlyTrials = Math.floor(60 * weekendFactor * spikeFactor * noise);
    const iOSMonthlyConversions = Math.floor(iOSMonthlyTrials * (0.25 + Math.random() * 0.15));

    data.push({
      date,
      platform: 'iOS',
      planType: 'Monthly',
      activeSubscriptions: iOSMonthlyActive,
      newSubscriptions: iOSMonthlyNew,
      cancellations: iOSMonthlyCancellations,
      mrr: iOSMonthlyActive * 9.99,
      trialConversions: iOSMonthlyConversions,
      totalTrials: iOSMonthlyTrials,
    });

    iOSMonthlyBase += iOSMonthlyNew - iOSMonthlyCancellations;

    // iOS Yearly
    const iOSYearlyActive = Math.floor(iOSYearlyBase * growthFactor * noise);
    const iOSYearlyNew = Math.floor(25 * weekendFactor * spikeFactor * noise);
    const iOSYearlyCancellations = Math.floor(8 * noise);
    const iOSYearlyTrials = Math.floor(40 * weekendFactor * spikeFactor * noise);
    const iOSYearlyConversions = Math.floor(iOSYearlyTrials * (0.35 + Math.random() * 0.15));

    data.push({
      date,
      platform: 'iOS',
      planType: 'Yearly',
      activeSubscriptions: iOSYearlyActive,
      newSubscriptions: iOSYearlyNew,
      cancellations: iOSYearlyCancellations,
      mrr: (iOSYearlyActive * 99.99) / 12,
      trialConversions: iOSYearlyConversions,
      totalTrials: iOSYearlyTrials,
    });

    iOSYearlyBase += iOSYearlyNew - iOSYearlyCancellations;

    // Android Monthly
    const androidMonthlyActive = Math.floor(androidMonthlyBase * growthFactor * noise);
    const androidMonthlyNew = Math.floor(35 * weekendFactor * spikeFactor * noise);
    const androidMonthlyCancellations = Math.floor(12 * noise);
    const androidMonthlyTrials = Math.floor(50 * weekendFactor * spikeFactor * noise);
    const androidMonthlyConversions = Math.floor(androidMonthlyTrials * (0.22 + Math.random() * 0.12));

    data.push({
      date,
      platform: 'Android',
      planType: 'Monthly',
      activeSubscriptions: androidMonthlyActive,
      newSubscriptions: androidMonthlyNew,
      cancellations: androidMonthlyCancellations,
      mrr: androidMonthlyActive * 8.99,
      trialConversions: androidMonthlyConversions,
      totalTrials: androidMonthlyTrials,
    });

    androidMonthlyBase += androidMonthlyNew - androidMonthlyCancellations;

    // Android Yearly
    const androidYearlyActive = Math.floor(androidYearlyBase * growthFactor * noise);
    const androidYearlyNew = Math.floor(20 * weekendFactor * spikeFactor * noise);
    const androidYearlyCancellations = Math.floor(6 * noise);
    const androidYearlyTrials = Math.floor(35 * weekendFactor * spikeFactor * noise);
    const androidYearlyConversions = Math.floor(androidYearlyTrials * (0.30 + Math.random() * 0.15));

    data.push({
      date,
      platform: 'Android',
      planType: 'Yearly',
      activeSubscriptions: androidYearlyActive,
      newSubscriptions: androidYearlyNew,
      cancellations: androidYearlyCancellations,
      mrr: (androidYearlyActive * 89.99) / 12,
      trialConversions: androidYearlyConversions,
      totalTrials: androidYearlyTrials,
    });

    androidYearlyBase += androidYearlyNew - androidYearlyCancellations;
  }

  return data;
}
