import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sjmmqjtlfmbzrouptbvr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqbW1xanRsZm1ienJvdXB0YnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwOTY5MDYsImV4cCI6MjEwMzY3MjkwNn0.S6P5EH78CEquSh0MYyZQGVZ5dKBF1Ei-oiNvHHOYlAQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
