require('dotenv').config();
import { createClient } from '@supabase/supabase-js';
import { Handler } from '@netlify/functions'
import { definitions } from '../types/supabase';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const isProd = process.env.NODE_ENV === 'production';

const headers = {
  "Access-Control-Allow-Origin": isProd ? "https://macarthur.me" : "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    console.log('Something other than a post request was received.');

    return {
      statusCode: 200,
      headers,
      body: "Nope."
    };
  }


  const { slug, value } = JSON.parse(event.body);

  // Save to DB.
  await supabase
    .from<definitions["interactions"]>('interactions')
    .insert([
      { slug, value, environment: process.env.NODE_ENV }
    ]);

  const feedbackType = value ? 'POSITIVE' : 'NEGATIVE';

  // Send email alert.
  await sgMail.send({
    to: "alex@macarthur.me",
    from: "alex@macarthur.me",
    subject: `You've Got ${feedbackType} Blog Feedback!`,
    html: `Here's the post: https://macarthur.me/posts/${slug}`
  });

  return {
    headers,
    statusCode: 200,
    body: JSON.stringify({
      slug, value
    })
  }
}

export { handler }
