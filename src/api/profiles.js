import { supabase } from '../lib/supabaseClient.js'

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates }, { onConflict: 'id' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProfile(userId) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (error) throw error

  await supabase.auth.signOut()
}
