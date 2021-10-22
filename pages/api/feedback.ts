require("dotenv").config();
import type { NextApiRequest, NextApiResponse } from 'next'
import { definitions } from "../../types/supabase";
import SupabaseService from '../../lib/SupabaseService';
import EmailService from '../../lib/EmailService';

const supabase = (new SupabaseService()).getClient();
const emailService = new EmailService();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, value } = req.body;

  // Save to DB.
  await supabase
    .from<definitions["feedback_interactions"]>("feedback_interactions")
    .insert([{ slug, value, environment: process.env.NODE_ENV }]);

  const feedbackType = value ? "POSITIVE" : "NEGATIVE";

  await emailService.transport({
    to: process.env.MY_EMAIL,
    from: process.env.MY_EMAIL,
    subject: `You've Got ${feedbackType} Blog Feedback!`,
    text: `Here's the post: https://macarthur.me/posts/${slug}`,
  });

  res.status(200).json({ slug, value });
}
