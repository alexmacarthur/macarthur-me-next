require("dotenv").config();
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from "@supabase/supabase-js";
import { definitions } from "../../types/supabase";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, value } = req.body;

  // Save to DB.
  await supabase
    .from<definitions["feedback_interactions"]>("feedback_interactions")
    .insert([{ slug, value, environment: process.env.NODE_ENV }]);

  const feedbackType = value ? "POSITIVE" : "NEGATIVE";

  // Trigger email alert.
  await sgMail.send({
    to: process.env.MY_EMAIL,
    from: process.env.MY_EMAIL,
    subject: `You've Got ${feedbackType} Blog Feedback!`,
    html: `Here's the post: https://macarthur.me/posts/${slug}`,
  });

  res.status(200).json({ slug, value });
}
