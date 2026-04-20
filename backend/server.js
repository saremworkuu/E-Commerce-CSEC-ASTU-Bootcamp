require('dotenv').config();

const { connectDatabase } = require('./src/config/db');
const { app, startServer } = require('./src/app');
const { PORT, MONGODB_URI } = require('./src/config/env');

async function bootstrap() {
  if (MONGODB_URI) {
    await connectDatabase(MONGODB_URI);
  }

  startServer(app, PORT);
}

bootstrap().catch((error) => {
  console.error('Failed to start backend server:', error);
  process.exit(1);
});
