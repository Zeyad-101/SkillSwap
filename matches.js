import { supabase } from '../lib/supabaseClient.js'

export async function getSuggestedMatches(userId) {
  const { data, error } = await supabase
    .from('matches')
    .select('*, matched_profile:profiles!matches_matched_user_id_fkey(*)')
    .eq('user_id', userId)
    .order('match_score', { ascending: false })

  if (error) throw error
  return data
}

export async function getPendingRequests(userId) {
  const { data, error } = await supabase
    .from('learning_requests')
    .select('*, requester:profiles!learning_requests_requester_id_fkey(*)')
    .eq('recipient_id', userId)
    .eq('status', 'pending')

  if (error) throw error
  return data
}

export async function sendLearningRequest(requesterId, recipientId, message) {
  const { data, error } = await supabase
    .from('learning_requests')
    .insert({ requester_id: requesterId, recipient_id: recipientId, message, status: 'pending' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function respondToRequest(requestId, status) {
  const { data, error } = await supabase
    .from('learning_requests')
    .update({ status })
    .eq('id', requestId)
    .select()
    .single()

  if (error) throw error
  return data
}
