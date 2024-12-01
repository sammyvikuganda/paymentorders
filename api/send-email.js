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
const constructEmailHTML = (heading, paragraph, userEmail) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f3f3f3;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #101010;
            padding: 5px;
            text-align: center;
        }
        .header img {
            width: 40px;
            margin-bottom: 2px;
        }
        .header h1 {
            font-size: 14px;
            color: #ffffff;
            margin: 0;
            font-weight: bold;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            font-size: 18px;
            color: #101010;
            margin: 0 0 15px;
        }
        .content p {
            font-size: 14px;
            color: #333;
            margin: 10px 0;
            line-height: 1.5;
        }
        .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px 0;
            background-color: #1A7EB1;
            color: #fff;
            text-align: center;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
        .footer {
            padding: 10px 20px;
            font-size: 12px;
            color: #555;
        }
        .footer a {
            color: #f3ba2f;
            text-decoration: none;
        }
        .footer strong {
            display: block;
            margin-top: 15px;
            color: #101010;
        }
        .small-text {
            font-size: 10px;
            color: #888;
            text-align: left;
            margin-top: 20px;
            padding-left: 20px;
        }
        .copyright {
            text-align: center;
            font-size: 10px;
            color: #888;
            margin-top: 20px;
        }
        .line-above {
            border-top: 1px solid #ddd;
            margin: 0;
        }
        .line-below {
            border-bottom: 1px solid #ddd;
            margin: 0;
        }
        .disclaimer {
            font-size: 10px;
            color: #888;
            margin: 0;
            padding: 0;
            text-align: left;
            padding-left: 20px;
        }
        .disclaimer-header {
            font-size: 16px;
            font-weight: bold;
            color: #101010;
            text-align: center;
            margin: 15px 0;
        }
        .reduced-size {
            font-size: 12px;
        }
        .disclaimer a {
            color: #1A7EB1;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <img src="https://i.imgur.com/6e1pFka.png" alt="Custom Logo">
            <h1>NEXUS</h1>
        </div>

        <!-- Content Section -->
        <div class="content">
            <h2>${heading}</h2>
            <p>${paragraph}</p>
            <a href="mailto:supportonline@onmail.com" class="button">Contact Us</a>
            <p class="reduced-size">Don’t recognize this activity? Please reset your password and contact customer support immediately.</p>
        </div>

        <!-- Line Above Disclaimer Section -->
        <div class="line-above"></div>

        <!-- Disclaimer Header: Stay Safe -->
        <div class="disclaimer-header">
            <p>Stay Safe</p>
        </div>

        <!-- Disclaimer Text Section Below the Line -->
        <div class="disclaimer">
            <p>You have received this email as a registered user of Nexus.<br>For more information about how we process data, please see our <a href="https://nexus.com/privacy-policy">Privacy policy</a>.</p>
            <p>If you no longer wish to receive these notifications, please contact support at <a href="mailto:supportonline@onmail.com">supportonline@onmail.com</a>.</p>
            <p>Stay connected!</p>
        </div>

        <!-- Line Below Disclaimer Section -->
        <div class="line-below"></div>

        <!-- Automated Message and Copyright Text (Centered) -->
        <div class="copyright">
            <p>This is an automated message, please do not reply.</p>
            <p>© 2024 Nexus, All Rights Reserved.</p>
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

    const emailHTML = constructEmailHTML(heading, paragraph, userEmail);

    try {
        await transporter.sendMail({
            from: `Nexus Notifications <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject,
            html: emailHTML,
            headers: {
                'List-Unsubscribe': `<mailto:supportonline@onmail.com>, <https://nexus.com/unsubscribe?email=${userEmail}>`
            }
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
