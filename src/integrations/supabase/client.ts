// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://icisemqgkjbfiuihrpfi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljaXNlbXFna2piZml1aWhycGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0Njc0OTcsImV4cCI6MjA1MzA0MzQ5N30.j_rN_XN8sbbsV05fMPYAX_gBy4yuI5buNSonbjYjSYM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);