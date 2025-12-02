
import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area
} from 'recharts';
import type { MetricsHistoryEntry, TimeUnit, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface ChartsPanelProps {
  data: MetricsHistoryEntry[];
  timeUnit: TimeUnit;
  language: Language;
}

const ChartsPanel: React.FC<ChartsPanelProps> = ({ data, timeUnit, language }) => {
  const t = TRANSLATIONS[language];

  // Format time for X-Axis based on unit
  const formatTime = (value: number) => {
      if (timeUnit === 'Seconds') {
        const mins = Math.floor(value / 60);
        const secs = Math.floor(value % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      } else if (timeUnit === 'Minutes') {
        const hours = Math.floor(value / 60);
        const mins = Math.floor(value % 60);
        return `${hours}:${mins < 10 ? '0' : ''}${mins}`;
      } else {
        // Hours
        const days = Math.floor(value / 24);
        const hours = Math.floor(value % 24);
        return `d${days} ${hours}h`;
      }
  };
  
  const getRightAxisLabel = () => {
      switch (timeUnit) {
          case 'Seconds': return `TH (${t.units.itemsMin}) / LT (${t.units.min})`;
          case 'Minutes': return `TH (${t.units.itemsHr}) / LT (${t.units.hr})`;
          case 'Hours': return `TH (${t.units.itemsDay}) / LT (${t.units.days})`;
      }
  }

  const formatValue = (val: number) => Number(val).toFixed(1);

  return (
    <div className="w-full h-[400px] bg-white rounded-xl p-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            tickFormatter={formatTime} 
            label={{ value: `${t.charts.time} (${timeUnit})`, position: 'insideBottomRight', offset: -5 }}
            stroke="#9ca3af"
          />
          {/* Left Y-Axis: WIP */}
          <YAxis 
            yAxisId="left" 
            label={{ value: t.charts.wip, angle: -90, position: 'insideLeft' }}
            stroke="#FE5000"
            domain={[0, 'auto']}
            tickFormatter={formatValue}
          />
          {/* Right Y-Axis: TH and LT */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            label={{ value: getRightAxisLabel(), angle: 90, position: 'insideRight' }}
            stroke="#0093D0"
            domain={[0, 'auto']}
            tickFormatter={formatValue}
          />
          <Tooltip 
            labelFormatter={formatTime}
            formatter={(value: number) => [formatValue(value)]}
            contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="top" height={36} />
          
          {/* WIP Line */}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="wip"
            name={t.metrics.wip}
            stroke="#FE5000"
            fill="#FE5000"
            fillOpacity={0.1}
            strokeWidth={2}
            dot={false}
          />
          
          {/* Throughput Line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="throughput"
            name={t.metrics.throughput}
            stroke="#0093D0"
            strokeWidth={2}
            dot={false}
          />
          
          {/* Lead Time Line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="leadTime"
            name={t.metrics.leadTime}
            stroke="#D7C4E2" // Kalm Paars
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          {t.charts.waiting}
        </div>
      )}
    </div>
  );
};

export default ChartsPanel;