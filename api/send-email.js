const nodemailer = require('nodemailer');
const cors = require('cors'); // Import CORS
require('dotenv').config(); // Load environment variables from .env
const express = require('express'); // Import Express
const app = express(); // Create an Express app

app.use(cors()); // Use CORS middleware
app.use(express.json()); // Middleware to parse JSON body

// Create a transporter using your email service provider's settings
const transporter = nodemailer.createTransport({
    service: 'gmail', // Using Gmail as the email service
    auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS  // Your app password from .env
    }
});

// Function to send email
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,    // Sender address
        to,                               // Recipient address
        subject,                          // Subject line
        text                              // Plain text body
    };

    return transporter.sendMail(mailOptions);
};

app.post('/api/send-email', async (req, res) => {
    const recipientEmail = 'okiapeter50@gmail.com'; // Replace with the actual recipient email
    
    // Extract order details from the request body
    const { accountId, accountName, orderType, orderAmount, accountBalance, phoneNumber } = req.body;
    const time = new Date().toLocaleString('en-US', { timeZone: 'Africa/Kampala' }); // Get the current time in Uganda

    // Construct the email message
    const emailMessage = `Account ID: ${accountId}\n` +
                         `Account Name: ${accountName}\n` +
                         `Phone Number: ${phoneNumber}\n` +
                         `Order Type: ${orderType}\n` +
                         `Order Amount: ${orderAmount}\n` +
                         `Account Balance: ${accountBalance}\n` +
                         `Time: ${time}`;

    try {
        await sendEmail(recipientEmail, 'New Order Received', emailMessage);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000; // Use the port from environment or 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
