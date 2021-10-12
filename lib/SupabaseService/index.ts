import { createClient, SupabaseClient } from "@supabase/supabase-js";

type Token = {
  id: number,
  service: string,
  created_at: string,
  refresh_token: string,
  access_token: string
}

class SupabaseService {
  client: any;

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  async getPositiveFeedbackCount(): Promise<number> {
    const { count } = await this.client
      .from('feedback_interactions')
      .select('id', { count: 'exact', head: true })
      .eq('environment', 'production')
      .eq('value', true)

    return count;
  }

  async getToken(service: string = ""): Promise<string> {
    const { data } = await this.client
      .from('api_tokens')
      .select()
      .eq('service', service)
      .order('created_at', { ascending: false })
      .limit(1);

    return data.length ? data[0] : null;
  }

  async updateToken({
    service,
    accessToken,
    refreshToken,
    oldAccessToken
  }: {
    service: string,
    accessToken: string,
    refreshToken: string,
    oldAccessToken: string
  }) {
    // Delete the existing token.
    await this.client.from('api_tokens')
      .delete()
      .match({ 'access_token': oldAccessToken })
      .execute();

    // Add the new token.
    return await this.client
      .from('api_tokens')
      .insert([
        {
          access_token: accessToken,
          refresh_token: refreshToken,
          service
        }
      ])
      .execute();
  }
}

export default SupabaseService;
