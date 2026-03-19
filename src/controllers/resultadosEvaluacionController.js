import fs from "fs";
import path from "path";
import resultadosEvaluaciones from "../db/resultadosEvaluaciones.json" assert { type: "json" };
import autoevaluaciones from "../db/autoevaluaciones.json" assert { type: "json" };
import registrosCalificados from "../db/registrosCalificados.json" assert { type: "json" };

export const GetByIdResultado = (req, res) => {
  try {
    const { id } = req.params;
    const resultado = resultadosEvaluaciones.find(
      (r) => r.idAutoevaluacion === id,
    );

    if (!resultado) {
      return res.status(404).json({ message: "Resultado no encontrado" });
    }

    res.status(200).json({ data: resultado });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el resultado" });
  }
};
export const updateResultadoEvidencia = (req, res) => {
  try {
    const idResultado = req.params.id;
    const data = req.body;
    console.log("Data recibida:", data);
    const resultadoIndex = resultadosEvaluaciones.findIndex(
      (r) => r.id === idResultado,
    );
    if (resultadoIndex === -1) throw new Error("Resultado no encontrado");

    const condicionIndex = resultadosEvaluaciones[
      resultadoIndex
    ].condiciones.findIndex((c) => c.id === data.condicionId);

    if (condicionIndex === -1) throw new Error("Condición no encontrada");

    const evidenciaIndex = resultadosEvaluaciones[resultadoIndex].condiciones[
      condicionIndex
    ].evidencias.findIndex((e) => e.id === data.evidenciaId);
    if (evidenciaIndex === -1) throw new Error("Evidencia no encontrada");
    console.log(data.newRol);
    if (data.newRol && data.newRol.id) {
      const actorIndex = resultadosEvaluaciones[resultadoIndex].condiciones[
        condicionIndex
      ].evidencias[evidenciaIndex].actores.findIndex(
        (a) => a.id === data.newRol.id,
      );
      resultadosEvaluaciones[resultadoIndex].condiciones[
        condicionIndex
      ].evidencias[evidenciaIndex].actores[actorIndex].usuarios.push(
        data.newRol.usuarios[0],
      );
    } else if (data.eliminarRolId) {
      const actorIndex = resultadosEvaluaciones[resultadoIndex].condiciones[
        condicionIndex
      ].evidencias[evidenciaIndex].actores.findIndex(
        (a) => a.id === data.eliminarRolId,
      );
      console.log("Actor a eliminar:", actorIndex);
      if (actorIndex !== -1) {
        resultadosEvaluaciones[resultadoIndex].condiciones[
          condicionIndex
        ].evidencias[evidenciaIndex].actores.splice(actorIndex, 1);
      }
    } else {
      // Agregar el nuevo actor
      resultadosEvaluaciones[resultadoIndex].condiciones[
        condicionIndex
      ].evidencias[evidenciaIndex].actores.push(data.newRol);
    }
    // Guardar los cambios en el JSON
    const filePath = path.join(
      process.cwd(),
      "src",
      "db",
      "resultadosEvaluaciones.json",
    );
    fs.writeFileSync(filePath, JSON.stringify(resultadosEvaluaciones, null, 2));

    res.status(200).json({ message: "Evidencia actualizada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al actualizar el resultado",
      error: error.message,
    });
  }
};
export const getResultadoByCorreoAndPassword = (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const eventos = [];

    resultadosEvaluaciones.forEach((result) => {
      result.condiciones.forEach((condicion) => {
        condicion.evidencias.forEach((evidencia) => {
          // Filtramos actores nulos
          (evidencia.actores || []).forEach((actor) => {
            if (!actor) return; // saltar null
            (actor.usuarios || []).forEach((usuario) => {
              if (
                usuario.correo === correo &&
                usuario.contrasena === contrasena &&
                usuario.calificacion <= 0
              ) {
                let resp = autoevaluaciones.find(
                  (e) => e.id == result.idAutoevaluacion,
                );
                let resgistroCalificado = registrosCalificados.find(
                  (e) => e.id == resp.idRegistroCalificado,
                );
                if (!resp) resp = null;
                eventos.push({
                  autoevaluacion: {
                    id: resp.id,
                    fechaInicio: resp.fechaInicio,
                    fechaFin: resp.fechaFin,
                    estado: resp.estado, // -1 No esta disponible, 0 en proceso 1 finalizado
                  },
                  idCondicion: { id: condicion.id, nombre: condicion.nombre },
                  idRol: actor.id,
                  evidencia: {
                    id: evidencia.id,
                    url: evidencia.url,
                    descripcion: evidencia.descripcion,
                    nombre: evidencia.nombre,
                  },
                  correo: correo,
                  registroCalificado: {
                    id: resgistroCalificado.id,
                    nombre: resgistroCalificado.nombre,
                    centro: resgistroCalificado.centro,
                    estado: resgistroCalificado.estado,
                    fechaInicio: resgistroCalificado.fechaInicio,
                    fechaFin: resgistroCalificado.fechaFin,
                  },
                  calificacion: null,
                });
              }
            });
          });
        });
      });
    });

    console.log("Eventos encontrados:", eventos);
    res.json(eventos); // devolvemos al cliente
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el resultado" });
  }
};
export const updateCalificacion = (req, res) => {
  try {
    const data = req.body;
    console.log("Data recibida:", data);
    console.log("0");
    const autoEvaluacionIndex = resultadosEvaluaciones.findIndex(
      (a) => a.idAutoevaluacion === data.autoevaluacionId,
    );
    console.log("1");
    console.log(" autoEvaluacionIndex: ", autoEvaluacionIndex);
    console.log(" condicionId: ", data.condicionId);

    const condicionIndex = resultadosEvaluaciones[
      autoEvaluacionIndex
    ].condiciones.findIndex((c) => c.id === data.condicionId);

    console.log("2");
    const evidenciaIndex = resultadosEvaluaciones[
      autoEvaluacionIndex
    ].condiciones[condicionIndex].evidencias.findIndex(
      (e) => e.id === data.evidenciaId,
    );
    console.log("3");
    const rolIndex = resultadosEvaluaciones[autoEvaluacionIndex].condiciones[
      condicionIndex
    ].evidencias[evidenciaIndex].actores.findIndex((a) => a.id === data.rolId);
    console.log("4");
    const usuarioIndex = resultadosEvaluaciones[
      autoEvaluacionIndex
    ].condiciones[condicionIndex].evidencias[evidenciaIndex].actores[
      rolIndex
    ].usuarios.findIndex((u) => {
      console.log(u.correo);
      console.log(data.correo);
      return u.correo == data.correo;
    });
    console.log("5");

    console.log(usuarioIndex);
    console.log("6");

    resultadosEvaluaciones[autoEvaluacionIndex].condiciones[
      condicionIndex
    ].evidencias[evidenciaIndex].actores[rolIndex].usuarios[
      usuarioIndex
    ].fechaCalificacion = data.fecha;

    resultadosEvaluaciones[autoEvaluacionIndex].condiciones[
      condicionIndex
    ].evidencias[evidenciaIndex].actores[rolIndex].usuarios[
      usuarioIndex
    ].calificacion = data.valor;

    // Guardar los cambios en el JSON
    const filePath = path.join(
      process.cwd(),
      "src",
      "db",
      "resultadosEvaluaciones.json",
    );
    fs.writeFileSync(filePath, JSON.stringify(resultadosEvaluaciones, null, 2));

    res.status(200).json({ message: "Calificacion actualizada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al actualizar el resultado",
      error: error.message,
    });
  }
};
