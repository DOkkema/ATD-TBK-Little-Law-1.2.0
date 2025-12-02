
import React from 'react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface LittlesLawModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
}

const LittlesLawModal: React.FC<LittlesLawModalProps> = ({ isOpen, onClose, language }) => {
    if (!isOpen) return null;

    const t = TRANSLATIONS[language];
    const ll = t.littlesLaw;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="bg-[#001489] p-6 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.499 5.258 50.55 50.55 0 0 0-2.658.813m-15.482 0A50.55 50.55 0 0 1 12 13.489a50.55 50.55 0 0 1 6.482-1.206 48.62 48.62 0 0 1-6.482 6.525c-2.683 0-5.22-.68-7.5-1.896" />
                            </svg>
                            {ll.title}
                        </h2>
                        <p className="text-blue-200 text-sm mt-1">{ll.subtitle}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-gray-200 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 sm:p-8 space-y-8">
                    
                    {/* The Formula */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center gap-4 bg-gray-50 px-8 py-4 rounded-2xl border border-gray-200 shadow-inner">
                            <span className="text-4xl sm:text-6xl font-black text-[#FE5000]">L</span>
                            <span className="text-2xl text-gray-400">=</span>
                            <span className="text-4xl sm:text-6xl font-black text-[#0093D0]">λ</span>
                            <span className="text-2xl text-gray-400">×</span>
                            <span className="text-4xl sm:text-6xl font-black text-[#D7C4E2]">W</span>
                        </div>
                         <p className="text-gray-500 mt-2 font-mono text-sm">{ll.formula}</p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-3 bg-white text-lg font-bold text-[#001489]">{ll.analogyTitle}</span>
                        </div>
                    </div>
                    
                    <p className="text-center text-gray-600 max-w-lg mx-auto">{ll.analogyIntro}</p>

                    {/* The Visual Analogy Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        
                        {/* L (WIP) */}
                        <div className="bg-orange-50 border-2 border-[#FE5000]/20 rounded-xl p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-[#FE5000]">
                                {/* Icon: Stack of boxes / Inventory */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#FE5000] mb-1">{ll.lTitle}</h3>
                            <p className="text-xs font-bold uppercase tracking-wider text-orange-600/60 mb-3">{ll.lSubtitle}</p>
                            <p className="text-sm text-gray-700 leading-snug">{ll.lDesc}</p>
                        </div>

                        {/* Throughput */}
                        <div className="bg-sky-50 border-2 border-[#0093D0]/20 rounded-xl p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-[#0093D0]">
                                {/* Icon: Item moving out / Shipping */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#0093D0] mb-1">{ll.thTitle}</h3>
                            <p className="text-xs font-bold uppercase tracking-wider text-sky-600/60 mb-3">{ll.thSubtitle}</p>
                            <p className="text-sm text-gray-700 leading-snug">{ll.thDesc}</p>
                        </div>

                        {/* Lead Time */}
                        <div className="bg-purple-50 border-2 border-[#D7C4E2]/50 rounded-xl p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-[#9333ea]">
                                {/* Icon: Clock / Timer */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-purple-600 mb-1">{ll.wTitle}</h3>
                            <p className="text-xs font-bold uppercase tracking-wider text-purple-600/60 mb-3">{ll.wSubtitle}</p>
                            <p className="text-sm text-gray-700 leading-snug">{ll.wDesc}</p>
                        </div>
                    </div>

                    {/* Conclusion */}
                    <div className="bg-[#001489]/5 border border-[#001489]/20 rounded-xl p-6 text-center">
                        <h4 className="text-lg font-bold text-[#001489] mb-2">{ll.conclusionTitle}</h4>
                        <p className="text-gray-800 italic mb-4">"{ll.conclusionText}"</p>
                        <div className="inline-block bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm">
                            <code className="text-sm font-bold text-gray-900">{ll.math}</code>
                        </div>
                    </div>

                </div>
                
                <div className="bg-gray-50 p-4 flex justify-end border-t border-gray-100">
                    <button onClick={onClose} className="bg-[#001489] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#001075] transition-colors">
                        {t.settingsModal.done}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LittlesLawModal;