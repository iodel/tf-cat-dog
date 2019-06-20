// import stuff
import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';

import fs from 'fs';
import path from 'path';

// import './conv';
import petRouter from './routes/pet';

// initialize an express app
const app: Application = express();

// use body parser middleware
app.use(bodyParser.json());

// declare supported mime types
const MIME_TYPE_MAP: any = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
};

// configure multer storage
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error: (Error | null) = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, 'public/img');
    },
    filename: (req: Request, file: Express.Multer.File, cb: any) => {

        // transform original name
        const name = file.originalname.toLowerCase().split(' ').join('-');

        // get the extension
        const ext = MIME_TYPE_MAP[file.mimetype];

        const directory = 'public/img';

        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });

        // set the final file name
        cb(null, `${name}-${Date.now()}.${ext}`);
    }
});


// allow CORS
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// add multer middleware
app.use(multer({ storage, limits: { fileSize: 10000000 } }).single('image'));

// use the pet router
app.use('/api/pet', petRouter);

// set the default port to 3000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running..."));