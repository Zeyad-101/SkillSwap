import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://quqepdwijkepwvnkvzyd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWVwZHdpamtlcHd2bmt2enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTkxNjQsImV4cCI6MjEwNjA5NTE2NH0.bQs2mOysxa_KGkqzMCwwQSBVTCGgpUhl7ay4Tq4iS54')

async function run() {
  const { data, count, error } = await supabase.from('skills').select('*', { count: 'exact' })
  console.log('skills error:', error)
  console.log('skills count:', count)
  console.log('skills data:', data)
}
run()
