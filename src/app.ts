// import stuff
import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import multer from "multer";

import petRouter from "./routes/pet";

// initialize an express app
const app: Application = express();

// use body parser middleware
app.use(bodyParser.json());

const MIME_TYPE_MAP: any = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error: (Error | null) = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, 'uploadedImages');
    },
    filename: (req: Request, file: Express.Multer.File, cb: any) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');

        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, `${name}-${Date.now()}.${ext}`);
    }
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(multer({ storage, limits: { fileSize: 10000000 } }).single('image'));

app.use('/api/pet', petRouter);

// set the default port to 3000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running..."));
