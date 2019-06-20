import { OutputConfig, CompileConfig, FitConfig } from "./models/config.model";
import { Logs } from "@tensorflow/tfjs";
import * as tf from '@tensorflow/tfjs-node';

export const LEARNING_RATES: number[] = [0.001, 0.01, 0.2],
    EPOCHS: number[] = [10, 100, 150, 200],
    LOSS_FUNCTIONS = {
        meanSquaredError: 'meanSquaredError',
        sparseCategoricalCrossEntropy: 'sparseCategoricalCrossentropy',
        categoricalCrossEntropy: 'categoricalCrossentropy',
        binaryCrossEntropy: 'binaryCrossEntropy'
    },
    PADDINGS = {
        same: 'same',
        valid: 'valid',
        causal: 'causal'
    },
    activations: { [key: string]: any } = {
        relu: 'relu',
        sigmoid: 'sigmoid',
        softmax: 'softmax'
    };

export const parameters: any = {
    outputAF: activations.softmax,
    learningRate: LEARNING_RATES[0],
    optimizer: null,
    loss: LOSS_FUNCTIONS.sparseCategoricalCrossEntropy,
    epochs: EPOCHS[0],
    batchSize: 32,
    conv: {
        kernelSize: 3,
        activation: activations.relu,
        padding: PADDINGS.same,
        strides: 2,
        grid: 2,
        dropOutProbability: 0.5
    }
};

const optimizers = {
    adam: tf.train.adam(parameters.learningRate),
    sgd: tf.train.sgd(parameters.learningRate)
};

parameters.optimizer = optimizers.adam;
parameters.optimizer = optimizers.sgd;

export const config: { output: OutputConfig, compile: CompileConfig, fit: FitConfig } = {
    output: {
        units: 2,
        activation: parameters.outputAF
    },
    compile: {
        optimizer: parameters.optimizer,
        loss: parameters.loss,
        metrics: ['accuracy']
    },
    fit: {
        epochs: parameters.epochs,
        batchSize: parameters.batchSize,
        shuffle: true,
        callbacks: {
            onEpochEnd: async (epoch: number, log: Logs) => {
                console.log(`Epoch: ${epoch}, Loss: ${log.loss}`);
            }
        },
        validationSplit: 0.1
    }
};