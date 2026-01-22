import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TimeSeriesChartProps {
  data: any[];
  title: string;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#666" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="activeSubscriptions"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="有効サブスク"
            dot={{ fill: '#8b5cf6', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="newSubscriptions"
            stroke="#10b981"
            strokeWidth={2}
            name="新規"
            dot={{ fill: '#10b981', r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="cancellations"
            stroke="#ef4444"
            strokeWidth={2}
            name="解約"
            dot={{ fill: '#ef4444', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface MRRChartProps {
  data: any[];
}

export const MRRChart: React.FC<MRRChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">MRR推移</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#666" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend />
          <Bar
            dataKey="mrr"
            fill="#8b5cf6"
            name="MRR"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PlatformChartProps {
  data: any[];
}

const PLATFORM_COLORS = {
  iOS: '#000000',
  Android: '#3ddc84',
};

export const PlatformChart: React.FC<PlatformChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">プラットフォーム別分布</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="activeSubscriptions"
            nameKey="platform"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ platform, percent }) =>
              `${platform} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PLATFORM_COLORS[entry.platform as keyof typeof PLATFORM_COLORS]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => value.toLocaleString()}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PlanChartProps {
  data: any[];
}

const PLAN_COLORS = {
  Monthly: '#3b82f6',
  Yearly: '#f59e0b',
};

export const PlanChart: React.FC<PlanChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">プラン別分布</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="activeSubscriptions"
            nameKey="planType"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ planType, percent }) =>
              `${planType === 'Monthly' ? '月額' : '年額'} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PLAN_COLORS[entry.planType as keyof typeof PLAN_COLORS]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => value.toLocaleString()}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
