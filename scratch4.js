import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://quqepdwijkepwvnkvzyd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWVwZHdpamtlcHd2bmt2enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTkxNjQsImV4cCI6MjEwNjA5NTE2NH0.bQs2mOysxa_KGkqzMCwwQSBVTCGgpUhl7ay4Tq4iS54'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const { data, error } = await supabase.rpc('get_schema_info')
  console.log('rpc?', error)
  // Just try to insert a fake record to see the error for column names
  const { error: e1 } = await supabase.from('user_skills_want').insert([{ fake_col: 1 }])
  console.log('user_skills_want columns error:', e1)

  const { error: e2 } = await supabase.from('matches').insert([{ fake_col: 1 }])
  console.log('matches columns error:', e2)
}
run()
