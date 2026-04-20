const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

function startServer(application, port) {
  application.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = { app, startServer };
