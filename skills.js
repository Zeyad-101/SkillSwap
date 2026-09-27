import { supabase } from '../lib/supabaseClient.js'

export async function getSkillCategories() {
  const { data, error } = await supabase.from('skill_categories').select('*')
  if (error) throw error
  return data
}

export async function getFeaturedSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('featured', true)

  if (error) throw error
  return data
}

export async function searchSkillSwappers(filters) {
  let query = supabase.from('profiles').select('*')

  if (filters?.category && filters.category !== 'all') {
    query = query.contains('can_teach_categories', [filters.category])
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters?.availability?.length) {
    query = query.overlaps('availability_tags', filters.availability)
  }
  if (filters?.swapPreference?.length) {
    query = query.overlaps('swap_preference', filters.swapPreference)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}
