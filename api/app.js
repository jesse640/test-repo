const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs')

const app = express();


// Swagger setup
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


// Basic route to check API is working
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});


app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
