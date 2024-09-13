const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')

// Import your models with unique names
const Hall = require('./models/Hall')
const Request = require('./models/Request')
const SingleToken = require('./models/SingleToken')
const Student = require('./models/Student')
const Transaction = require('./models/Transaction')

// Register the Mongoose adapter
AdminBro.registerAdapter(AdminBroMongoose)

// Create an AdminBro instance
const adminBro = new AdminBro({
  rootPath: '/admin',
  resources: [
    {
      resource: Hall,
      options: {
        // Add options for the Hall resource here if needed
      }
    },
    {
      resource: Request,
      options: {
        // Add options for the Request resource here if needed
      }
    },
    {
      resource: SingleToken,
      options: {
        // Add options for the SingleToken resource here if needed
      }
    },
    {
      resource: Student,
      options: {
        // Add options for the Student resource here if needed
      }
    },
    {
      resource: Transaction,
      options: {
        // Add options for the Transaction resource here if needed
      }
    }
  ],
})

// Build the AdminBro router
const adminRouter = AdminBroExpress.buildRouter(adminBro)

module.exports = adminRouter
