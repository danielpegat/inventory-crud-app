/**
 * Server Entry Point
 * Loads environment variables, initializes the database connection,
 * and starts the Express server.
 */
require('dotenv').config();

const app = require('./src/app');

// The database connection is established when db.js is first required
// (which happens inside the models). This require ensures it connects on startup.
require('./src/config/db');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Fluid Architect API Server`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
