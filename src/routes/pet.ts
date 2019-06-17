import express, { Router, Response, Request, NextFunction } from "express";
import petController from '../controllers/pet';

const petRouter: Router = express.Router();

petRouter.post("/upload", petController.upload);

petRouter.get("/predict/:image", petController.predict);

export default petRouter;
