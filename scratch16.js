import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://quqepdwijkepwvnkvzyd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWVwZHdpamtlcHd2bmt2enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTkxNjQsImV4cCI6MjEwNjA5NTE2NH0.bQs2mOysxa_KGkqzMCwwQSBVTCGgpUhl7ay4Tq4iS54')

async function run() {
  const { error } = await supabase.from('skills').insert([{ name: 'Test' }])
  console.log('skills insert error:', error)
}
run()
