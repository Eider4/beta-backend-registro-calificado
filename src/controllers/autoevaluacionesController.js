import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import autoevaluaciones from "../db/autoevaluaciones.json" assert { type: "json" };
import resultadosEvaluaciones from "../db/resultadosEvaluaciones.json" assert { type: "json" };
import { esquemaAutoevalacion } from "../utils/EsquemaAutoevaluacion.js";

// Crear __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CrearAutoevaluacion = (req, res) => {
  try {
    const {
      id,
      fechaInicio,
      fechaFin,
      idRegistroCalificado,
      fechaRecordatorio,
      estado,
      calificacion,
    } = req.body;

    if (
      !fechaInicio ||
      !fechaFin ||
      !idRegistroCalificado ||
      !fechaRecordatorio ||
      !estado
    ) {
      return res.status(400).json({ message: "Faltan datos" });
    }
    const id_autoevaluacion = id || crypto.randomUUID();
    const nuevaAutoevaluacion = {
      id: id_autoevaluacion,
      fechaInicio,
      fechaFin,
      idRegistroCalificado,
      fechaRecordatorio,
      estado,
      calificacion,
    };
    autoevaluaciones.push(nuevaAutoevaluacion);
    resultadosEvaluaciones.push({
      id: crypto.randomUUID(),
      idAutoevaluacion: id_autoevaluacion,
      calificacion: 0,
      condiciones: esquemaAutoevalacion,
    });

    const filePath = path.join(__dirname, "../db/autoevaluaciones.json");
    fs.writeFileSync(filePath, JSON.stringify(autoevaluaciones, null, 2));

    const filePath2 = path.join(__dirname, "../db/resultadosEvaluaciones.json");
    fs.writeFileSync(
      filePath2,
      JSON.stringify(resultadosEvaluaciones, null, 2),
    );

    res.status(201).json({
      message: "Registro creado correctamente",
      data: nuevaAutoevaluacion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener las autoevaluaciones" });
  }
};
