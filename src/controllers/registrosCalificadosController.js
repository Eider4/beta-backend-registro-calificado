import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import registrosCalificados from "../db/registrosCalificados.json" assert { type: "json" };
import autoevaluaciones from "../db/autoevaluaciones.json" assert { type: "json" };

// Crear __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CreateRegistroCalificado = (req, res) => {
  try {
    const { nombre, fechaInicio, fechaFin, estado, centro } = req.body;

    // Validar campos
    if (!nombre || !fechaInicio || !fechaFin || !estado || !centro) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const nuevoRegistro = {
      id: crypto.randomUUID(),
      nombre,
      fechaInicio,
      fechaFin,
      estado,
      centro,
    };

    registrosCalificados.push(nuevoRegistro);

    const filePath = path.join(__dirname, "../db/registrosCalificados.json");

    fs.writeFileSync(filePath, JSON.stringify(registrosCalificados, null, 2));

    res.status(201).json({
      message: "Registro creado correctamente",
      data: nuevoRegistro,
    });
  } catch (error) {
    console.log(error); // 👈 importante para debug
    res.status(500).json({ message: "Error al crear el registro calificado" });
  }
};

export const GetRegistrosCalificados = (req, res) => {
  try {
    res.status(200).json({ data: registrosCalificados });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al obtener los registros calificados" });
  }
};

export const GetRegistrosCalificadosById = (req, res) => {
  try {
    const { id } = req.params;
    const registro = registrosCalificados.find((r) => r.id === id);
    if (!registro)
      return res.status(404).json({ message: "Registro no encontrado" });
    //bucar las autoevaluaciones relacionadas a este registro
    const autoevaluacionesRelacionadas = autoevaluaciones.filter(
      (a) => a.idRegistroCalificado === id,
    );
    const data = {
      ...registro,
      autoevaluaciones: autoevaluacionesRelacionadas,
    };
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al obtener el registro calificado" });
  }
};
