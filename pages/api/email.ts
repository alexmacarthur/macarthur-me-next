require("dotenv").config();
import type { NextApiRequest, NextApiResponse } from 'next'
import { transport } from "./_utils/email";

type Email = {
  email: string,
  message: string,
  name: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, message, name }: Email = req.body;

  await transport({
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
