
import React from 'react';
// FIX: Replaced non-existent type `ProductParameters` with `StepParameters` to resolve the import error.
import type { StepParameters } from '../types';

interface ProductControlProps {
  product: StepParameters;
  onParameterChange: (param: keyof StepParameters, value: number) => void;
  onDuplicate: () => void;
}

const SliderInput: React.FC<{label: string, value: number, min: number, max: number, step: number, unit: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = 
    ({label, value, min, max, step, unit, onChange}) => (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm">
            <label className="font-medium text-gray-300">{label}</label>
            <span className="text-cyan-300 font-mono bg-gray-700/50 px-2 py-0.5 rounded">
                {step < 1 ? value.toFixed(1) : value.toFixed(0)} {unit}
            </span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-500"
        />
    </div>
);


const ProductControl: React.FC<ProductControlProps> = ({ product, onParameterChange, onDuplicate }) => {
  return (
    <div className={`p-4 rounded-xl border-2 ${product.color} bg-gray-900/30 flex flex-col gap-4`}>
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-gray-700/50 ${product.color.replace('border', 'text')}`}>
                    {product.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{product.name}</h3>
            </div>
            <button
                onClick={onDuplicate}
                className="px-3 py-1 text-xs font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors"
                title="Copy these parameters to all other products"
            >
                Duplicate
            </button>
        </div>
      <div className="flex flex-col gap-4">
        <SliderInput
            label="Cycle Time (T_c)"
            value={product.cycleTime}
            min={1}
            max={10}
            step={1}
            unit="sec"
            onChange={(e) => onParameterChange('cycleTime', parseInt(e.target.value, 10))}
        />
        <SliderInput
            label="Batch Size (B)"
            value={product.batchSize}
            min={1}
            max={50}
            step={1}
            unit="items"
            onChange={(e) => onParameterChange('batchSize', parseInt(e.target.value))}
        />
        <SliderInput
            label="Setup Time (T_s)"
            value={product.setupTime}
            min={0}
            max={120}
            step={1}
            unit="sec"
            onChange={(e) => onParameterChange('setupTime', parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default ProductControl;