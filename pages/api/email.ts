require("dotenv").config();
import type { NextApiRequest, NextApiResponse } from 'next'
import EmailService from '../../lib/EmailService';
import SupabaseService from '../../lib/SupabaseService';

type Email = {
  email: string,
  message: string,
  name: string,
  password?: string | undefined
}

const emailService = new EmailService();
const supabaseService = new SupabaseService();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, message, name, password }: Email = req.body;
  const completedTime = Number(req.headers["x-completion-time"] || "0");
  const isTrusted = Number(req.headers["x-is-trusted"] || "0") === 1;

  await supabaseService.addContactFormSubmission({
    name,
    email_address: email,
    password,
    completed_time: completedTime,
    is_trusted: isTrusted
  });

  // It's a bot.
  if(!completedTime || password.length > 0) {
    return res.status(200).json({ email, message, name });
  }

  await emailService.transport({
    to: process.env.EMAIL_ADDRESS,
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
