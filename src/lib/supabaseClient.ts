import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zgypmhtyizwdkmwnkygg.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpneXBtaHR5aXp3ZGttd25reWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MTIyNTUsImV4cCI6MjA4MTQ4ODI1NX0.SK0au2ffH67Eoy-GL6WGkZ4fiUhScuwjrh5g1j9ab-k';

export const supabase = createClient(supabaseUrl, supabaseKey);
