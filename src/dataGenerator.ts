import { subDays, format } from 'date-fns';
import { SubscriptionData } from './types';

// Generate realistic subscription data with trends and occasional spikes
export function generateSubscriptionData(): SubscriptionData[] {
  const data: SubscriptionData[] = [];
  const today = new Date();
  const daysToGenerate = 365;

  const platforms: Array<'iOS' | 'Android'> = ['iOS', 'Android'];
  const planTypes: Array<'monthly' | 'annual'> = ['monthly', 'annual'];

  // Base values for different combinations
  const baseValues = {
    iOS: {
      monthly: { active: 5000, new: 150, cancellation: 80, mrr: 75000, trial: 200 },
      annual: { active: 2000, new: 50, cancellation: 20, mrr: 180000, trial: 60 }
    },
    Android: {
      monthly: { active: 4000, new: 120, cancellation: 70, mrr: 60000, trial: 180 },
      annual: { active: 1500, new: 40, cancellation: 15, mrr: 135000, trial: 50 }
    }
  };

  for (let i = daysToGenerate; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = date.getDay();
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

    platforms.forEach(platform => {
      planTypes.forEach(planType => {
        const base = baseValues[platform][planType];

        // Growth trend (positive growth over time)
        const growthFactor = 1 + (daysToGenerate - i) / daysToGenerate * 0.3;

        // Weekly seasonality (weekends have different patterns)
        const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.0;

        // Add some noise
        const noise = () => 0.9 + Math.random() * 0.2;

        // Occasional spikes (campaigns, holidays, etc.)
        let spikeFactor = 1.0;
        // Black Friday spike (around day 330)
        if (dayOfYear >= 325 && dayOfYear <= 335) {
          spikeFactor = 2.5;
        }
        // New Year spike (around day 1-7)
        if (dayOfYear >= 1 && dayOfYear <= 7) {
          spikeFactor = 2.0;
        }
        // Summer promotion (around day 180-190)
        if (dayOfYear >= 180 && dayOfYear <= 190) {
          spikeFactor = 1.8;
        }
        // Random mini spikes
        if (Math.random() < 0.05) {
          spikeFactor = 1.5 + Math.random() * 0.5;
        }

        const newSubs = Math.round(
          base.new * growthFactor * weekendFactor * noise() * spikeFactor
        );

        const cancellations = Math.round(
          base.cancellation * (1 + (Math.random() - 0.5) * 0.3) * weekendFactor
        );

        const netChange = newSubs - cancellations;
        const activeSubs = Math.round(
          base.active * growthFactor + netChange * 0.3
        );

        const trials = Math.round(
          base.trial * growthFactor * weekendFactor * noise() * spikeFactor
        );

        const trialConversions = Math.round(
          trials * (0.15 + Math.random() * 0.15) // 15-30% conversion rate
        );

        const mrr = Math.round(
          base.mrr * growthFactor * (1 + (Math.random() - 0.5) * 0.05)
        );

        data.push({
          date: dateStr,
          platform,
          planType,
          activeSubscriptions: activeSubs,
          newSubscriptions: newSubs,
          cancellations,
          mrr,
          trialConversions,
          trials
        });
      });
    });
  }

  return data;
}

// Cache the generated data
let cachedData: SubscriptionData[] | null = null;

export function getSubscriptionData(): SubscriptionData[] {
  if (!cachedData) {
    cachedData = generateSubscriptionData();
  }
  return cachedData;
}
