import express from "express";
import {
  CreateRegistroCalificado,
  GetRegistrosCalificados,
  GetRegistrosCalificadosById,
} from "../controllers/registrosCalificadosController.js";

const router = express.Router();

router.post("/registros-calificados", CreateRegistroCalificado);
router.get("/registros-calificados", GetRegistrosCalificados);
router.get("/registros-calificados/:id", GetRegistrosCalificadosById);

export default router;
