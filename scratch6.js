import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://quqepdwijkepwvnkvzyd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWVwZHdpamtlcHd2bmt2enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTkxNjQsImV4cCI6MjEwNjA5NTE2NH0.bQs2mOysxa_KGkqzMCwwQSBVTCGgpUhl7ay4Tq4iS54')

async function run() {
  const { error: e1 } = await supabase.from('user_skills_want').insert([{}])
  console.log('want err:', e1)
  const { error: e2 } = await supabase.from('user_skills_teach').insert([{}])
  console.log('teach err:', e2)
  const { error: e3 } = await supabase.from('matches').insert([{}])
  console.log('matches err:', e3)
}
run()
