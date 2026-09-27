import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://quqepdwijkepwvnkvzyd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWVwZHdpamtlcHd2bmt2enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTkxNjQsImV4cCI6MjEwNjA5NTE2NH0.bQs2mOysxa_KGkqzMCwwQSBVTCGgpUhl7ay4Tq4iS54')

async function run() {
  const { data, error } = await supabase
    .from('skills')
    .select(`
      id,
      user_skills_want!inner(user_id),
      user_skills_teach!inner(user_id)
    `)
    .eq('user_skills_want.user_id', '00000000-0000-0000-0000-000000000000')
    
  console.log('Join error:', error)
  console.log('Join data:', data)
}
run()
