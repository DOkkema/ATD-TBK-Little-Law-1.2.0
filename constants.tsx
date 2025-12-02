
import { StepParameters } from './types';
import React from 'react';

export const APP_VERSION = '1.2.0';

// FIX: Added className prop to allow overriding styles. This resolves errors when using React.cloneElement.
export const ProductIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
);

export const MIN_STEPS = 2;
export const MAX_STEPS = 5;

export const STEP_COLORS = [
    'border-[#0093D0]', // Actief Blauw
    'border-[#FE5000]', // Sociaal Oranje
    'border-[#EF3340]', // Helder Rood
    'border-[#001489]', // Slim Donker Blauw
    'border-[#E5E7EB]', // Neutraal Grijs (Matcht border-gray-200 van UI)
    'border-[#D7C4E2]', // Kalm Paars
];

export const INITIAL_STEPS: StepParameters[] = [
  { id: 1, name: 'Stap 1: Zagen',   color: STEP_COLORS[0],    icon: <ProductIcon />, cycleTime: 1.0,   batchSize: 10, setupTime: 20, isBatchLocked: false, isCycleLocked: false, isSetupLocked: false },
  { id: 2, name: 'Stap 2: Buigen',   color: STEP_COLORS[1], icon: <ProductIcon />, cycleTime: 2.0,   batchSize: 10, setupTime: 20, isBatchLocked: false, isCycleLocked: false, isSetupLocked: false },
  { id: 3, name: 'Stap 3: Lassen', color: STEP_COLORS[2],   icon: <ProductIcon />, cycleTime: 3.0, batchSize: 10, setupTime: 20, isBatchLocked: false, isCycleLocked: false, isSetupLocked: false },
  { id: 4, name: 'Stap 4: Assembleren',  color: STEP_COLORS[3],   icon: <ProductIcon />, cycleTime: 4.0,   batchSize: 10, setupTime: 20, isBatchLocked: false, isCycleLocked: false, isSetupLocked: false },
];

export const SIMULATION_SPEED = 50; // Interval in ms
export const QUEUE_CAPACITY = 1; // Each queue can hold one batch
export const METRICS_WINDOW = 1200; // Rolling window in seconds for metrics calculation