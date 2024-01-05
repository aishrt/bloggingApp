const catchAsync = require("../utils/catchAsync");
const nodemailer = require("nodemailer");

// ---------- You can check if server is running through this api ----------
const landing = (req, res) => {
  const responseContent = `
    <html>
      <head>
        <title>ART Server</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
            text-align: center;
          }
          h1 {
            margin-top :100px;
            color: #008080; 
            font-size: 53px;
          }
          strong {
            color: #006400; 
          }
          p {
            font-size: 33px;
          }
          span {
            font-size: 33px;
            font-weight:600;
            color: #006400;
          }
        </style>
      </head>
      <body>
        <h1>Hello! Welcome to our Server</h1>
        <p><strong>It is working properly</strong></p>
        <p>These server side API is working using NodeJs.</p>
        <p><span>A.R. Tyagi</span></p>
      </body>
    </html>
  `;
  res.send(responseContent);
};

// ------------------ Used to upload data through multer ---------------------
const upload = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      const data = `${process.env.BACKEND_URL}/${req.file.filename}`;
      return res.status(200).json({
        status: 200,
        message: "Image uploaded successfully",
        file: data,
      });
    }
    return res.status(400).json({
      status: 400,
      message: "File does not exist !",
      file: {},
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while adding employee data",
      error: error.message,
      stack: error.stack,
    });
  }
});

const sendMail = catchAsync(async (req, res) => {
  try {
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "name58@ethereal.email",
        pass: "nADrbQf9YraUP9k4jg",
      },
    });

    let message = {
      from: "Sender Name <sender@example.com>",
      to: "Recipient <recipient@example.com>",
      subject: "Nodemailer is unicode friendly ✔",
      text: "Hello to myself!",
      html: "<p><b>Hello</b> to myself!</p>",
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("Error occurred. " + err.message);
        return process.exit(1);
      }

      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while adding employee data",
      error: error.message,
      stack: error.stack,
    });
  }
});

module.exports = {
  landing,
  upload,
  sendMail,
};

// "use strict";
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.forwardemail.net",
//   port: 465,
//   secure: true,
//   auth: {
//     // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//     user: "aishraj05@gmail.com",
//     pass: "zntjykwcabtzqtjc",
//   },
// });

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <aishraj05@gmail.com>', // sender address
//     to: "mansityagi12021999@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   //
//   // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
//   //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
//   //       <https://github.com/forwardemail/preview-email>
//   //
// }

// main().catch(console.error);
