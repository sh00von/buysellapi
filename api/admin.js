const app = require('../app'); // Import the main app
const adminRouter = require('../admin'); // Import AdminJS router

// Apply the AdminJS router and export as the handler for Vercel
app.use(adminRouter);
module.exports = app;
