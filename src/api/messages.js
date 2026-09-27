import { supabase } from '../lib/supabaseClient.js'

export async function getConversations(userId) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id, body, created_at, sender_id, receiver_id,
      sender:profiles!messages_sender_id_fkey(id, name, avatar_url),
      receiver:profiles!messages_receiver_id_fkey(id, name, avatar_url)
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) throw error
  const convos = new Map()
  for (const msg of data) {
    const isSender = msg.sender_id === userId
    const otherUserId = isSender ? msg.receiver_id : msg.sender_id
    const otherUser = isSender ? msg.receiver : msg.sender
    
    if (!convos.has(otherUserId)) {
      convos.set(otherUserId, {
        id: otherUserId,
        other_participant: otherUser,
        last_message: [msg],
        updated_at: msg.created_at
      })
    }
  }

  return Array.from(convos.values())
}

export async function getMessages(otherUserId, currentUserId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function sendMessage(otherUserId, currentUserId, body) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ receiver_id: otherUserId, sender_id: currentUserId, body })
    .select()
    .single()

  if (error) throw error
  return data
}
