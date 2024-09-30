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
    <title>Nexus</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #ffffff; /* White background */
            margin: 0; /* Remove default margin */
            padding: 0; /* Remove default padding */
            width: 100%; /* Full width */
            -webkit-text-size-adjust: 100%; /* Prevent font scaling in iOS */
        }
        .container {
            max-width: 600px; /* Maximum width */
            width: 100%; /* Full width */
            margin: 0 auto; /* Center the container */
            padding: 0; /* Remove padding */
            background-color: #ffffff; /* White background */
            border-radius: 0; /* Remove border radius */
            box-shadow: none; /* Remove shadow */
            box-sizing: border-box; /* Include padding in total width */
        }
        h2 {
            color: #4CAF50;
            text-align: left; /* Align left */
            margin: 10px 0; /* Add space above and below */
            padding: 0 15px; /* Minimal padding */
        }
        .nexus-header {
            display: flex; /* Use flexbox for alignment */
            align-items: center; /* Center items vertically */
            padding: 0 15px; /* Minimal padding */
        }
        .nexus-icon {
            width: 24px; /* Adjust size */
            height: 24px; /* Adjust size */
            margin-right: 10px; /* Space between icon and text */
        }
        p {
            font-size: 14px; /* Standard font size */
            color: #333;
            margin: 5px 0; /* Reduced margins */
            padding: 0 15px; /* Minimal padding */
            text-align: left; /* Align left */
        }
        .small-text {
            font-size: 12px; /* Smaller font size for specific text */
        }
        .smaller-text {
            font-size: 12px; /* Same size for consistency */
        }
        .order-summary {
            margin: 10px 0; /* Reduced margin */
        }
        .details-table {
            width: 100%; /* Full width */
            border-collapse: collapse; /* Remove gaps between cells */
            margin: 10px 0; /* Reduced margin */
            font-size: 14px;
            color: #333;
        }
        .details-table thead {
            background-color: #4CAF50; /* Header background */
            color: #fff;
        }
        .details-table th, .details-table td {
            padding: 10px; /* Padding for cells */
            border: 1px solid #ddd; /* Light border */
            text-align: left;
        }
        .details-table th {
            font-weight: bold;
        }
        .details-table tbody tr {
            background-color: #ffffff; /* White background for rows */
        }
        .footer {
            text-align: left; /* Align left */
            font-size: 12px;
            color: #888;
            margin-top: 10px; /* Reduced margin */
            padding: 0; /* No padding */
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }
        /* Icons */
        .icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 10px;
            vertical-align: middle;
        }
        .icon-account-id {
            background-image: url('https://img.icons8.com/ios-filled/50/4caf50/identification-documents.png');
            background-size: contain;
        }
        .icon-account {
            background-image: url('https://img.icons8.com/ios-filled/50/4caf50/user.png');
            background-size: contain;
        }
        .icon-phone {
            background-image: url('https://img.icons8.com/ios-filled/50/4caf50/phone.png');
            background-size: contain;
        }
        .icon-wallet {
            background-image: url('https://img.icons8.com/ios-filled/50/4caf50/wallet.png');
            background-size: contain;
        }
        .icon-shopping-cart {
            background-image: url('https://img.icons8.com/ios-filled/50/4caf50/shopping-cart.png');
            background-size: contain;
        }
        .icon-money-bag {
            background-image: url('https://img.icons8.com/ios-filled/50/4caf50/money-bag.png');
            background-size: contain;
        }
        .icon-clock {
            background-image: url('https://img.icons8.com/ios-filled/50/4caf50/clock.png');
            background-size: contain;
        }
    </style>
</head>
<body>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; padding: 0; margin: 0;">
        <tr>
            <td align="center" style="padding: 0; margin: 0;">
                <div class="container">
                    <div class="nexus-header">
                        <img src="https://i.imgur.com/pXBkAwq.png" alt="Nexus Icon" class="nexus-icon"> 
                        <h2>Nexus</h2>
                    </div>

                    <p>Dear {{accountName}},</p>
                    <p>We have received your order. Below are the details:</p>

                    <div class="order-summary">
                        <table class="details-table">
                            <thead>
                                <tr>
                                    <th style="width: 50%;">Details</th>
                                    <th style="width: 50%;">Information</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="icon icon-account-id"></span>Account ID</td>
                                    <td>{{accountId}}</td>
                                </tr>
                                <tr>
                                    <td><span class="icon icon-account"></span>Account Name</td>
                                    <td>{{accountName}}</td>
                                </tr>
                                <tr>
                                    <td><span class="icon icon-phone"></span>Phone Number</td>
                                    <td>{{phoneNumber}}</td>
                                </tr>
                                <tr>
                                    <td><span class="icon icon-shopping-cart"></span>Order Type</td>
                                    <td>{{orderType}}</td>
                                </tr>
                                <tr>
                                    <td><span class="icon icon-money-bag"></span>Order Amount</td>
                                    <td>{{orderAmount}}</td>
                                </tr>
                                <tr>
                                    <td><span class="icon icon-wallet"></span>Account Balance</td>
                                    <td>{{accountBalance}}</td>
                                </tr>
                                <tr>
                                    <td><span class="icon icon-clock"></span>Time</td>
                                    <td>{{time}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p class="smaller-text">Thank you for using Nexus. Your order will be processed shortly.</p>
                    <p class="small-text">If you do not recognize this order, please contact our support team.</p>

                    <div class="footer">
                        <p class="small-text">This is an automated message. Please do not reply.</p>
                        <p style="text-align: center;"><a href="#">Visit our website</a> | <a href="#">Contact Support</a></p>
                    </div>
                </div>
            </td>
        </tr>
    </table>

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
