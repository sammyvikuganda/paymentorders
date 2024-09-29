const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env

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

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const recipientEmail = 'okiapeter50@gmail.com'; // Replace with the actual recipient email
        
        // Extract order details from the request body
        const { accountId, accountName, orderType, orderAmount, accountBalance } = req.body;
        const time = new Date().toLocaleString(); // Get the current time

        // Construct the email message
        const emailMessage = `Account ID: ${accountId}\n` +
                             `Account Name: ${accountName}\n` +
                             `Order Type: ${orderType}\n` +
                             `Order Amount: ${orderAmount}\n` +
                             `Account Balance: ${accountBalance}\n` +
                             `Time: ${time}`;

        try {
            await sendEmail(recipientEmail, 'New Order Received', emailMessage);
            res.status(200).send('Message received and email sent!');
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Failed to send email.');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
