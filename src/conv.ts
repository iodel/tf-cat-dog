import * as tf from '@tensorflow/tfjs-node';
import { Sequential, Tensor, History, Tensor3D } from '@tensorflow/tfjs-node';
import { Layer } from '@tensorflow/tfjs-layers/dist/exports_layers';

import fs from 'fs';

import cv from 'opencv4nodejs';

import { parameters, config, activations } from './parameters';

// 1000 dogs, 1000 cats, 1000 validation
// label: 1 Dog
// label: 0 Cat

// trains the model
const trainModel = async (model: Sequential, trainX: Tensor, trainY: Tensor) => {
    return model.fit(trainX, trainY, config.fit);
};

// image dimensions
const dimSize = 150,

    // tensor size
    catDogShape = [dimSize, dimSize, 3],

    // convolutional architecture
    convolutionLayers: Layer[] = [
        tf.layers.conv2d({
            name: 'firstConvLayer',
            filters: 32,
            kernelSize: parameters.conv.kernelSize,
            padding: parameters.padding,
            activation: parameters.convActivation,
            inputShape: catDogShape
        }),
        tf.layers.conv2d({
            name: 'secondConvLayer',
            filters: 64,
            kernelSize: parameters.conv.kernelSize,
            padding: parameters.padding,
            activation: parameters.conv.activation
        }),
        tf.layers.conv2d({
            name: 'thirdConvLayer',
            filters: 128,
            kernelSize: parameters.conv.kernelSize,
            padding: parameters.padding,
            activation: parameters.conv.activation
        }),
        tf.layers.conv2d({
            name: 'fourthConvLayer',
            filters: 128,
            kernelSize: parameters.conv.kernelSize,
            padding: parameters.padding,
            activation: parameters.conv.activation
        })
    ],

    // dropOut layer
    dropOutLayer: Layer = tf.layers.dropout({ rate: parameters.conv.dropOutProbability }),

    // flatten layer
    flattenLayer: Layer = tf.layers.flatten(),

    // dense and output layer
    denseLayers: Layer[] = [
        tf.layers.dense({
            units: 512,
            activation: activations.relu
        }),
        tf.layers.dense(config.output)
    ];

// create a sequential model
const model: Sequential = tf.sequential();

// get the number of convolutional layers
const convSize = convolutionLayers.length;

// add the convolutional and max pooling layers to the model
for (let i = 0; i < convSize; i++) {
    model.add(convolutionLayers[i]);
    model.add(tf.layers.maxPooling2d({
        name: `maxPooling2dLayer${i}`,
        poolSize: parameters.conv.grid,
        strides: parameters.conv.strides
    }));
}

// add a dropout layer to the model
model.add(dropOutLayer);

// add a flatten layer to the model
model.add(flattenLayer);

// add the dense layers to the model
for (const denseLayer of denseLayers) {
    model.add(denseLayer);
}

// compile the model
model.compile(config.compile);

let trainX: Tensor[] = [],
    // testX: Tensor,
    // testY: Tensor,
    trainY: number[] = [];

fs.readdir('train-set/Cat/', (err, files) => {
    if (err) {
        throw err;
    } else {
        files.forEach(async imageName => {
            const mat = await cv.imread(`train-set/Cat/${imageName}`).cvtColorAsync(cv.COLOR_BGR2RGB);
            const image: Tensor3D = tf.tensor3d(new Uint8Array(mat.getData()), [150, 150, 3], 'int32');
            trainX.push(image);
            trainY.push(0);
        });

        fs.readdir('train-set/Dog/', (err, files) => {
            if (err) {
                throw err;
            } else {
                files.forEach(async imageName => {
                    const mat = await cv.imread(`train-set/Dog/${imageName}`).cvtColorAsync(cv.COLOR_BGR2RGB);
                    const image: Tensor3D = tf.tensor3d(new Uint8Array(mat.getData()), [150, 150, 3], 'int32');
                    trainX.push(image);
                    trainY.push(1);
                });

                trainModel(model, tf.stack(trainX), tf.tensor(trainY, [trainY.length, 1])).then((history: any) => {
                    console.log('Model is trained!');
                    model.save('file://tf-model').then(savedResult => console.log);
                });
            }
        });
    }


});

// model.evaluate(testX, testY, {
//     steps: Math.ceil(testX.shape[0] / 32)
// });