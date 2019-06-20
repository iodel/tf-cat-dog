import { Optimizer, CustomCallback } from "@tensorflow/tfjs";

export interface OutputConfig {
    units: number;
    activation: string | any;
};

export interface CompileConfig {
    optimizer: Optimizer;
    loss: string;
    activation?: any;
    metrics: string[];
};

export interface FitConfig {
    batchSize: number,
    epochs: number,
    callbacks: { onEpochEnd: any },
    shuffle: boolean,
    validationSplit: number
};