import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://quqepdwijkepwvnkvzyd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWVwZHdpamtlcHd2bmt2enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTkxNjQsImV4cCI6MjEwNjA5NTE2NH0.bQs2mOysxa_KGkqzMCwwQSBVTCGgpUhl7ay4Tq4iS54'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const { data, error } = await supabase.from('user_skills_want').select('*').limit(1)
  const { data: data2 } = await supabase.from('matches').select('*').limit(1)
  const { data: data3 } = await supabase.from('skills').select('*').limit(1)
  const { data: data4 } = await supabase.from('user_skills_teach').select('*').limit(1)
  
  console.log('user_skills_want:', data)
  console.log('matches:', data2)
  console.log('skills:', data3)
  console.log('user_skills_teach:', data4)
}
run()
