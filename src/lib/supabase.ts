import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      donations: {
        Row: {
          id: string;
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed' | 'cancelled';
          stripe_session_id: string | null;
          stripe_payment_intent_id: string | null;
          donor_email: string | null;
          donor_name: string | null;
          species_id: string | null;
          message: string | null;
          anonymous: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          amount: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'cancelled';
          stripe_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          donor_email?: string | null;
          donor_name?: string | null;
          species_id?: string | null;
          message?: string | null;
          anonymous?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'cancelled';
          stripe_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          donor_email?: string | null;
          donor_name?: string | null;
          species_id?: string | null;
          message?: string | null;
          anonymous?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};