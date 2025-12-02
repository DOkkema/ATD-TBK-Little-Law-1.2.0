
import React from 'react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, language }) => {
    if (!isOpen) return null;

    const t = TRANSLATIONS[language];

    // Mini UI components for visual explanation
    const MockStatus = ({ color, label }: { color: string, label: string }) => (
        <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full border-4 ${color} bg-white flex items-center justify-center shadow-sm`}></div>
            <span className="text-[10px] font-bold text-gray-600 uppercase">{label}</span>
        </div>
    );

    const MockSlider = ({ label, val }: { label: string, val: string }) => (
        <div className="w-full max-w-[120px] opacity-80">
            <div className="flex justify-between text-[10px] mb-0.5 text-gray-600 font-medium">
                <span>{label}</span>
                <span className="bg-gray-100 px-1 rounded">{val}</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#001489] w-2/3"></div>
            </div>
        </div>
    );

    const MockTabs = ({ t }: { t: any }) => (
        <div className="flex border-b border-gray-200 w-full">
             <div className="px-2 py-1 text-[10px] font-bold text-[#001489] border-b-2 border-[#001489]">{t.tabs.simulation}</div>
             <div className="px-2 py-1 text-[10px] font-bold text-gray-400">{t.tabs.analytics}</div>
        </div>
    );

    const MockCode = () => (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col gap-2 w-full max-w-[200px] shadow-sm">
            <div className="h-1.5 w-1/3 bg-gray-200 rounded mb-1"></div>
            <div className="flex gap-1">
                <div className="flex-1 bg-white border border-gray-300 h-6 rounded text-[10px] flex items-center px-2 text-gray-400 font-mono overflow-hidden whitespace-nowrap">
                    A8k-z9qL2mX...
                </div>
                <div className="w-6 h-6 bg-[#0093D0] rounded flex items-center justify-center">
                     <div className="w-2.5 h-2.5 border border-white rounded-[1px]"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-[#001489] p-4 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                        </svg>
                        {t.helpModal.title}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto space-y-8">
                    
                    {/* Goal Section */}
                    <section>
                        <h3 className="text-lg font-bold text-[#001489] mb-2">{t.helpModal.goalTitle}</h3>
                        <div className="text-gray-700 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: t.helpModal.goalDesc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Configuration Section */}
                    <section className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#001489] mb-2">{t.helpModal.section1Title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{t.helpModal.section1Desc}</p>
                            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-4">
                                <li dangerouslySetInnerHTML={{ __html: t.helpModal.paramBatch.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                <li dangerouslySetInnerHTML={{ __html: t.helpModal.paramSetup.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                <li dangerouslySetInnerHTML={{ __html: t.helpModal.paramCycle.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </ul>
                        </div>
                        {/* Visual Mockup */}
                        <div className="w-full sm:w-40 bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-col gap-2 flex-shrink-0">
                            <MockSlider label={t.stepParams.batchSize} val="10" />
                            <MockSlider label={t.stepParams.setupTime} val="20s" />
                            <MockSlider label={t.stepParams.cycleTime} val="2.0s" />
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Status Section */}
                    <section>
                        <h3 className="text-lg font-bold text-[#001489] mb-4">{t.helpModal.section2Title}</h3>
                        <div className="flex flex-wrap gap-6 mb-4 justify-center sm:justify-start bg-gray-50 p-4 rounded-xl">
                            <MockStatus color="border-gray-200" label={t.status.idle} />
                            <MockStatus color="border-[#FE5000]" label={t.status.setup} />
                            <MockStatus color="border-[#0093D0]" label={t.status.producing} />
                            <MockStatus color="border-[#C8102E]" label={t.status.blocked} />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{t.helpModal.section2Desc}</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                            <li dangerouslySetInnerHTML={{ __html: t.helpModal.statusIdle.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            <li dangerouslySetInnerHTML={{ __html: t.helpModal.statusSetup.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            <li dangerouslySetInnerHTML={{ __html: t.helpModal.statusProd.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            <li dangerouslySetInnerHTML={{ __html: t.helpModal.statusBlock.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </ul>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Metrics Section */}
                    <section>
                        <h3 className="text-lg font-bold text-[#001489] mb-4">{t.helpModal.section3Title}</h3>
                         <div className="flex gap-4 mb-4">
                            <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#FE5000] via-[#0093D0] to-[#D7C4E2]"></div>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700 list-disc pl-4">
                             <li dangerouslySetInnerHTML={{ __html: t.helpModal.metricWip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#FE5000]">$1</strong>') }} />
                             <li dangerouslySetInnerHTML={{ __html: t.helpModal.metricTh.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#0093D0]">$1</strong>') }} />
                             <li dangerouslySetInnerHTML={{ __html: t.helpModal.metricLt.replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-500">$1</strong>') }} />
                        </ul>
                    </section>

                    <hr className="border-gray-100" />

                     {/* Tabs Section */}
                     <section className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#001489] mb-2">{t.helpModal.section4Title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{t.helpModal.section4Desc}</p>
                            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-4">
                                <li dangerouslySetInnerHTML={{ __html: t.helpModal.tabSim.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                <li dangerouslySetInnerHTML={{ __html: t.helpModal.tabAnalytics.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </ul>
                        </div>
                         {/* Visual Mockup */}
                        <div className="w-full sm:w-40 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-2 flex-shrink-0 justify-center">
                            <MockTabs t={t} />
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Scenarios Section (NEW) */}
                    <section className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#001489] mb-2">{t.helpModal.section5Title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{t.helpModal.section5Desc}</p>
                            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-4">
                                <li dangerouslySetInnerHTML={{ __html: t.helpModal.scenarioStep1.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                <li dangerouslySetInnerHTML={{ __html: t.helpModal.scenarioStep2.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                <li dangerouslySetInnerHTML={{ __html: t.helpModal.scenarioStep3.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </ul>
                        </div>
                         {/* Visual Mockup */}
                        <div className="w-full sm:w-40 flex-shrink-0 flex justify-center pt-2">
                            <MockCode />
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse flex-shrink-0 border-t border-gray-100">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#001489] text-base font-medium text-white hover:bg-[#001075] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001489] sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onClose}
                    >
                        {t.settingsModal.done}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
