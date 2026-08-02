import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. OAuth will not work.');
}

// Create the Supabase client for frontend auth
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);


export const oauthService = {
  /**
   * Initiate Google OAuth sign-in via Supabase
   */
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/oauth/success`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }
};
