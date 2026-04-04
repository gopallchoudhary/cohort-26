import nodemailer from "nodemailer";
import 'dotenv/config'
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT) || 587,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

const sendEmail = async (to, subject, html) => {


    transporter.verify((error, success) => {
        if (error) console.log("Mailtrap error:", error)
        else console.log("Mailtrap connected ✅")
    })

    try {
        await transporter.sendMail({
            from: `"${process.env.MAILTRAP_FROM_NAME}" <${process.env.MAILTRAP_FROM_EMAIL}>`,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

const sendVerificationEmail = async (email, token) => {
    const html = `
    <p>Hello,</p>
    <p>Please click the following link to verify your email address:</p>
    <p>Click <a href="${process.env.CLIENT_URL}/verify-email/${token}">Here</a> to verify your email address</p>
    <p>If you did not request this email, please ignore this message.</p>
    <p>Thank you,</p>
    <p>Pikachu</p>
    `;
    await sendEmail(email, "Verify your email address", html);
};


const sendResetPasswordEmail = async (email, token) => {
    console.log("email: ", email, " token: ", token);

    const html = `
    <p>Hello,</p>
    <p>Please click the following link to reset your password:</p>
    <p>Click <a href="${process.env.CLIENT_URL}/reset-password/${token}">Here</a> to reset your password</p>
    <p>If you did not request this email, please ignore this message.</p>
    <p>Thank you,</p>
    <p>Pikachu</p>
    `;
    await sendEmail(email, "Reset your password", html);
};

const sendOrderConfirmationEmail = async (email, order) => {
    const items = order.items.map((item) => `<li>${item.name} - ${item.price}</li>`).join("");
    const html = `
    <p>Hello,</p>
    <p>Your order has been placed:</p>
    <p>Order ID: ${order._id}</p>
    <p>Items:</p>
    <ul>${items}</ul>
    <p>If you did not place this order, please ignore this message.</p>
    <p>Thank you,</p>
    <p>Pikachu</p>
    `;
    await sendEmail(email, "Order Confirmation", html);
}


export { sendEmail, sendVerificationEmail, sendResetPasswordEmail, sendOrderConfirmationEmail };

