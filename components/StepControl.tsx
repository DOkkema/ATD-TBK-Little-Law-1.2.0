
import React from 'react';
import type { StepParameters, TimeUnit, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface StepControlProps {
  step: StepParameters;
  onParameterChange: (param: keyof StepParameters, value: number) => void;
  onToggleLock: (param: 'batchSize' | 'setupTime' | 'cycleTime') => void;
  onDuplicate: () => void;
  timeUnit: TimeUnit;
  language?: Language;
}

const SliderInput: React.FC<{
    label: string, 
    value: number, 
    min: number, 
    max: number, 
    step: number, 
    unit: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    isLocked?: boolean,
    onToggleLock: () => void
}> = ({label, value, min, max, step, unit, onChange, isLocked, onToggleLock}) => (
    <div className={`flex flex-col gap-1 ${isLocked ? 'opacity-60' : ''} transition-opacity`}>
        <div className="flex justify-between items-center text-sm mb-1">
            <label className="font-medium text-gray-700 truncate">{label}</label>
            <div className={`flex items-center justify-end w-[60px] bg-gray-100 px-1 py-0.5 rounded border border-transparent ${!isLocked && 'focus-within:border-[#001489] focus-within:bg-white'} transition-colors flex-shrink-0 ml-1`}>
                <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={onChange}
                    disabled={isLocked}
                    className="flex-1 min-w-0 bg-transparent text-right font-mono font-bold text-[#001489] outline-none p-0 text-xs appearance-none m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] disabled:text-gray-500 disabled:cursor-not-allowed"
                />
                <span className="ml-1 text-[10px] font-bold text-[#001489] disabled:text-gray-500 truncate">{unit}</span>
            </div>
        </div>
        <div className="flex items-center gap-2 w-full">
            <button 
                onClick={onToggleLock}
                className="text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0"
                title={isLocked ? "Unlock parameter" : "Lock parameter"}
            >
                {isLocked ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#001489]">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                    </svg>
                )}
            </button>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                disabled={isLocked}
                className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#001489] disabled:cursor-not-allowed disabled:accent-gray-400"
            />
        </div>
    </div>
);


const StepControl: React.FC<StepControlProps> = ({ step, onParameterChange, onToggleLock, onDuplicate, timeUnit, language = 'nl' }) => {
  const t = TRANSLATIONS[language];
  
  const getUnitLabel = (type: 'cycle' | 'setup') => {
      switch (timeUnit) {
          case 'Seconds': return type === 'cycle' ? t.units.secItem : t.units.sec;
          case 'Minutes': return type === 'cycle' ? t.units.minItem : t.units.min;
          case 'Hours': return type === 'cycle' ? t.units.hrItem : t.units.hr;
      }
  };

  // Helper to safely parse input, handle empty strings, and clamp to max
  const handleInputChange = (param: keyof StepParameters, valStr: string, min: number, max: number, isFloat: boolean = false) => {
      if (valStr === '') {
          onParameterChange(param, min); // Default to min if empty
          return;
      }
      let val = isFloat ? parseFloat(valStr) : parseInt(valStr, 10);
      
      if (isNaN(val)) val = min;
      if (val > max) val = max;
      // We allow values < min momentarily while typing (e.g. deleting digits), 
      // but the slider logic usually clamps it visually. 
      // For strictness:
      if (val < min) val = min;

      onParameterChange(param, val);
  };

  return (
    <div className={`p-2 rounded-xl border-l-4 ${step.color} bg-white shadow-sm border-y border-r border-gray-200 flex flex-col gap-3`}>
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
                <h3 className="text-sm font-bold text-black whitespace-nowrap truncate">{step.name.split(':')[0]}</h3>
            </div>
            <button
                onClick={onDuplicate}
                className="px-2 py-1 text-xs font-medium text-white bg-[#0093D0] rounded-md hover:bg-[#007BB0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0093D0] transition-colors flex-shrink-0"
                title={t.controls.copyTooltip}
            >
                {t.controls.copy}
            </button>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
        <SliderInput
            label={t.stepParams.batchSize}
            value={step.batchSize}
            min={1}
            max={50}
            step={1}
            unit={t.units.items}
            onChange={(e) => handleInputChange('batchSize', e.target.value, 1, 50)}
            isLocked={step.isBatchLocked}
            onToggleLock={() => onToggleLock('batchSize')}
        />
        <SliderInput
            label={t.stepParams.setupTime}
            value={step.setupTime}
            min={0}
            max={120}
            step={1}
            unit={getUnitLabel('setup')}
            onChange={(e) => handleInputChange('setupTime', e.target.value, 0, 120)}
            isLocked={step.isSetupLocked}
            onToggleLock={() => onToggleLock('setupTime')}
        />
        <SliderInput
            label={t.stepParams.cycleTime}
            value={step.cycleTime}
            min={0}
            max={30}
            step={1}
            unit={getUnitLabel('cycle')}
            onChange={(e) => handleInputChange('cycleTime', e.target.value, 0, 30, true)}
            isLocked={step.isCycleLocked}
            onToggleLock={() => onToggleLock('cycleTime')}
        />
      </div>
    </div>
  );
};

export default StepControl;
