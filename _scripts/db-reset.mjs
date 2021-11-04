#!/usr/bin/env node
import dotenv from "dotenv";

import { createClient } from "@supabase/supabase-js";

dotenv.config();

const client = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

(async () => {
    const { data } = await client
        .from('blog_post_cache')
        .select();

    await client
        .from('blog_post_cache')
        .delete()
        .in('id', data.map(post => post.id));
})();

console.log("JSON database reset.");
