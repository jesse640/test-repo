const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');


const port = 3000;

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '/public/swagger.yaml'));


// const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

// // Swagger setup
// const swaggerSpec = swaggerJsdoc(swaggerDocument)

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
//     customCss:
//         '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
//     customCssUrl: CSS_URL,
// }
// ))


// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// Basic route to check API is working
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
