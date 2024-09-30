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
            p {
                font-size: 14px; /* Standard font size */
                color: #333;
                margin: 5px 0; /* Reduced margins */
                padding: 0 15px; /* Minimal padding */
                text-align: left; /* Align left */
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
            .footer {
                text-align: left; /* Align left */
                font-size: 12px;
                color: #888;
                margin-top: 10px; /* Reduced margin */
                padding: 0; /* No padding */
            }
        </style>
    </head>
    <body>

        <div class="container">
            <h2>Nexus</h2>
            <p>Dear ${accountName},</p>
            <p>We have received your order. Below are the details:</p>

            <table class="details-table">
                <thead>
                    <tr>
                        <th style="width: 50%;">Details</th>
                        <th style="width: 50%;">Information</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Account ID</td>
                        <td>${accountId}</td>
                    </tr>
                    <tr>
                        <td>Account Name</td>
                        <td>${accountName}</td>
                    </tr>
                    <tr>
                        <td>Phone Number</td>
                        <td>${phoneNumber}</td>
                    </tr>
                    <tr>
                        <td>Order Type</td>
                        <td>${orderType}</td>
                    </tr>
                    <tr>
                        <td>Order Amount</td>
                        <td>${orderAmount}</td>
                    </tr>
                    <tr>
                        <td>Account Balance</td>
                        <td>${accountBalance}</td>
                    </tr>
                    <tr>
                        <td>Time</td>
                        <td>${time}</td>
                    </tr>
                </tbody>
            </table>

            <p>Thank you for using Nexus. Your order will be processed shortly.</p>
            <p class="footer">This is an automated message. Please do not reply.</p>
        </div>

    </body>
    </html>
    `;
};

// Endpoint to handle sending the email
app.post('/api/send-email', async (req, res) => {
    const adminEmail = process.env.EMAIL_USER; // Email for the admin or default recipient

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
