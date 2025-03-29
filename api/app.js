const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');


const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Read Swagger JSON
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/swagger.json'), 'utf8'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  req.swaggerDoc = swaggerDocument;
  return swaggerUi.setup(swaggerDocument)(req, res, next);
});

// Serve raw JSON
app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
