import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://quqepdwijkepwvnkvzyd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWVwZHdpamtlcHd2bmt2enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTkxNjQsImV4cCI6MjEwNjA5NTE2NH0.bQs2mOysxa_KGkqzMCwwQSBVTCGgpUhl7ay4Tq4iS54'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const rpcs = ['get_suggested_matches', 'find_matches', 'get_matches', 'match_skills', 'skill_matches'];
  for (const name of rpcs) {
    const { error } = await supabase.rpc(name, { user_id: '00000000-0000-0000-0000-000000000000' })
    if (error && error.code !== 'PGRST202') {
      console.log('Found RPC:', name, error)
    }
  }
}
run()
