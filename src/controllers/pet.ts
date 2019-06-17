import { Response, NextFunction, Request } from "express";

const petController = {
    upload: (req: any, res: Response, next: NextFunction) => {
        const imageName = req.body.imageName;

        res.status(201).json({
            message: 'Image uploaded successfully!',
            name: imageName
        });
    },
    predict: (req: Request, res: Response, next: NextFunction) => {

        const { image } = req.params,
            random = Math.random(),
            isDog: boolean = random > 0.5,
            probability = Math.round(100 * Math.max(random, 1 - random)) / 100;

        setTimeout(() => {
            res.status(200).json({
                dog: isDog,
                cat: !isDog,
                probability
            });
        }, 2000);

    }
};

export default petController;