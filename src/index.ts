import express from "express";
import { swaggerConfig } from "./config/swagger";
import * as OpenApiValidator from "express-openapi-validator";
import path from "path";
import YAML from "yamljs";
import {
  errorHandler,
  notFoundHandler,
} from "./commons/error/error-middleware";
import { registerRoutes } from "./router";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiSpec = YAML.load(path.join(__dirname, "../docs/openapi.yaml"));
app.use("/docs", swaggerConfig.serve, swaggerConfig.setup);

app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: false,
  })
);

app.get("/", (_req, res) => {
  res.json({ message: "Cursory Backend is running" });
});

registerRoutes(app);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/docs`);
});
