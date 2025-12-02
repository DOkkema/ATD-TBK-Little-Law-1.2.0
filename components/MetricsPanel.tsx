
import React from 'react';
import type { SimulationMetrics, TimeUnit, Language } from '../types';
import { METRICS_WINDOW } from '../constants';
import { TRANSLATIONS } from '../translations';

interface MetricDisplayProps {
  label: string;
  value: string;
  description: string;
  color: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ label, value, description, color }) => (
    <div className={`relative flex-1 p-6 rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden`}>
        <div className={`absolute top-0 left-0 h-1.5 w-full ${color}`}></div>
        <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-4xl font-bold text-black mt-1">{value}</p>
            <p className="text-xs text-gray-400 mt-2">{description}</p>
        </div>
    </div>
);

interface MetricsPanelProps {
  metrics: SimulationMetrics;
  timeUnit: TimeUnit;
  language: Language;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, timeUnit, language }) => {
    const t = TRANSLATIONS[language];
    
    const getLabels = () => {
        switch (timeUnit) {
            case 'Seconds':
                return {
                    thUnit: t.units.itemsMin,
                    ltUnit: t.units.minutes,
                    window: `${METRICS_WINDOW}s`
                };
            case 'Minutes':
                return {
                    thUnit: t.units.itemsHr,
                    ltUnit: t.units.hours,
                    window: `${METRICS_WINDOW}m`
                };
            case 'Hours':
                return {
                    thUnit: t.units.itemsDay,
                    ltUnit: t.units.days,
                    window: `${METRICS_WINDOW}h`
                };
        }
    };

    const labels = getLabels();
    const lastAvg = t.metrics.lastAvg.replace('{0}', labels.window);

  return (
    <div className="flex flex-col sm:flex-row gap-6 flex-grow">
        <MetricDisplay
            label={t.metrics.wip}
            value={metrics.wip.toFixed(1)}
            description={lastAvg}
            color="bg-[#FE5000]" // Sociaal Oranje
        />
        <MetricDisplay
            label={t.metrics.throughput}
            value={metrics.throughput.toFixed(1)}
            description={`${labels.thUnit} (${lastAvg})`}
            color="bg-[#0093D0]" // Actief Blauw
        />
        <MetricDisplay
            label={t.metrics.leadTime}
            value={metrics.leadTime.toFixed(1)}
            description={`${labels.ltUnit} (${lastAvg})`}
            color="bg-[#D7C4E2]" // Kalm Paars
        />
    </div>
  );
};

export default MetricsPanel;