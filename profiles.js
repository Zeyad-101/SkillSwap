import { supabase } from '../lib/supabaseClient.js'

// All functions here return data or throw — pages never call supabase.from() directly.

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
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAvailability(userId, availability) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ availability })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
