import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const client = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

class SupabaseService {
  client: any;

  constructor() {
    this.client = client;
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  async addContactFormSubmission(args: {
    name: string;
    email_address: string;
    password: string;
    completed_time: number;
    is_trusted: boolean;
  }) {
    return await this.client.from("contact_form_submissions").insert([args]);
  }

  async getPositiveFeedbackCount(): Promise<number> {
    const { count } = await this.client
      .from("feedback_interactions")
      .select("id", { count: "exact", head: true })
      .eq("environment", "production")
      .eq("value", true);

    return count;
  }

  async getToken(service: string = ""): Promise<string> {
    const { data } = await this.client
      .from("api_tokens")
      .select()
      .eq("service", service)
      .order("created_at", { ascending: false })
      .limit(1);

    return data.length ? data[0] : null;
  }

  async updateToken({
    service,
    accessToken,
    refreshToken,
    oldAccessToken,
  }: {
    service: string;
    accessToken: string;
    refreshToken: string;
    oldAccessToken: string;
  }) {
    // Delete the existing token.
    await this.client
      .from("api_tokens")
      .delete()
      .match({ access_token: oldAccessToken });

    // Add the new token.
    return await this.client.from("api_tokens").insert([
      {
        access_token: accessToken,
        refresh_token: refreshToken,
        service,
      },
    ]);
  }
}

export default SupabaseService;
