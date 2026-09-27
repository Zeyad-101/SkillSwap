import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getConversations, getMessages, sendMessage } from '../api/messages.js'
import MessageBubble from '../components/MessageBubble.jsx'
import { supabase } from '../lib/supabaseClient.js'

export default function Chat() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (!user) return
    getConversations(user.id)
      .then((data) => {
        if (data?.length) {
          setConversations(data.map(c => ({
            id: c.id,
            name: c.other_participant?.name || 'User',
            avatar: c.other_participant?.avatar_url || 'https://i.pravatar.cc/150',
            preview: c.last_message?.[0]?.body || '',
            time: new Date(c.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            exchange: 'Skill Swap Match'
          })))
          if (!activeId) setActiveId(data[0].id)
        }
      })
      .catch(() => {})
  }, [user])

  useEffect(() => {
    if (activeId && user) {
      getMessages(activeId, user.id)
        .then((data) => {
          if (data) {
            setMessages(data.map(m => ({
              id: m.id,
              isOwn: m.sender_id === user.id,
              body: m.body,
              time: new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            })))
          }
        })
        .catch(() => {
          setMessages([])
        })

      const channel = supabase.channel(`messages:${activeId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, payload => {
          const newMsg = payload.new;
          if (newMsg.sender_id === activeId) {
            setMessages(prev => [...prev, {
              id: newMsg.id,
              isOwn: false,
              body: newMsg.body,
              time: new Date(newMsg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            }])
          }
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } else {
      setMessages([])
    }
  }, [activeId, user])

  const active = conversations.find((c) => c.id === activeId)

  async function handleSend(e) {
    e.preventDefault()
    if (!draft.trim() || !activeId) return

    const optimisticMessage = {
      id: Date.now(),
      isOwn: true,
      body: draft,
      time: 'Just now',
    }
    setMessages((prev) => [...prev, optimisticMessage])
    setDraft('')

    if (user) {
      try {
        await sendMessage(activeId, user.id, optimisticMessage.body)
      } catch {
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-2xl border border-brand-100 p-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-bold text-brand-600">Active Conversations</h2>
            <span className="text-xs font-medium text-brand-50">{conversations.length} active</span>
          </div>
          <div className="mt-3 space-y-1">
            {conversations.length === 0 && (
              <p className="px-2 text-sm text-brand-900/50">No conversations yet.</p>
            )}
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  c.id === activeId ? 'bg-brand-50' : 'hover:bg-brand-50/60'
                }`}
              >
                <img src={c.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-brand-900">{c.name}</p>
                    <span className="flex-none text-[11px] text-brand-900/40">{c.time}</span>
                  </div>
                  <p className="truncate text-xs text-brand-900/50">{c.preview}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex flex-col rounded-2xl border border-brand-100 min-h-[400px]">
          {active ? (
            <>
              <div className="flex items-center justify-between border-b border-brand-100 p-4">
                <div className="flex items-center gap-3">
                  <img src={active.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-brand-900">{active.name}</p>
                    <p className="text-xs text-brand-900/50">{active.exchange}</p>
                  </div>
                </div>
                <button className="min-h-[44px] rounded-full border border-brand-200 px-4 py-1.5 text-xs font-medium text-brand-700">
                  View Profile
                </button>
              </div>

              <div className="flex-1 space-y-4 p-5 overflow-y-auto">
                {messages.length === 0 && (
                  <p className="text-sm text-brand-900/50 text-center mt-4">Start the conversation!</p>
                )}
                {messages.map((m) => (
                  <MessageBubble
                    key={m.id}
                    body={m.body}
                    isOwn={m.isOwn}
                    timestamp={m.time}
                    avatarUrl={!m.isOwn ? active.avatar : undefined}
                  />
                ))}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-brand-100 p-4">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Write a learning-focused message to ${active.name.split(' ')[0]}…`}
                  className="min-h-[44px] flex-1 rounded-full border border-brand-100 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  ➤
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8">
              <p className="text-sm text-brand-900/50">Select a conversation to start chatting.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
