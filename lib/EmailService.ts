import nodemailer from "nodemailer";

class EmailService {
  transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  transport(options) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(options, function (error, info) {
        if (error) {
          return reject(error);
        }

        return resolve(info.response);
      });
    });
  }
}

export default EmailService;
