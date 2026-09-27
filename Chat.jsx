import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getConversations, getMessages, sendMessage } from '../api/messages.js'
import MessageBubble from '../components/MessageBubble.jsx'

const FALLBACK_CONVERSATIONS = [
  {
    id: 'arthur-pendleton',
    name: 'Arthur Pendleton',
    preview: 'Sure! I can meet at Cafe Allegro for our fi…',
    time: '12 mins ago',
    avatar: 'https://i.pravatar.cc/150?img=13',
    exchange: 'Arthur teaches French ⇄ Wants your Baking tips',
  },
  {
    id: 'olivia-rhye',
    name: 'Olivia Rhye',
    preview: 'That would be fantastic. Next weekend…',
    time: 'Yesterday',
    avatar: 'https://i.pravatar.cc/150?img=5',
    exchange: 'Olivia teaches Guitar ⇄ Wants your Illustration',
  },
  {
    id: 'sofia-chen',
    name: 'Sofia Chen',
    preview: 'Thanks for accepting my photography req…',
    time: 'New Match',
    avatar: 'https://i.pravatar.cc/150?img=32',
    exchange: 'Sofia teaches Figma ⇄ Wants your Photography',
  },
]

const FALLBACK_MESSAGES = {
  'arthur-pendleton': [
    {
      id: 1,
      isOwn: false,
      body:
        "Hi Clara! Thanks for reaching out. I'd love to learn some bread baking tips. My baguettes always turn out like brickss! In exchange, I can absolutely help you practice Spanish conversation or basic French.",
      time: '11:04 AM',
    },
    {
      id: 2,
      isOwn: true,
      body:
        "That sounds like a perfect trade, Arthur! I'm planning a trip to South America, so practicing conversational Spanish would be incredible. I'd be happy to show you my sourdough starter techniques. Do you prefer online calls or meeting up locally?",
      time: '11:15 AM',
    },
    {
      id: 3,
      isOwn: false,
      body:
        "I'm definitely down for in-person meets! Cafe Allegro in Seattle is pretty quiet on Saturday mornings. How about we meet there this Saturday at 10 AM? We can do 45 mins of Spanish practice, then 45 mins of sourdough theory!",
      time: '11:20 AM',
    },
  ],
}

export default function Chat() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState(FALLBACK_CONVERSATIONS)
  const [activeId, setActiveId] = useState(FALLBACK_CONVERSATIONS[0].id)
  const [messages, setMessages] = useState(FALLBACK_MESSAGES['arthur-pendleton'])
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (!user) return
    getConversations(user.id)
      .then((data) => data?.length && setConversations(data))
      .catch(() => {})
  }, [user])

  useEffect(() => {
    getMessages(activeId)
      .then((data) => data?.length && setMessages(data))
      .catch(() => {
        setMessages(FALLBACK_MESSAGES[activeId] ?? [])
      })
  }, [activeId])

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0]

  async function handleSend(e) {
    e.preventDefault()
    if (!draft.trim()) return

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
        // Supabase not configured yet — the message still shows locally.
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-2xl border border-brand-100 p-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-bold text-brand-600">Active Conversations</h2>
            <span className="text-xs font-medium text-brand-500">{conversations.length} active</span>
          </div>
          <div className="mt-3 space-y-1">
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

        <section className="flex flex-col rounded-2xl border border-brand-100">
          <div className="flex items-center justify-between border-b border-brand-100 p-4">
            <div className="flex items-center gap-3">
              <img src={active.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-brand-900">{active.name}</p>
                <p className="text-xs text-brand-900/50">{active.exchange}</p>
              </div>
            </div>
            <button className="rounded-full border border-brand-200 px-4 py-1.5 text-xs font-medium text-brand-700">
              View Profile
            </button>
          </div>

          <div className="flex-1 space-y-4 p-5">
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
              className="flex-1 rounded-full border border-brand-100 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none"
            />
            <button
              type="submit"
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-500 text-white hover:bg-brand-600"
            >
              ➤
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
