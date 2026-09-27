import { supabase } from '../lib/supabaseClient.js'

export async function getConversations(userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, other_participant:profiles!conversations_other_user_id_fkey(*), last_message:messages(*)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function sendMessage(conversationId, senderId, body) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, body })
    .select()
    .single()

  if (error) throw error
  return data
}
