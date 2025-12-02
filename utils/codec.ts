
import { StepParameters, TimeUnit } from '../types';
import { INITIAL_STEPS, STEP_COLORS, MIN_STEPS, MAX_STEPS } from '../constants';

// --- BitStream Helpers ---
// We use a simple string of '1's and '0's for conceptual simplicity and to avoid 32-bit integer overflow issues in JS.
// Performance is not a concern for this small amount of data.

class BitWriter {
    private bits: string = "";

    write(value: number, width: number) {
        let binary = value.toString(2);
        if (binary.length > width) {
            // Clamp value if it exceeds width (should not happen with correct logic)
            binary = binary.slice(-width); 
        }
        // Pad with leading zeros
        while (binary.length < width) {
            binary = "0" + binary;
        }
        this.bits += binary;
    }

    getData(): string {
        return this.bits;
    }
}

class BitReader {
    private bits: string;
    private pointer: number = 0;

    constructor(bits: string) {
        this.bits = bits;
    }

    read(width: number): number {
        if (this.pointer + width > this.bits.length) {
            throw new Error("Unexpected end of data");
        }
        const chunk = this.bits.substring(this.pointer, this.pointer + width);
        this.pointer += width;
        return parseInt(chunk, 2);
    }
    
    hasMore(): boolean {
        return this.pointer < this.bits.length;
    }
}

// Base64URL dictionary (URL safe)
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function binaryStringToBase64(binary: string): string {
    // Pad to multiple of 6
    while (binary.length % 6 !== 0) {
        binary += "0";
    }
    
    let result = "";
    for (let i = 0; i < binary.length; i += 6) {
        const segment = binary.substring(i, i + 6);
        const index = parseInt(segment, 2);
        result += CHARS[index];
    }
    return result;
}

function base64ToBinaryString(base64: string): string {
    let binary = "";
    for (let i = 0; i < base64.length; i++) {
        const char = base64[i];
        const index = CHARS.indexOf(char);
        if (index === -1) throw new Error("Invalid character");
        let segment = index.toString(2);
        while (segment.length < 6) segment = "0" + segment;
        binary += segment;
    }
    return binary;
}

// --- Scenario Logic ---

export interface ScenarioData {
    timeUnit: TimeUnit;
    steps: {
        cycleTime: number;
        setupTime: number;
        isSetupLocked: boolean;
        isCycleLocked: boolean;
    }[];
    globalBatchSize: number;
    globalBatchLocked: boolean;
}

// VERSION 1
// Header:
//  - Version: 2 bits (Value: 1)
//  - TimeUnit: 2 bits (00=Sec, 01=Min, 10=Hr)
//  - StepCount: 2 bits (Value = count - 2. Supports 2..5)
//  - BatchSize: 6 bits (0..63)
//  - BatchLock: 1 bit
// Body (Per Step):
//  - CycleTime: 5 bits (0..31)
//  - SetupTime: 7 bits (0..127)
//  - CycleLock: 1 bit
//  - SetupLock: 1 bit

export const generateScenarioCode = (steps: StepParameters[], timeUnit: TimeUnit): string => {
    const writer = new BitWriter();

    // 1. Version (Let's use 1)
    writer.write(1, 2);

    // 2. Time Unit
    const unitMap: Record<TimeUnit, number> = { 'Seconds': 0, 'Minutes': 1, 'Hours': 2 };
    writer.write(unitMap[timeUnit], 2);

    // 3. Step Count (offset by MIN_STEPS)
    // Clamp count to be safe
    const count = Math.min(Math.max(steps.length, MIN_STEPS), MAX_STEPS);
    writer.write(count - MIN_STEPS, 2);

    // 4. Global Batch Size (Take from first step, clamp to 63 max just in case)
    const batchSize = steps[0]?.batchSize || 10;
    writer.write(Math.min(batchSize, 63), 6);

    // 5. Global Batch Lock
    const batchLocked = steps[0]?.isBatchLocked ? 1 : 0;
    writer.write(batchLocked, 1);

    // 6. Per Step Data
    steps.forEach(step => {
        writer.write(Math.min(step.cycleTime, 31), 5); // Max 31
        writer.write(Math.min(step.setupTime, 127), 7); // Max 127
        writer.write(step.isCycleLocked ? 1 : 0, 1);
        writer.write(step.isSetupLocked ? 1 : 0, 1);
    });

    // 7. Checksum (Simple modulo 64 of all bits processed so far interpreted as numbers? 
    // Easier: Sum of the 6-bit chunks indices? Let's just do no checksum for brevity, 
    // or a very simple one. Let's rely on parsing validation.)
    
    return binaryStringToBase64(writer.getData());
};

export const parseScenarioCode = (code: string): ScenarioData | null => {
    try {
        // Basic cleanup
        const cleanCode = code.trim().replace(/\s/g, '');
        if (!cleanCode) return null;

        const binary = base64ToBinaryString(cleanCode);
        const reader = new BitReader(binary);

        // 1. Version
        const version = reader.read(2);
        if (version !== 1) return null; // Unknown version

        // 2. Time Unit
        const unitVal = reader.read(2);
        const timeUnits: TimeUnit[] = ['Seconds', 'Minutes', 'Hours'];
        if (unitVal > 2) return null;
        const timeUnit = timeUnits[unitVal];

        // 3. Step Count
        const countOffset = reader.read(2);
        const stepCount = countOffset + MIN_STEPS;

        // 4. Global Batch
        const globalBatchSize = reader.read(6);
        const globalBatchLocked = reader.read(1) === 1;

        // 5. Steps
        const stepsData = [];
        for (let i = 0; i < stepCount; i++) {
            const cycleTime = reader.read(5);
            const setupTime = reader.read(7);
            const isCycleLocked = reader.read(1) === 1;
            const isSetupLocked = reader.read(1) === 1;
            
            stepsData.push({
                cycleTime,
                setupTime,
                isCycleLocked,
                isSetupLocked
            });
        }

        return {
            timeUnit,
            globalBatchSize,
            globalBatchLocked,
            steps: stepsData
        };

    } catch (e) {
        // Silently fail on invalid codes during typing to prevent console spam
        return null;
    }
};
