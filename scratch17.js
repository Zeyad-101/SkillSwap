import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://quqepdwijkepwvnkvzyd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWVwZHdpamtlcHd2bmt2enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTkxNjQsImV4cCI6MjEwNjA5NTE2NH0.bQs2mOysxa_KGkqzMCwwQSBVTCGgpUhl7ay4Tq4iS54'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const email = `tester${Date.now()}@gmail.com`
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'Password123!',
    options: {
      data: {
        full_name: 'Test User',
        avatar_url: 'https://test.com/avatar.png'
      }
    }
  })
  
  if (authError) {
    console.log('Signup error:', authError)
    return
  }
  
  console.log('User ID:', authData.user.id)
  
  await new Promise(r => setTimeout(r, 1000))
  
  const { error: skillErr } = await supabase.from('skills').insert([{ name: 'React' }])
  console.log('Skill insert error:', skillErr)
}
run()
