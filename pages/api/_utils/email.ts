import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const transport = (options) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(options, function (error, info) {
      if (error) {
        return reject(error);
      }

      return resolve(info.response);
    });
  });
};

export { transport };
