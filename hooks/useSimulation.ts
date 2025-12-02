
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { StepParameters, SimulationMetrics, MachineState, QueueState, Batch, MetricsHistoryEntry, TimeUnit, Language } from '../types';
import { INITIAL_STEPS, SIMULATION_SPEED, QUEUE_CAPACITY, METRICS_WINDOW, MIN_STEPS, MAX_STEPS, STEP_COLORS, ProductIcon } from '../constants';
import { TRANSLATIONS } from '../translations';
import { parseScenarioCode, ScenarioData } from '../utils/codec';
import React from 'react';

const initialMachineState: MachineState = {
    status: 'idle',
    progress: 0,
    currentBatch: null,
};

const initialQueueState: QueueState = {
    currentBatch: null,
};

export const useSimulation = (language: Language) => {
    const [steps, setSteps] = useState<StepParameters[]>(INITIAL_STEPS);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const [timeUnit, setTimeUnit] = useState<TimeUnit>('Seconds');
    
    // Initialize states based on initial steps
    const [machineStates, setMachineStates] = useState<MachineState[]>(
        Array(INITIAL_STEPS.length).fill(0).map(() => ({ ...initialMachineState }))
    );
    const [queueStates, setQueueStates] = useState<QueueState[]>(
        Array(INITIAL_STEPS.length - 1).fill(0).map(() => ({ ...initialQueueState }))
    );
    
    const [totalTime, setTotalTime] = useState(0);
    
    // Use refs for large history arrays to avoid stale closure issues and excessive re-renders
    const wipHistoryRef = useRef<{t: number, w: number}[]>([]);
    const completedBatchesRef = useRef<Batch[]>([]);
    
    const [nextBatchId, setNextBatchId] = useState(1);

    // Computed metrics state (exposed to UI)
    const [metrics, setMetrics] = useState<SimulationMetrics>({ wip: 0, throughput: 0, leadTime: 0 });
    
    // History for the Chart
    const [metricsHistory, setMetricsHistory] = useState<MetricsHistoryEntry[]>([]);

    // Auto-translate step names when language changes
    useEffect(() => {
        const t = TRANSLATIONS[language];
        setSteps(currentSteps => currentSteps.map(step => {
            let newName = step.name;
            
            // Regex to find "Stap/Step X:" prefix
            // Captures: 1=(Stap|Step), 2=Number, 3=Separator(:)
            const prefixRegex = /^(Stap|Step)\s+(\d+)(:?)/i;
            const match = step.name.match(prefixRegex);
            
            if (match) {
                const number = match[2];
                const separator = match[3] || ":";
                // Get the rest of the string (the custom or standard name)
                const rest = step.name.substring(match[0].length).trim();
                
                let translatedRest = rest;
                
                // Check if the name is a known standard name and translate it
                if (t.stepNameMapping && (t.stepNameMapping as any)[rest]) {
                    translatedRest = (t.stepNameMapping as any)[rest];
                }
                
                newName = `${t.stepPrefix} ${number}${separator} ${translatedRest}`;
            }
            
            if (newName !== step.name) {
                return { ...step, name: newName };
            }
            return step;
        }));
    }, [language]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Total simulated time to advance in this tick
            const totalSimTimeAdvance = (SIMULATION_SPEED / 1000) * speedMultiplier;
            
            // To ensure accuracy at high speeds (e.g. 128x), we sub-step the simulation.
            // A max step of 0.1s ensures we don't skip over short cycle times.
            const MAX_STEP = 0.1;
            const iterations = Math.ceil(totalSimTimeAdvance / MAX_STEP);
            const dt = totalSimTimeAdvance / iterations;

            // Clone state for mutation within the loop
            let currentMachineStates = JSON.parse(JSON.stringify(machineStates));
            let currentQueueStates = JSON.parse(JSON.stringify(queueStates));
            let currentNextBatchId = nextBatchId;
            let loopTime = totalTime;
            
            const tickFinishedBatches: Batch[] = [];
            const numSteps = steps.length;

            // --- SUB-STEP LOOP ---
            for (let iter = 0; iter < iterations; iter++) {
                loopTime += dt;

                // 1. Advance progress
                for (let i = 0; i < numSteps; i++) {
                    const machine = currentMachineStates[i];
                    const params = steps[i];
                    if (!machine || !params) continue;

                    if (machine.status === 'setup') {
                        machine.progress += dt / (params.setupTime || 1);
                    } else if (machine.status === 'producing' && machine.currentBatch) {
                        const duration = params.cycleTime * machine.currentBatch.size;
                        machine.progress += dt / (duration || 1);
                    }
                }

                // 2. State Transitions (Backwards / Pull logic)
                for (let i = numSteps - 1; i >= 0; i--) {
                    const machine = currentMachineStates[i];
                    if (!machine) continue;

                    if ((machine.status === 'setup' || machine.status === 'producing') && machine.progress >= 1) {
                        if (machine.status === 'setup') {
                            machine.status = 'producing';
                            machine.progress = 0;
                        } else { // Production finished
                            if (i === numSteps - 1) { // Last step
                                const finishedBatch = { ...machine.currentBatch, endTime: loopTime };
                                tickFinishedBatches.push(finishedBatch);
                                machine.currentBatch = null;
                                machine.status = 'idle';
                                machine.progress = 0;
                            } else { // Intermediate step
                                const nextQueue = currentQueueStates[i];
                                if (nextQueue && nextQueue.currentBatch === null) {
                                    nextQueue.currentBatch = machine.currentBatch;
                                    machine.currentBatch = null;
                                    machine.status = 'idle';
                                    machine.progress = 0;
                                } else {
                                    machine.status = 'blocked';
                                }
                            }
                        }
                    }
                }
                
                // 3. Start new work (Forwards / Push logic)
                for (let i = 0; i < numSteps; i++) {
                    const machine = currentMachineStates[i];
                    if (!machine) continue;
                    
                    // Try to unblock
                    if (machine.status === 'blocked') {
                        const nextQueue = currentQueueStates[i];
                        if (nextQueue && nextQueue.currentBatch === null) {
                             nextQueue.currentBatch = machine.currentBatch;
                             machine.currentBatch = null;
                             machine.status = 'idle';
                             machine.progress = 0;
                        }
                    }

                    // Try to start idle machine
                    if (machine.status === 'idle') {
                        if (i === 0) { // First machine
                            if (steps[0]) {
                                const newBatch: Batch = { id: currentNextBatchId, size: steps[0].batchSize, startTime: loopTime };
                                currentNextBatchId++;
                                machine.currentBatch = newBatch;
                                machine.status = 'setup';
                                machine.progress = 0;
                            }
                        } else { // Downstream machines
                            const prevQueue = currentQueueStates[i - 1];
                            if (prevQueue && prevQueue.currentBatch) {
                                machine.currentBatch = prevQueue.currentBatch;
                                prevQueue.currentBatch = null;
                                machine.status = 'setup';
                                machine.progress = 0;
                            }
                        }
                    }
                }
            }
            // --- END LOOP ---

            // Commit state updates
            setTotalTime(loopTime);
            setMachineStates(currentMachineStates);
            setQueueStates(currentQueueStates);
            setNextBatchId(currentNextBatchId);

            // Update finished batches ref
            if (tickFinishedBatches.length > 0) {
                completedBatchesRef.current.push(...tickFinishedBatches);
            }

            // --- Metrics Calculation ---
            // Calculate current WIP based on the state at the END of the tick
            const currentWipInMachines = currentMachineStates.reduce((sum: number, m: any) => sum + (m.currentBatch?.size || 0), 0);
            const currentWipInQueues = currentQueueStates.reduce((sum: number, q: any) => sum + (q.currentBatch?.size || 0), 0);
            const currentTotalWip = currentWipInMachines + currentWipInQueues;
            
            // Update WIP History Ref (Rolling Window)
            const cutoff = loopTime - METRICS_WINDOW;
            wipHistoryRef.current.push({ t: loopTime, w: currentTotalWip });
            
            // Prune old data
            while (wipHistoryRef.current.length > 0 && wipHistoryRef.current[0].t <= cutoff) {
                wipHistoryRef.current.shift();
            }
            while (completedBatchesRef.current.length > 0 && completedBatchesRef.current[0].endTime! <= cutoff) {
                completedBatchesRef.current.shift();
            }

            // Metrics Calculation (Same as before)
            const currentWipHistory = wipHistoryRef.current;
            const currentCompletedBatches = completedBatchesRef.current;
            const windowDuration = Math.min(loopTime, METRICS_WINDOW);
            
            // Avg WIP
            const avgWip = currentWipHistory.length > 0 
                ? currentWipHistory.reduce((sum, entry) => sum + entry.w, 0) / currentWipHistory.length 
                : 0;

            const conversionFactor = timeUnit === 'Hours' ? 24 : 60;
            const totalItemsCompleted = currentCompletedBatches.reduce((sum, batch) => sum + batch.size, 0);
            const windowDurationConverted = METRICS_WINDOW / conversionFactor; 
            const effectiveDurationConverted = loopTime < METRICS_WINDOW ? loopTime / conversionFactor : windowDurationConverted;
            
            const throughput = effectiveDurationConverted > 0 ? totalItemsCompleted / effectiveDurationConverted : 0;
            
            const totalLeadTimeRaw = currentCompletedBatches.reduce((sum, batch) => sum + (batch.endTime! - batch.startTime), 0);
            const avgLeadTimeConverted = currentCompletedBatches.length > 0 ? (totalLeadTimeRaw / currentCompletedBatches.length) / conversionFactor : 0;

            const currentMetrics = {
                wip: avgWip,
                throughput: throughput,
                leadTime: avgLeadTimeConverted,
            };
            
            setMetrics(currentMetrics);

            // Update Chart History
            if (Math.floor(loopTime) > Math.floor(totalTime)) {
                setMetricsHistory(prev => {
                    const newHistory = [...prev, { time: loopTime, ...currentMetrics }];
                    if (newHistory.length > 3600) {
                        return newHistory.slice(newHistory.length - 3600);
                    }
                    return newHistory;
                });
            }

        }, SIMULATION_SPEED);

        return () => clearInterval(intervalId);
    }, [steps, speedMultiplier, machineStates, queueStates, totalTime, nextBatchId, timeUnit]);

    const updateStepParameter = useCallback((stepIndex: number, param: keyof StepParameters, value: number) => {
        setSteps(currentSteps => {
            if (param === 'batchSize') {
                return currentSteps.map(p => ({ ...p, batchSize: value }));
            }
            return currentSteps.map((p, i) =>
                i === stepIndex ? { ...p, [param]: value } : p
            )
        });
    }, []);

    const toggleParameterLock = useCallback((stepIndex: number, param: 'batchSize' | 'setupTime' | 'cycleTime') => {
        setSteps(currentSteps => {
            if (param === 'batchSize') {
                const isLocked = !currentSteps[stepIndex].isBatchLocked;
                return currentSteps.map(p => ({ ...p, isBatchLocked: isLocked }));
            } else {
                return currentSteps.map((p, i) => {
                    if (i !== stepIndex) return p;
                    if (param === 'setupTime') return { ...p, isSetupLocked: !p.isSetupLocked };
                    if (param === 'cycleTime') return { ...p, isCycleLocked: !p.isCycleLocked };
                    return p;
                });
            }
        });
    }, []);

    const reset = useCallback(() => {
        setSteps(INITIAL_STEPS);
        setSpeedMultiplier(1);
        setMachineStates(Array(INITIAL_STEPS.length).fill(0).map(() => ({ ...initialMachineState })));
        setQueueStates(Array(INITIAL_STEPS.length - 1).fill(0).map(() => ({ ...initialQueueState })));
        setTotalTime(0);
        wipHistoryRef.current = [];
        completedBatchesRef.current = [];
        setMetricsHistory([]);
        setNextBatchId(1);
        setMetrics({ wip: 0, throughput: 0, leadTime: 0 });
    }, []);

    // NEW: Load Scenario function
    const loadScenario = useCallback((data: ScenarioData) => {
        // 1. Reset Sim state first
        setSpeedMultiplier(1);
        setTotalTime(0);
        wipHistoryRef.current = [];
        completedBatchesRef.current = [];
        setMetricsHistory([]);
        setNextBatchId(1);
        setMetrics({ wip: 0, throughput: 0, leadTime: 0 });
        
        // 2. Set Time Unit
        setTimeUnit(data.timeUnit);

        // 3. Reconstruct Steps
        const t = TRANSLATIONS[language];
        const newSteps: StepParameters[] = data.steps.map((s, index) => {
            const id = index + 1;
            // Get default name from initial steps if available, else generic
            // Or assume Standard naming like "Stap X: ..."
            
            // Try to find if there is a 'standard' name for this index in INITIAL_STEPS
            // But INITIAL_STEPS only has 4.
            // We'll use a generic name pattern which the auto-translator in useEffect will pick up and localize.
            
            let baseName = "...";
            // Map index to standard types if possible
            const standardTypes = ["Zagen", "Buigen", "Lassen", "Assembleren", "Verpakken"]; // Verpakken as generic 5th?
            if (index < standardTypes.length) {
                baseName = standardTypes[index];
            }

            return {
                id: id,
                name: `${t.stepPrefix} ${id}: ${baseName}`, // The useEffect will translate 'Step' and 'Zagen' etc
                color: STEP_COLORS[index % STEP_COLORS.length],
                icon: React.createElement(ProductIcon),
                cycleTime: s.cycleTime,
                setupTime: s.setupTime,
                batchSize: data.globalBatchSize,
                isBatchLocked: data.globalBatchLocked,
                isCycleLocked: s.isCycleLocked,
                isSetupLocked: s.isSetupLocked
            };
        });

        setSteps(newSteps);
        setMachineStates(Array(newSteps.length).fill(0).map(() => ({ ...initialMachineState })));
        setQueueStates(Array(newSteps.length - 1).fill(0).map(() => ({ ...initialQueueState })));

    }, [language]);

    const duplicateStepParameters = useCallback((sourceIndex: number) => {
        setSteps(currentSteps => {
            const sourceStep = currentSteps[sourceIndex];
            if (!sourceStep) return currentSteps;
            const { cycleTime, setupTime } = sourceStep;
            return currentSteps.map(p => ({ ...p, cycleTime, setupTime }));
        });
    }, []);

    const updateStepName = useCallback((stepIndex: number, newName: string) => {
        setSteps(currentSteps =>
            currentSteps.map((p, i) =>
                i === stepIndex ? { ...p, name: newName } : p
            )
        );
    }, []);

    const addStep = useCallback(() => {
        setSteps(currentSteps => {
            if (currentSteps.length >= MAX_STEPS) return currentSteps;
            
            const t = TRANSLATIONS[language];
            const lastStep = currentSteps[currentSteps.length - 1];
            const newId = currentSteps.length + 1;
            const color = STEP_COLORS[(newId - 1) % STEP_COLORS.length];
            
            const isBatchLocked = currentSteps[0]?.isBatchLocked ?? false;

            const newStep: StepParameters = {
                id: newId,
                name: `${t.stepPrefix} ${newId}: ...`,
                color: color,
                icon: React.createElement(ProductIcon),
                cycleTime: lastStep.cycleTime,
                batchSize: lastStep.batchSize,
                setupTime: lastStep.setupTime,
                isBatchLocked: isBatchLocked,
                isCycleLocked: false,
                isSetupLocked: false
            };
            
            return [...currentSteps, newStep];
        });

        setMachineStates(prev => [...prev, { ...initialMachineState }]);
        setQueueStates(prev => [...prev, { ...initialQueueState }]);
    }, [language]);

    const removeStep = useCallback(() => {
        setSteps(currentSteps => {
            if (currentSteps.length <= MIN_STEPS) return currentSteps;
            return currentSteps.slice(0, -1);
        });
        setMachineStates(prev => {
            if (prev.length <= MIN_STEPS - 1) return prev;
            return prev.slice(0, -1);
        });
        setQueueStates(prev => {
            if (prev.length <= MIN_STEPS - 1) return prev;
            return prev.slice(0, -1);
        });
    }, []);

    return { 
        steps, 
        metrics, 
        metricsHistory, 
        machineStates, 
        queueStates, 
        updateStepParameter, 
        toggleParameterLock,
        reset, 
        speedMultiplier, 
        updateSpeedMultiplier: setSpeedMultiplier, 
        duplicateStepParameters, 
        updateStepName, 
        timeUnit,
        setTimeUnit,
        addStep,
        removeStep,
        loadScenario // Exported
    };
};
