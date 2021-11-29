require("dotenv").config();
import type { NextApiRequest, NextApiResponse } from 'next'
import EmailService from '../../lib/EmailService';

type Email = {
  email: string,
  message: string,
  name: string,
  password?: string | undefined
}

const emailService = new EmailService();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, message, name, password }: Email = req.body;
  const completedTime = req.headers["x-completion-time"] || "?";

  await emailService.transport({
    to: process.env.MY_EMAIL,
    from: email,
    replyTo: email,
    subject: "Contact Form Submitted",
    text: `
Name: ${name}\n
Email Address: ${email}\n
Message: ${message}\n
Completed In: ${completedTime}s
Password: ${password}
`,
  });

  res.status(200).json({ email, message, name });
}
