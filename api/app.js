const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const serveStatic = require('serve-static'); // ✅ Ensure static files are served


const port = 3000;

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));


// Serve Swagger UI
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', serveStatic(path.join(__dirname, 'node_modules/swagger-ui-dist')));



// Basic route to check API is working
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});


// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

module.exports = app;
