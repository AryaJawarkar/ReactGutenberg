import { createClient } from '@supabase/supabase-js';

// Get environment variables based on the environment
const getEnvVars = () => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return {
      supabaseUrl: 'http://localhost:3000',
      supabaseKey: 'test-key'
    };
  }
  
  // For development/production
  if (typeof window !== 'undefined') {
    return {
      supabaseUrl: window.env?.VITE_SUPABASE_URL || '',
      supabaseKey: window.env?.VITE_SUPABASE_ANON_KEY || ''
    };
  }

  return {
    supabaseUrl: '',
    supabaseKey: ''
  };
};

const { supabaseUrl, supabaseKey } = getEnvVars();

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
        