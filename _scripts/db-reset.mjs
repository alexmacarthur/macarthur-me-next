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
        .from('site_content_cache')
        .select();

    await client
        .from('site_content_cache')
        .delete()
        .in('id', data.map(post => post.id));
})();

console.log("Deleted site content cached in Supabase.");
