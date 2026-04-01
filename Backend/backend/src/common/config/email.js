import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
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

