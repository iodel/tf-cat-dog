import { Response, NextFunction, Request } from "express";
import sharp from 'sharp';
import fs from 'fs';
import { LayersModel, Tensor } from "@tensorflow/tfjs";
import * as tf from '@tensorflow/tfjs-node';
const cv = require('opencv4nodejs');

const petController = {
    upload: (req: any, res: Response, next: NextFunction) => {

        const { path, filename, destination } = req.file;

        sharp(path).resize(150, 150).toFile(`${destination}/150-${filename}`, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                fs.unlink(path, err => { if (err) { throw err; } });
                res.status(201).json({
                    message: 'Image uploaded successfully!'
                });
            }
        });

    },
    predict: async (req: Request, res: Response, next: NextFunction) => {

        const { image } = req.params;

        const model: LayersModel = await tf.loadLayersModel('file://tf-model/model.json');

        fs.readdir('public/img/', async (err, files) => {
            if (err) throw err;

            const imageName = files[0];

            const mat = cv.imread(`public/img/${imageName}`);
            const mat2 = await mat.cvtColorAsync(cv.COLOR_BGR2RGB);
            const newImage: Tensor = tf.tensor3d(new Uint8Array(mat2.getData()), [150, 150, 3], 'int32').expandDims(0);

            const resultTensor = model.predict(newImage) as Tensor;
            const result = resultTensor.dataSync();

            console.log(result);

            const [dogProbability, catProbability] = Array.from(result).map(p => Math.round(10000 * p) / 100);

            setTimeout(() => {
                res.status(200).json({
                    image,
                    dog: dogProbability,
                    cat: catProbability
                });
            }, 2000);
        });
    }
};

export default petController;