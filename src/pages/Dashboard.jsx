import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getProfile } from '../api/profiles.js'
import { getSuggestedMatches } from '../api/matches.js'
import { getConversations } from '../api/messages.js'
import MatchCard from '../components/MatchCard.jsx'
import Button from '../components/Button.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    if (!user) return
    
    getProfile(user.id).then((profile) => {
      if (profile && (!profile.can_teach_categories || profile.can_teach_categories.length === 0) && (!profile.wants_to_learn_categories || profile.wants_to_learn_categories.length === 0)) {
        navigate('/onboarding')
      }
    }).catch(() => {})

    getSuggestedMatches(user.id)
      .then((data) => {
        if (data?.length) {
          const mappedMatches = data.map((m) => ({
            id: m.id,
            name: m.matched_profile?.name || 'Unknown User',
            location: m.matched_profile?.location || 'Unknown Location',
            avatar: m.matched_profile?.avatar_url || 'https://i.pravatar.cc/150',
            matchScore: `${Math.round((m.match_score || 0) * 100)}% Match`,
            canTeach: m.matched_profile?.can_teach_categories || [],
            wantsToLearn: m.matched_profile?.wants_to_learn_categories || [],
          }))
          setMatches(mappedMatches)
        }
      })
      .catch(() => {})
      
    getConversations(user.id)
      .then((data) => data && setConversations(data))
      .catch(() => {})
  }, [user])

  const firstName = user?.user_metadata?.first_name ?? 'User'

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-600">Welcome back, {firstName}! 👋</h1>
          <p className="mt-1 text-sm text-brand-900/60">
            View your matches and catch up on messages.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-brand-600">Recommended Skill Matches for You</h2>
              <Link to="/browse" className="text-xs font-medium text-brand-500">
                View All Matches
              </Link>
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  name={match.name}
                  location={match.location}
                  avatarUrl={match.avatar}
                  matchScore={match.matchScore}
                  canTeach={match.canTeach}
                  wantsToLearn={match.wantsToLearn}
                  primaryLabel="Connect & Propose Swap"
                  onlyPrimary
                />
              ))}
              {matches.length === 0 && (
                <p className="text-sm text-brand-900/50 col-span-2">No matches found yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-100 p-6">
            <h2 className="font-bold text-brand-600">Recent Messages</h2>
            <div className="mt-4 space-y-4">
              {conversations.slice(0, 3).map((conv) => {
                const otherUser = conv.other_participant
                const lastMsg = conv.last_message?.[0]
                return (
                  <Link
                    key={conv.id}
                    to={`/chat?id=${conv.id}`}
                    className="block hover:bg-brand-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={otherUser?.avatar_url || 'https://i.pravatar.cc/150'} alt="" className="h-9 w-9 rounded-full object-cover" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-brand-900 truncate">{otherUser?.name || 'User'}</p>
                        <p className="text-xs text-brand-900/60 truncate">
                          {lastMsg ? lastMsg.body : 'Start a conversation'}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
              {conversations.length === 0 && (
                <p className="text-sm text-brand-900/50">No messages yet. Reach out to a match!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
