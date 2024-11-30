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

// Function to send email with HTML content
const sendEmail = (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,    // Sender address
        to,                               // Recipient address
        subject,                          // Subject line
        html: htmlContent                 // HTML body
    };

    return transporter.sendMail(mailOptions);
};

// Define a function to construct the HTML email template
const constructEmailHTML = (accountId, accountName, phoneNumber, orderType, orderAmount, accountBalance, time) => {
    let htmlContent = `
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
            margin: 0; /* Remove default margin */
            padding: 0; /* Remove default padding */
        }
        .container {
            max-width: 600px;
            margin: 0 auto; /* Ensure the content is centered */
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #101010;
            padding: 5px; /* Further reduced padding for smaller header */
            text-align: center;
        }
        .header img {
            width: 40px; /* Smaller logo */
            margin-bottom: 2px; /* Minimal space between image and text */
        }
        .header h1 {
            font-size: 14px; /* Smaller font size for compact text */
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
            background-color: #1A7EB1; /* Button color changed */
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
            text-align: left; /* Align text to the left */
            margin-top: 20px;
            padding-left: 20px; /* Padding to ensure it aligns well */
        }
        .copyright {
            text-align: center;
            font-size: 10px;
            color: #888;
            margin-top: 20px;
        }
        .line-above {
            border-top: 1px solid #ddd;
            margin: 0; /* Removed margin after the line */
        }
        .line-below {
            border-bottom: 1px solid #ddd;
            margin: 0; /* No margin to ensure tightness */
        }
        .disclaimer {
            font-size: 10px;
            color: #888;
            margin: 0; /* Ensures no margin around this section */
            padding: 0; /* No padding around this section */
            text-align: left; /* Align text to the left */
            padding-left: 20px; /* Align text to the left with some padding */
        }
        .disclaimer-header {
            font-size: 16px;
            font-weight: bold;
            color: #101010;
            text-align: center;
            margin: 15px 0;
        }
        .reduced-size {
            font-size: 12px; /* Reduced font size */
        }
        /* Remove underline and set color of Privacy policy link */
        .disclaimer a {
            color: #1A7EB1; /* Set color to match button */
            text-decoration: none; /* Remove underline */
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
            <a href="#" class="button">Contact Us</a>
            <!-- Reduced font size for this paragraph -->
            <p class="reduced-size">Don’t recognize this activity? Please reset your password and contact customer support immediately.</p>
        </div>

        <!-- Line Above Disclaimer Section -->
        <div class="line-above"></div> <!-- Horizontal line above the disclaimer text -->

        <!-- Disclaimer Header: Stay Safe -->
        <div class="disclaimer-header">
            <p>Stay Safe</p>
        </div>

        <!-- Disclaimer Text Section Below the Line -->
        <div class="disclaimer">
            <p>You have received this email as a registered user of Nexus.<br>For more information about how we process data, please see our <a href="#">Privacy policy</a>.</p>
            <p>This is an automated message, please do not reply.</p>
            <p>Stay connected!</p>
        </div>

        <!-- Line Below Disclaimer Section -->
        <div class="line-below"></div> <!-- Horizontal line below the disclaimer text -->

        <!-- Copyright Text (Centered) -->
        <div class="copyright">
            <p>© 2024 Nexus, All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
    
    // Replace placeholders with actual values
    htmlContent = htmlContent
        .replace(/{{accountId}}/g, accountId)
        .replace(/{{accountName}}/g, accountName)
        .replace(/{{phoneNumber}}/g, phoneNumber)
        .replace(/{{orderType}}/g, orderType)
        .replace(/{{orderAmount}}/g, orderAmount)
        .replace(/{{accountBalance}}/g, accountBalance)
        .replace(/{{time}}/g, time);
    
    return htmlContent;
};

// Endpoint to handle sending the email
app.post('/api/send-email', async (req, res) => {
    const adminEmail = 'okiapeter50@gmail.com'; // Email for the admin or default recipient

    // Extract order details from the request body, including user email
    const { accountId, accountName, orderType, orderAmount, accountBalance, phoneNumber, userEmail } = req.body;
    const time = new Date().toLocaleString('en-US', { timeZone: 'Africa/Kampala' }); // Get the current time in Uganda

    // Construct the HTML email content
    const emailHTML = constructEmailHTML(accountId, accountName, phoneNumber, orderType, orderAmount, accountBalance, time);

    try {
        // Send email to admin
        await sendEmail(adminEmail, 'New Order Received', emailHTML);

        // If the user provided an email, send them an email as well
        if (userEmail) {
            await sendEmail(userEmail, 'Order Confirmation', emailHTML);
        }

        res.status(200).json({ success: true, message: 'Emails sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});


// Start the server
const PORT = process.env.PORT || 5000; // Use the specified port or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
