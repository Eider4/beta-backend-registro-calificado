import express from "express";
import {
  GetByIdResultado,
  getResultadoByCorreoAndPassword,
  updateCalificacion,
  updateResultadoEvidencia,
  //   vaciarRegistro,
} from "../controllers/resultadosEvaluacionController.js";
const router = express.Router();

router.get("/resultados/:id", GetByIdResultado);
// router.post("/resultados", CreateResultado);
router.put("/resultados/:id/evidencia", updateResultadoEvidencia);
router.post("/resultados/login", getResultadoByCorreoAndPassword);
router.post("/resultados/calificacion", updateCalificacion);

export default router;
