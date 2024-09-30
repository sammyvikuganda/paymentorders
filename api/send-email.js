const nodemailer = require('nodemailer');
const cors = require('cors'); 
require('dotenv').config();
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

// Create a transporter using Gmail settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send email
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    return transporter.sendMail(mailOptions);
};

app.post('/api/send-email', async (req, res) => {
    const adminEmail = 'okiapeter50@gmail.com'; // Admin email

    // Extract order details and user email from the request body
    const { accountId, accountName, orderType, orderAmount, accountBalance, phoneNumber, userEmail } = req.body;
    const time = new Date().toLocaleString('en-US', { timeZone: 'Africa/Kampala' });

    // Construct the email message
    const emailMessage = `Account ID: ${accountId}\n` +
                         `Account Name: ${accountName}\n` +
                         `Phone Number: ${phoneNumber}\n` +
                         `Order Type: ${orderType}\n` +
                         `Order Amount: ${orderAmount}\n` +
                         `Account Balance: ${accountBalance}\n` +
                         `Time: ${time}`;

    try {
        // Send email to admin
        await sendEmail(adminEmail, 'New Order Received', emailMessage);

        // Send email to the user
        await sendEmail(userEmail, 'Order Confirmation', `Dear ${accountName},\n\nYour order has been received.\n\n${emailMessage}`);

        res.status(200).json({ success: true, message: 'Emails sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send emails.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
