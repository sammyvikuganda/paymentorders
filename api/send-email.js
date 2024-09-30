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
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            width: 100%; /* Set body width to 100% */
            -webkit-text-size-adjust: 100%; /* Prevent font scaling in iOS */
        }
        .container {
            max-width: 600px; /* Maximum width */
            margin: 20px auto; /* Center the container */
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #4CAF50;
            text-align: left; /* Align left */
            margin: 0; /* Remove default margin */
        }
        p {
            font-size: 14px;
            color: #333;
            margin: 0; /* Remove default margin */
            padding: 5px 0; /* Added padding for spacing */
            text-align: left; /* Align left */
        }
        .order-summary {
            margin-top: 10px; /* Reduced margin */
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0; /* Reduced margin */
            font-size: 14px;
            color: #333;
        }
        .details-table thead {
            background-color: #4CAF50;
            color: #fff;
        }
        .details-table th, .details-table td {
            padding: 10px; /* Reduced padding */
            border: 1px solid #ddd;
            text-align: left;
        }
        .details-table th {
            font-weight: bold;
        }
        .details-table tbody tr {
            background-color: #f9f9f9;
        }
        .details-table tbody tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 10px; /* Reduced margin */
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

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr>
            <td align="center">
                <div class="container">
                    <h2>Order Confirmation</h2>

                    <p>Dear {{accountName}},</p>
                    <p>We have received your order. Below are the details:</p>

                    <div class="order-summary">
                        <table class="details-table">
                            <thead>
                                <tr>
                                    <th>Details</th>
                                    <th>Information</th>
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

                    <p>Thank you for your order! We will process it shortly.</p>

                    <div class="footer">
                        <p>This is an automated message. Please do not reply.</p>
                        <p><a href="#">Visit our website</a> | <a href="#">Contact Support</a></p>
                    </div>
                </div>
            </td>
        </tr>
    </table>

</body>
</html>

    `;
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
const PORT = process.env.PORT || 3000; // Use the port from environment or 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
