import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { definitions } from "../../types/supabase";

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
}

export default SupabaseService;
