import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const sendEmail = async (mailOptions) => {
  try {
    const transporter = createTransporter();

    await transporter.verify();

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      ...mailOptions,
    });

    console.log("Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Brevo SMTP error details:", {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

export default sendEmail;
