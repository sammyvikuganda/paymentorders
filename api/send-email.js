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
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #4CAF50;
                text-align: center;
            }
            p {
                font-size: 14px;
                color: #333;
            }
            .order-summary {
                margin-top: 20px;
            }
            .details-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                font-size: 14px;
                color: #333;
            }
            .details-table thead {
                background-color: #4CAF50;
                color: #fff;
            }
            .details-table th, .details-table td {
                padding: 12px 15px;
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
            .details-table tbody tr:hover {
                background-color: #f1f1f1;
            }
            .details-table td {
                vertical-align: middle;
            }
            .icon {
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-right: 10px;
                vertical-align: middle;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #888;
                margin-top: 20px;
            }
            .footer p {
                margin: 5px 0;
            }
            .footer a {
                color: #4CAF50;
                text-decoration: none;
            }
            /* Icons */
            .icon-account {
                background-image: url('https://img.icons8.com/ios-filled/50/4caf50/user.png');
                background-size: contain;
            }
            .icon-phone {
                background-image: url('https://img.icons8.com/ios-filled/50/4caf50/phone.png');
                background-size: contain;
            }
            .icon-order {
                background-image: url('https://img.icons8.com/ios-filled/50/4caf50/buy.png');
                background-size: contain;
            }
            .icon-time {
                background-image: url('https://img.icons8.com/ios-filled/50/4caf50/time.png');
                background-size: contain;
            }
        </style>
    </head>
    <body>

        <div class="container">
            <h2>Order Confirmation</h2>

            <p>Dear ${accountName},</p>
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
                            <td><span class="icon icon-account"></span>Account ID</td>
                            <td>${accountId}</td>
                        </tr>
                        <tr>
                            <td><span class="icon icon-account"></span>Account Name</td>
                            <td>${accountName}</td>
                        </tr>
                        <tr>
                            <td><span class="icon icon-phone"></span>Phone Number</td>
                            <td>${phoneNumber}</td>
                        </tr>
                        <tr>
                            <td><span class="icon icon-order"></span>Order Type</td>
                            <td>${orderType}</td>
                        </tr>
                        <tr>
                            <td><span class="icon icon-order"></span>Order Amount</td>
                            <td>${orderAmount}</td>
                        </tr>
                        <tr>
                            <td><span class="icon icon-order"></span>Account Balance</td>
                            <td>${accountBalance}</td>
                        </tr>
                        <tr>
                            <td><span class="icon icon-time"></span>Time</td>
                            <td>${time}</td>
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
