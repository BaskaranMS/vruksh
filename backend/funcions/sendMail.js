const nodemailer = require('nodemailer');
const Config = require('../config/config');

const sendMail = async (body) => {
    let config = {
        service: 'gmail',
        auth: {
            user: Config.ServerEmail,
            pass: Config.appPassword
        }
    };

    const transporter = nodemailer.createTransport(config);

    const { userData, newOrder } = body;

    let productsTableRows = newOrder.products.map(product => {
        return `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${product.name}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${product.size}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${product.quantity}</td>
            </tr>
        `;
    }).join('');

    let mailContent = `
        <style>
            @media only screen and (max-width: 600px) {
                table {
                    width: 100% !important;
                    min-width: 100% !important;
                }
                td {
                    display: block;
                    width: 100% !important;
                    box-sizing: border-box;
                }
            }
        </style>
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9fbe7; padding: 20px; border-radius: 10px;">
            <div style="background-color: #4CAF50; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0;">Vruksh Store</h1>
            </div>
            <div style="background-color: white; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
                <p style="font-weight: 700">Hello Admin!,</p>
                <p>A new order has been placed with the following details:</p>
                <div style="max-height: 200px; overflow-y: auto; overflow-x: auto; margin-top: 20px; border: 1px solid #ddd;">
                    <div style="min-width: 800px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="background-color: #66BB6A; color: white; padding: 10px; text-align: left;">Product Name</th>
                                    <th style="background-color: #66BB6A; color: white; padding: 10px; text-align: left;">Size</th>
                                    <th style="background-color: #66BB6A; color: white; padding: 10px; text-align: center;">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productsTableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p style="margin-top: 20px;">Order ID: ${newOrder._id}</p>
                <p>Order Date: ${new Date().toLocaleDateString()}</p>
                <p>Order Status: ${newOrder.status}</p>
                <p>Customer Name: ${userData.username}</p>
                <p>Phone Number: ${userData.phone}</p>
                <p style="margin-top: 20px; text-align: center;">Thank you for Trusting Us...</p>
            </div>
            <div style="background-color: #2E7D32; color: white; padding: 10px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 20px;">
                <p style="margin: 0;">&copy; 2024 W E B G I. All rights reserved.</p>
            </div>
        </div>
    `;

    let message = {
        from: Config.ServerEmail,
        to: Config.clientEmail,
        subject: 'New Order Placed at Vruksh Store',
        html: mailContent
    };

    try {
        await transporter.sendMail(message);
        return 'email is sent!!';
    } catch (err) {
        console.log(err);
        return 'email is not sent!!'
    };
};

module.exports = sendMail;
