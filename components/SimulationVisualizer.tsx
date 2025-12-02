
import React, { useState } from 'react';
import type { StepParameters, MachineState, QueueState, MachineStatus, MetricsHistoryEntry, TimeUnit, Language } from '../types';
import StepControl from './StepControl';
import ChartsPanel from './ChartsPanel';
import { TRANSLATIONS } from '../translations';
import { MIN_STEPS, MAX_STEPS } from '../constants';

interface SimulationVisualizerProps {
  steps: StepParameters[];
  machineStates: MachineState[];
  queueStates: QueueState[];
  metricsHistory: MetricsHistoryEntry[];
  speedMultiplier: number;
  onSpeedChange: (speed: number) => void;
  onParameterChange: (stepIndex: number, param: keyof StepParameters, value: number) => void;
  onToggleLock: (stepIndex: number, param: 'batchSize' | 'setupTime' | 'cycleTime') => void;
  onReset: () => void;
  onDuplicate: (stepIndex: number) => void;
  onStepNameChange: (stepIndex: number, newName: string) => void;
  timeUnit: TimeUnit;
  language: Language;
  onAddStep: () => void;
  onRemoveStep: () => void;
}

// Palette Mapping:
// Idle: Gray (Neutral)
// Setup: Sociaal Oranje (#FE5000)
// Producing: Actief Blauw (#0093D0)
// Blocked: Avans Rood (#C8102E)

const getStatusConfig = (t: any) => ({
    idle: { label: t.status.idle, color: 'bg-gray-100 border-gray-300', progressColor: 'bg-gray-300', textColor: 'text-gray-500' },
    setup: { label: t.status.setup, color: 'bg-[#FE5000] border-[#FE5000]', progressColor: 'bg-[#FE5000]', textColor: 'text-white' },
    producing: { label: t.status.producing, color: 'bg-[#0093D0] border-[#0093D0]', progressColor: 'bg-[#0093D0]', textColor: 'text-white' },
    blocked: { label: t.status.blocked, color: 'bg-[#C8102E] border-[#C8102E]', progressColor: 'bg-[#C8102E]', textColor: 'text-white' },
});

const getStepTextColor = (stepColor: string) => {
    // If the color is the light gray border (#E5E7EB), use a darker gray for text/icons to ensure visibility
    if (stepColor.includes('#E5E7EB')) return 'text-gray-500';
    return stepColor.replace('border', 'text');
};

const Item: React.FC<{step: StepParameters, isGhost?: boolean}> = ({step, isGhost}) => (
    <div title="Product Item" className={`flex-shrink-0 w-4 h-4 rounded ${isGhost ? 'opacity-30' : ''} ${getStepTextColor(step.color)} bg-gray-100 border border-current`}>
       {React.cloneElement(step.icon, {className: `w-full h-full p-0.5`})}
    </div>
);

const MachineDisplay: React.FC<{
    step: StepParameters;
    state: MachineState;
    onNameChange: (newName: string) => void;
    t: any;
}> = ({ step, state, onNameChange, t }) => {
    const config = getStatusConfig(t)[state.status];
    const batch = state.currentBatch;
    const [isEditing, setIsEditing] = React.useState(false);
    const [editableName, setEditableName] = React.useState(step.name);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);
    
    React.useEffect(() => {
        if(!isEditing) {
            setEditableName(step.name);
        }
    }, [step.name, isEditing]);


    const handleSave = () => {
        if (editableName.trim()) {
            onNameChange(editableName.trim());
        } else {
            setEditableName(step.name); // Revert if empty
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditableName(step.name);
            setIsEditing(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-2 items-center">
             <div 
                className="group relative h-6 w-full flex items-center justify-center"
                onClick={() => !isEditing && setIsEditing(true)}
             >
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editableName}
                        onChange={(e) => setEditableName(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="w-full text-center bg-white border border-[#001489] text-black text-sm font-medium rounded-md p-0.5 -m-0.5 outline-none focus:ring-2 focus:ring-[#001489]"
                    />
                ) : (
                    <>
                        <h3 className="text-sm font-bold text-[#001489] whitespace-nowrap cursor-pointer px-4 hover:bg-gray-100 rounded transition-colors">{step.name}</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                           <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                    </>
                )}
            </div>
            <div className={`w-16 h-16 flex items-center justify-center rounded-full border-4 ${state.status === 'idle' ? 'border-gray-200 bg-white' : `${config.color} text-white`} transition-colors shadow-sm`}>
                <div className={`${state.status !== 'idle' && state.status !== 'blocked' ? 'animate-pulse' : ''} ${state.status === 'idle' ? getStepTextColor(step.color) : 'text-white'}`}>
                    {React.cloneElement(step.icon, {className: "w-8 h-8"})}
                </div>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${state.status === 'idle' ? 'bg-white border-gray-200 text-gray-500' : `${config.color} text-white`}`}>
                {config.label}
            </span>
             <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                <div
                    className={`${config.progressColor} h-2 rounded-full transition-all duration-100 ease-linear`}
                    style={{ width: `${(state.progress > 1 ? 1 : state.progress) * 100}%` }}
                ></div>
            </div>
            <div className="w-full bg-gray-50 border border-gray-200 p-1 rounded-lg mt-1 min-h-[52px] flex flex-wrap gap-1 items-center content-start">
                {batch && Array.from({ length: batch.size }).map((_, i) => <Item key={i} step={step} />)}
            </div>
        </div>
    );
};

const QueueDisplay: React.FC<{step: StepParameters, state: QueueState}> = ({step, state}) => {
    const batch = state.currentBatch;
    return (
        <div className="flex flex-col items-center gap-2 pt-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
            <div className="w-24 bg-gray-50 border border-gray-200 p-1 rounded-lg min-h-[52px] flex flex-wrap gap-1 items-center content-start shadow-inner">
                {batch && Array.from({ length: batch.size }).map((_, i) => <Item key={i} step={step} />)}
            </div>
        </div>
    );
};


const SimulationVisualizer: React.FC<SimulationVisualizerProps> = ({ 
    steps, 
    machineStates, 
    queueStates, 
    metricsHistory,
    speedMultiplier, 
    onSpeedChange,
    onParameterChange,
    onToggleLock,
    onDuplicate,
    onReset,
    onStepNameChange,
    timeUnit,
    language,
    onAddStep,
    onRemoveStep
}) => {
    const [activeTab, setActiveTab] = useState<'simulation' | 'analytics'>('simulation');
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const t = TRANSLATIONS[language];

    const speedMapping = [0.5, 1, 2, 4, 8, 16, 32, 64, 128];
    const currentSpeedIndex = speedMapping.indexOf(speedMultiplier);

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const index = parseInt(e.target.value, 10);
        if (speedMapping[index]) {
            onSpeedChange(speedMapping[index]);
        }
    };

    const handleResetClick = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        onReset();
        setShowResetConfirm(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 h-full flex flex-col gap-4 relative">
             <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
                <div className="flex items-center gap-4 border-b border-gray-200">
                    <div className="flex">
                        <button 
                            className={`pb-2 px-3 text-lg font-bold transition-colors ${activeTab === 'simulation' ? 'text-[#001489] border-b-2 border-[#001489]' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('simulation')}
                        >
                            {t.tabs.simulation}
                        </button>
                        <button 
                            className={`pb-2 px-3 text-lg font-bold transition-colors ${activeTab === 'analytics' ? 'text-[#001489] border-b-2 border-[#001489]' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('analytics')}
                        >
                            {t.tabs.analytics}
                        </button>
                    </div>
                    
                    {/* Step Controls */}
                    {activeTab === 'simulation' && (
                        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200 ml-2">
                             <button 
                                onClick={onRemoveStep} 
                                disabled={steps.length <= MIN_STEPS}
                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 font-bold text-xl leading-none transition-colors"
                                title={t.controls.removeStep}
                             >
                                -
                             </button>
                             <span className="text-xs font-bold text-gray-500 px-1 min-w-[60px] text-center">
                                {steps.length} {t.controls.steps}
                             </span>
                             <button 
                                onClick={onAddStep} 
                                disabled={steps.length >= MAX_STEPS}
                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-[#001489] font-bold text-xl leading-none transition-colors"
                                title={t.controls.addStep}
                             >
                                +
                             </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 flex-wrap justify-end">
                    <button
                        onClick={handleResetClick}
                        className="px-4 py-2 text-sm font-bold text-white bg-[#C8102E] rounded-lg hover:bg-[#A60D25] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8102E] transition-colors shadow-sm"
                    >
                        {t.controls.reset}
                    </button>
                    <div className="flex flex-col gap-2 w-full w-52">
                        <div className="flex justify-between items-center text-sm">
                            <label htmlFor="speed-slider" className="font-bold text-gray-700">{t.controls.speed}</label>
                            <span className="text-[#001489] font-mono bg-gray-100 px-2 py-0.5 rounded font-bold">
                                {speedMultiplier}x
                            </span>
                        </div>
                        <input
                            id="speed-slider"
                            type="range"
                            min="0"
                            max={speedMapping.length - 1}
                            step="1"
                            value={currentSpeedIndex > -1 ? currentSpeedIndex : 1}
                            onChange={handleSpeedChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#001489]"
                        />
                    </div>
                </div>
            </div>
            
            {activeTab === 'simulation' ? (
                <div className="flex items-start justify-center gap-2 overflow-x-auto pt-4 pb-4 -mx-6 px-6">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col gap-2 w-48 flex-shrink-0">
                                <MachineDisplay 
                                    step={step} 
                                    state={machineStates[index] || { status: 'idle', progress: 0, currentBatch: null }}
                                    onNameChange={(newName) => onStepNameChange(index, newName)}
                                    t={t}
                                />
                                <StepControl
                                    step={step}
                                    onParameterChange={(param, value) => onParameterChange(index, param, value)}
                                    onToggleLock={(param) => onToggleLock(index, param)}
                                    onDuplicate={() => onDuplicate(index)}
                                    timeUnit={timeUnit}
                                    language={language}
                                />
                            </div>
                            {index < steps.length - 1 && (
                                <QueueDisplay step={step} state={queueStates[index] || { currentBatch: null }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                <div className="py-4">
                    <ChartsPanel data={metricsHistory} timeUnit={timeUnit} language={language} />
                </div>
            )}

            {/* Reset Confirmation Overlay */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowResetConfirm(false)}>
                    <div className="bg-white border-2 border-[#C8102E] rounded-xl shadow-2xl p-6 max-w-sm text-center" onClick={e => e.stopPropagation()}>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#C8102E" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                            </div>
                        <h3 className="text-lg font-bold text-[#C8102E] mb-2">{t.resetConfirmation.title}</h3>
                        <p className="text-gray-700 text-sm mb-6">
                            {t.resetConfirmation.message}
                        </p>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={confirmReset}
                                className="w-full px-4 py-2 bg-[#C8102E] text-white font-bold rounded-lg hover:bg-[#A60D25] transition-colors"
                            >
                                {t.resetConfirmation.confirm}
                            </button>
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {t.resetConfirmation.cancel}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulationVisualizer;