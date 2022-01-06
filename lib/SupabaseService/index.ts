import { createClient, SupabaseClient } from "@supabase/supabase-js";

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
  
  async addContactFormSubmission(args: {
    name: string,
    email_address: string,
    password: string, 
    completed_time: number,
    is_trusted: boolean
  }) {
    return await this.client
      .from('contact_form_submissions')
      .insert([args]);
  }

  async updateContent(contentType: ContentType, posts: PostData[]) {
    const data = posts.map(post => {
      return {
        slug: post.slug, 
        post_json: post,
        content_type: contentType
      }
    });

    await this.deleteContent(contentType);

    return await this.client
      .from('site_content_cache')
      .insert(data);
  }

  async getContent(contentType: ContentType) {
    const { data } = await this.client
      .from('site_content_cache')
      .select()
      .eq('content_type', contentType);

    if(!data.length) {
      return [];
    }
      
    // If the cached post data is older than an hour, 
    // delete it so that a new batch can be generated.
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setTime(fifteenMinutesAgo.getTime() - (15 * 60 * 1000));
    const postTime = new Date(data[0].created_at);

    if(postTime.getTime() < fifteenMinutesAgo.getTime()) {
      console.log('Cache is old. Deleting.');

      await this.deleteContent(contentType);

      return [];
    }

    return data.map(post => post.post_json);
  }

  deleteContent(contentType: ContentType): Promise<any> {
    return this.client
      .from('site_content_cache')
      .delete()
      .match({ 'content_type': contentType });
  }

  async getPositiveFeedbackCount(): Promise<number> {
    const { count } = await this.client
      .from('feedback_interactions')
      .select('id', { count: 'exact', head: true })
      .eq('environment', 'production')
      .eq('value', true);

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
    await this.client
      .from('api_tokens')
      .delete()
      .match({ 'access_token': oldAccessToken });

    // Add the new token.
    return await this.client
      .from('api_tokens')
      .insert([
        {
          access_token: accessToken,
          refresh_token: refreshToken,
          service
        }
      ]);
  }
}

export default SupabaseService;
