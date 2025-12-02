
import React from 'react';
import type { StepParameters, TimeUnit, Language } from '../types';
import StepControl from './StepControl';

interface ControlsPanelProps {
  steps: StepParameters[];
  onParameterChange: (stepIndex: number, param: keyof StepParameters, value: number) => void;
  onReset: () => void;
  onDuplicate: (stepIndex: number) => void;
  timeUnit: TimeUnit;
  language?: Language;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({ steps, onParameterChange, onReset, onDuplicate, timeUnit, language }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col gap-6 h-full border border-gray-700">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">Process Parameters</h2>
            <button
                onClick={onReset}
                className="px-4 py-2 text-sm font-medium text-white bg-fuchsia-600 rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-fuchsia-500 transition-colors"
            >
                Reset All
            </button>
        </div>
        <div className="flex flex-col gap-4">
            {steps.map((step, index) => (
                <StepControl
                key={step.id}
                step={step}
                onParameterChange={(param, value) => onParameterChange(index, param, value)}
                onDuplicate={() => onDuplicate(index)}
                timeUnit={timeUnit}
                language={language}
                />
            ))}
        </div>
    </div>
  );
};

export default ControlsPanel;