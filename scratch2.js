import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://quqepdwijkepwvnkvzyd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWVwZHdpamtlcHd2bmt2enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTkxNjQsImV4cCI6MjEwNjA5NTE2NH0.bQs2mOysxa_KGkqzMCwwQSBVTCGgpUhl7ay4Tq4iS54'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const q1 = await supabase.from('user_skills_want').select('*').limit(1)
  console.log('user_skills_want:', q1.error || q1.data)

  const q2 = await supabase.from('user_skills_teach').select('*').limit(1)
  console.log('user_skills_teach:', q2.error || q2.data)

  const q3 = await supabase.from('matches').select('*').limit(1)
  console.log('matches:', q3.error || q3.data)
  
  const q4 = await supabase.rpc('get_suggested_matches', { p_user_id: '00000000-0000-0000-0000-000000000000' })
  console.log('rpc get_suggested_matches:', q4.error || 'success')
  
  const q5 = await supabase.rpc('match_users', { p_user_id: '00000000-0000-0000-0000-000000000000' })
  console.log('rpc match_users:', q5.error || 'success')
}
run()
