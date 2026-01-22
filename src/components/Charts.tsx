import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { SubscriptionData } from '../types';
import { formatCurrency, formatNumber } from '../dataUtils';

interface ChartsProps {
  data: SubscriptionData[];
}

export function Charts({ data }: ChartsProps) {
  const chartData = data.map(item => ({
    date: format(new Date(item.date), 'M/d', { locale: ja }),
    fullDate: item.date,
    activeSubscriptions: item.activeSubscriptions,
    newSubscriptions: item.newSubscriptions,
    cancellations: item.cancellations,
    mrr: item.mrr,
    trialConversions: item.trialConversions
  }));

  // Sample data points for better chart readability
  const sampledData = chartData.filter((_, index) => {
    if (chartData.length <= 30) return true;
    if (chartData.length <= 90) return index % 3 === 0;
    return index % 7 === 0;
  });

  return (
    <div className="space-y-6">
      {/* Active Subscriptions Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">有効サブスクリプション数の推移</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sampledData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
              formatter={(value: number) => formatNumber(value)}
              labelFormatter={(label) => `日付: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="activeSubscriptions"
              stroke="#3b82f6"
              strokeWidth={2}
              name="有効サブスク数"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* New Subscriptions vs Cancellations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">新規契約 vs 解約</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sampledData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
              formatter={(value: number) => formatNumber(value)}
              labelFormatter={(label) => `日付: ${label}`}
            />
            <Legend />
            <Bar dataKey="newSubscriptions" fill="#10b981" name="新規契約" />
            <Bar dataKey="cancellations" fill="#ef4444" name="解約" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* MRR Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">MRR（月次経常収益）の推移</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sampledData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `¥${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `日付: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="mrr"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="MRR"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trial Conversions Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">トライアル転換数の推移</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sampledData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
              formatter={(value: number) => formatNumber(value)}
              labelFormatter={(label) => `日付: ${label}`}
            />
            <Legend />
            <Bar dataKey="trialConversions" fill="#f59e0b" name="トライアル転換数" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
