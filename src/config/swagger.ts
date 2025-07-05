import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const swaggerDocument = YAML.load(
  path.join(__dirname, "../../docs/openapi.yaml")
);

const options = {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Cursory API Documentation",
};

export const swaggerConfig = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocument, options),
};
