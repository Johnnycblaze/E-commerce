const { MailtrapClient } = require("mailtrap");
require("dotenv").config();

// Initialize the Mailtrap client properly
const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
  // If using Mailtrap Sandbox/Test Inbox, uncomment these lines:
  // sandbox: true,
  // testInboxId: Number(process.env.MAILTRAP_INBOX_ID),
});

const sender = {
  email: "mailtrap@demomailtrap.co", // Make sure this is a verified sender domain if using Production
  name: "E-comm App",
};

module.exports = { client, sender };