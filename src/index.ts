import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { swaggerConfig } from "./config/swagger";
import { serverConfig, corsConfig } from "./config/environment";
import * as OpenApiValidator from "express-openapi-validator";
import path from "path";
import YAML from "yamljs";
import {
  errorHandler,
  notFoundHandler,
} from "./commons/error/error-middleware";
import { registerRoutes } from "./router";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

app.listen(serverConfig.port, () => {
  console.log(`Server running on port ${serverConfig.port}`);
  console.log(`API Documentation: http://localhost:${serverConfig.port}/docs`);
});
