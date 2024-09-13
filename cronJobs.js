const cron = require('node-cron');
const MultipleToken = require('./models/MultipleToken');
const SingleToken = require('./models/SingleToken');

// Function to update expired multiple tokens
async function updateExpiredMultipleTokens() {
  try {
    await MultipleToken.updateExpiredTokens();
    console.log('Expired multiple tokens updated successfully.');
  } catch (err) {
    console.error('Error updating expired multiple tokens:', err);
  }
}

// Function to update expired single tokens
async function updateExpiredSingleTokens() {
  try {
    await SingleToken.updateExpiredTokens();
    console.log('Expired single tokens updated successfully.');
  } catch (err) {
    console.error('Error updating expired single tokens:', err);
  }
}

// Schedule the tasks
cron.schedule('0 * * * *', updateExpiredMultipleTokens); // Every hour
cron.schedule('0 * * * *', updateExpiredSingleTokens); // Every hour
