const app = require('../../app');
const adminRouter = require('../../admin');
app.use('/admin', adminRouter);
module.exports = app;
