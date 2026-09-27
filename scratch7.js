async function run() {
  const res = await fetch('https://quqepdwijkepwvnkvzyd.supabase.co/rest/v1/user_skills_want', {
    method: 'OPTIONS',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWVwZHdpamtlcHd2bmt2enlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTkxNjQsImV4cCI6MjEwNjA5NTE2NH0.bQs2mOysxa_KGkqzMCwwQSBVTCGgpUhl7ay4Tq4iS54'
    }
  })
  const text = await res.text()
  console.log(text)
}
run()
