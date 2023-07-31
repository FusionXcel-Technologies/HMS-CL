const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, content, htmlBody) => {
    try {
        // Create a nodemailer transporter
        const transporter = nodemailer.createTransport({
            // Configure your email service provider settings here
            // Retrieve email credentials from environment variables
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Generate the HTML body if not provided
        if (!htmlBody) {
            htmlBody = generateHTMLBody(content);
        }

        // Define the email options
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: to,
            subject: subject,
            html: htmlBody,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email sending error:", error);
    }
};

const generateHTMLBody = (content) => {
    // Generate the HTML body based on the provided content
    // Customize the HTML structure and styling as per your needs
    const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Add your CSS styles here */
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
          }
          .container {
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .content {
            font-size: 16px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">${content.title}</div>
          <div class="content">${content.body}</div>
        </div>
      </body>
    </html>
  `;

    return htmlBody;
};

module.exports = {
    sendEmail,
};
