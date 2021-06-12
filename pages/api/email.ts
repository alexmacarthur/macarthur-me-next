require("dotenv").config();
import type { NextApiRequest, NextApiResponse } from 'next'
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

type Email = {
  email: string,
  message: string,
  name: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, message, name }: Email = req.body;

  await sgMail.send({
    to: process.env.MY_EMAIL,
    from: email,
    subject: `Contact Form Submitted`,
    text: `
Name: ${name}\n\n
Email Address: ${email}\n\n
Message: ${message}
`,
  });

  res.status(200).json({ email, message, name });
}
