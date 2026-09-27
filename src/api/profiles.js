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
  // Clear all profile data first
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      name: null,
      about: null,
      avatar_url: null,
      can_teach_categories: [],
      wants_to_learn_categories: [],
    })
    .eq('id', userId)

  if (updateError) throw updateError

  // Sign the user out — full account deletion requires a server-side edge function
  await supabase.auth.signOut()
}
