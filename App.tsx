
import React, { useState } from 'react';
import { useSimulation } from './hooks/useSimulation';
import MetricsPanel from './components/MetricsPanel';
import SimulationVisualizer from './components/SimulationVisualizer';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import LittlesLawModal from './components/LittlesLawModal';
import { TRANSLATIONS } from './translations';
import type { Language } from './types';
import { APP_VERSION } from './constants';

function App() {
  const [language, setLanguage] = useState<Language>('nl');
  // Pass language to hook so step names can be localized
  const { steps, metrics, metricsHistory, machineStates, queueStates, updateStepParameter, toggleParameterLock, reset, speedMultiplier, updateSpeedMultiplier, duplicateStepParameters, updateStepName, timeUnit, setTimeUnit, addStep, removeStep, loadScenario } = useSimulation(language);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLittlesLawOpen, setIsLittlesLawOpen] = useState(false);

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-[95%] text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#001489]">
          {t.appTitle}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {t.appSubtitle}
        </p>
      </header>

      <main className="w-full max-w-[95%] flex flex-col gap-8">
          <div className="flex flex-row gap-4 items-stretch">
            <MetricsPanel metrics={metrics} timeUnit={timeUnit} language={language} />
            
            <div className="flex flex-row gap-2">
                {/* Help Button */}
                <button 
                    onClick={() => setIsHelpOpen(true)}
                    className="bg-white border border-gray-200 shadow-lg rounded-2xl w-24 flex flex-col items-center justify-center text-gray-500 hover:text-[#0093D0] hover:border-[#0093D0] transition-colors gap-1 group"
                    title="Help"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase">Help</span>
                </button>

                {/* Little's Law Theory Button */}
                <button 
                    onClick={() => setIsLittlesLawOpen(true)}
                    className="bg-white border border-gray-200 shadow-lg rounded-2xl w-24 flex flex-col items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-600 transition-colors gap-1 group"
                    title="Little's Law Theory"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.499 5.258 50.55 50.55 0 0 0-2.658.813m-15.482 0A50.55 50.55 0 0 1 12 13.489a50.55 50.55 0 0 1 6.482-1.206 48.62 48.62 0 0 1-6.482 6.525c-2.683 0-5.22-.68-7.5-1.896" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase">Theorie</span>
                </button>

                {/* Settings Button */}
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="bg-white border border-gray-200 shadow-lg rounded-2xl w-24 flex flex-col items-center justify-center text-gray-500 hover:text-[#001489] hover:border-[#001489] transition-colors gap-1 group"
                    title={t.settings}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:animate-spin-slow">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.581-.495.644-.869l.214-1.281Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase">{t.settings}</span>
                </button>
            </div>
          </div>
          
          <SimulationVisualizer 
            steps={steps} 
            machineStates={machineStates}
            queueStates={queueStates}
            metricsHistory={metricsHistory}
            speedMultiplier={speedMultiplier}
            onSpeedChange={updateSpeedMultiplier}
            onParameterChange={updateStepParameter}
            onToggleLock={toggleParameterLock}
            onDuplicate={duplicateStepParameters}
            onReset={reset}
            onStepNameChange={updateStepName}
            timeUnit={timeUnit}
            language={language}
            onAddStep={addStep}
            onRemoveStep={removeStep}
          />
      </main>
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        timeUnit={timeUnit}
        setTimeUnit={setTimeUnit}
        language={language}
        setLanguage={setLanguage}
        onReset={reset}
        steps={steps}
        onLoadScenario={loadScenario}
      />
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        language={language}
      />
      <LittlesLawModal
        isOpen={isLittlesLawOpen}
        onClose={() => setIsLittlesLawOpen(false)}
        language={language}
      />
      <footer className="w-full max-w-[95%] text-center mt-8 text-gray-500 text-sm flex justify-center items-center gap-2">
        <p>{t.footer}</p>
        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">v{APP_VERSION}</span>
      </footer>
    </div>
  );
}

export default App;
