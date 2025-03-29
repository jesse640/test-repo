const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const port = 3000;

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve raw Swagger JSON (for debugging)
app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

// Basic route to check API is working
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});


// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

module.exports = app;
