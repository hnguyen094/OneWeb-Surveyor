// Header/Declarations

export interface RotData {
    x: number;
    y: number;
    z: number;
}

export type SensorDelay = "normal" | "game" | "ui" | "fastest";
export interface RotOptions {
    sensorDelay?: SensorDelay;
}

export function startRotUpdates(callback: (RotData) => void, options?: RotOptions);
export function stopRotUpdates();
