import express from "express";
import { CrearAutoevaluacion } from "../controllers/autoevaluacionesController.js";
const router = express.Router();

router.post("/autoevaluaciones", CrearAutoevaluacion);

export default router;
