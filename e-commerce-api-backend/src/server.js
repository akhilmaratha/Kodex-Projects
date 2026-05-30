const dotenv = require('dotenv');
dotenv.config();

const { connectDatabase } = require('./config/db');
const app = require('./app');

const port = process.env.PORT || 5000;

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Server failed to start', error);
  process.exit(1);
});