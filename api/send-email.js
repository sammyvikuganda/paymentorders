const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // Environment variables
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

// Gmail SMTP Setup
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Secure connection
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // App password (not regular Gmail password)
    }
});

// Email Template
const constructEmailHTML = (heading, paragraph) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: auto; padding: 20px; }
        .header { background: #007BFF; color: #fff; padding: 10px; text-align: center; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 0.8em; color: #666; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nexus</h1>
        </div>
        <div class="content">
            <h2>${heading}</h2>
            <p>${paragraph}</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
`;

// API Endpoint to Send Email
app.post('/api/send-email', async (req, res) => {
    const { userEmail, heading, paragraph, subject } = req.body;

    if (!userEmail || !heading || !paragraph || !subject) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const emailHTML = constructEmailHTML(heading, paragraph);

    try {
        await transporter.sendMail({
            from: `Nexus Notifications <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject,
            html: emailHTML
        });

        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
