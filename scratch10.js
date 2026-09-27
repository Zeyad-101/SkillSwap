import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://quqepdwijkepwvnkvzyd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWVwZHdpamtlcHd2bmt2enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTkxNjQsImV4cCI6MjEwNjA5NTE2NH0.bQs2mOysxa_KGkqzMCwwQSBVTCGgpUhl7ay4Tq4iS54'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const { data, error } = await supabase.from('suggested_matches').select('*').limit(1)
  console.log('suggested_matches:', error || data)
  
  const { data: d2, error: e2 } = await supabase.from('matches').select('*').limit(1)
  console.log('matches:', e2 || d2)
}
run()
