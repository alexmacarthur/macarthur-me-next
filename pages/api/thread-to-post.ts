require("dotenv").config();
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { conversation_id, form_value } = req.body;

  await supabase
    .from("thread_to_post_form_submissions")
    .insert([{ conversation_id, form_value, environment: process.env.NODE_ENV }]);

  res.status(200).json({ conversation_id, form_value });
}
