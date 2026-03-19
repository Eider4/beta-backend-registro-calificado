import express from "express";
import cors from "cors";
import registrosCalificadosRoute from "./routes/registrosCalificadosRoute.js";
import autoevaluacionesRouter from "./routes/autoevaluacionesRouter.js";
import resultadosEvaluacionesRouter from "./routes/resultadosEvaluacionesRouter.js";
const app = express();
const PORT = 1000;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hola mundo");
});
app.use("/api", registrosCalificadosRoute);
app.use("/api", autoevaluacionesRouter);
app.use("/api", resultadosEvaluacionesRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
