require("dotenv").config();
import type { NextApiRequest, NextApiResponse } from 'next'
import EmailService from '../../lib/EmailService';

type Email = {
  email: string,
  message: string,
  name: string,
  website?: string | undefined
}

const emailService = new EmailService();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, message, name, website }: Email = req.body;

  if (website) {
    console.error("Invalid email send data.");
    return res.status(200).json({ email, message, name });
  }

  await emailService.transport({
    to: process.env.MY_EMAIL,
    from: email,
    subject: "Contact Form Submitted",
    text: `
Name: ${name}\n
Email Address: ${email}\n
Message: ${message}
`,
  });

  res.status(200).json({ email, message, name });
}
