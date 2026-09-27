import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getSuggestedMatches, getPendingRequests, respondToRequest } from '../api/matches.js'
import MatchCard from '../components/MatchCard.jsx'
import SkillTag from '../components/SkillTag.jsx'
import Button from '../components/Button.jsx'

const FALLBACK_SESSIONS = [
  {
    id: 'spanish-arthur',
    name: 'Spanish Practice with Arthur',
    time: 'Today, 6:00 PM – 7:30 PM (Weekly Recurrence)',
    mode: 'In-Person (Seattle)',
    avatar: 'https://i.pravatar.cc/150?img=13',
  },
  {
    id: 'figma-sofia',
    name: 'Figma Basics with Sofia',
    time: 'Thursday, Oct 24, 7:00 PM – 8:00 PM',
    mode: 'Online Call',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
]

const FALLBACK_PENDING = [
  {
    id: 'sofia-chen',
    name: 'Sofia Chen',
    body: 'Wants to learn your photography skill',
    avatar: 'https://i.pravatar.cc/150?img=32',
    status: 'pending',
  },
  {
    id: 'mei-ling-zhou',
    name: 'Mei-Ling Zhou',
    body: 'Sent Oct 19 · Pending response',
    avatar: 'https://i.pravatar.cc/150?img=25',
    status: 'sent',
  },
]

const FALLBACK_MATCHES = [
  {
    id: 'olivia-rhye',
    name: 'Olivia Rhye',
    location: 'Seattle, WA · 2.4 miles away',
    avatar: 'https://i.pravatar.cc/150?img=5',
    matchScore: '98% Match',
    canTeach: ['Acoustic Guitar'],
    wantsToLearn: ['Digital Illustration'],
  },
  {
    id: 'marcus-brody',
    name: 'Marcus Brody',
    location: 'Seattle, WA · Online/In-person',
    avatar: 'https://i.pravatar.cc/150?img=51',
    matchScore: '94% Match',
    canTeach: ['Portrait Photography'],
    wantsToLearn: ['Spanish Conversation'],
  },
]

const SUGGESTED_SKILLS = [
  'Sourdough Baking',
  'React & UI Coding',
  'French Conversation',
  'Calligraphy',
  'Nutrition',
  'Japanese Cooking',
  'Digital Illustration',
]

export default function Dashboard() {
  const { user } = useAuth()
  const [matches, setMatches] = useState(FALLBACK_MATCHES)
  const [pending, setPending] = useState(FALLBACK_PENDING)

  useEffect(() => {
    if (!user) return
    getSuggestedMatches(user.id)
      .then((data) => data?.length && setMatches(data))
      .catch(() => {})
    getPendingRequests(user.id)
      .then((data) => data?.length && setPending(data))
      .catch(() => {})
  }, [user])

  async function handleRespond(requestId, status) {
    try {
      await respondToRequest(requestId, status)
    } catch {
      // Supabase not configured yet — fall through to the local UI update below.
    }
    setPending((prev) => prev.filter((p) => p.id !== requestId))
  }

  const firstName = user?.user_metadata?.first_name ?? 'Clara'

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-600">Welcome back, {firstName}! 👋</h1>
          <p className="mt-1 text-sm text-brand-900/60">
            You have {FALLBACK_SESSIONS.length} upcoming swaps this week and {pending.length} pending
            learning requests.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Edit Learning Goals</Button>
          <Button>Update Availability</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-100 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-brand-600">Upcoming Sessions</h2>
              <Link to="/dashboard" className="text-xs font-medium text-brand-500">
                View Schedule Calendar
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {FALLBACK_SESSIONS.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-xl bg-brand-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={session.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-brand-900">{session.name}</p>
                      <p className="text-xs text-brand-900/60">{session.time}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600">
                    {session.mode}
                  </span>
                </div>
              ))}
            </div>
          </div>

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
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-100 p-6">
            <h2 className="font-bold text-brand-600">Pending Learning Requests</h2>
            <div className="mt-4 space-y-4">
              {pending.map((req) => (
                <div key={req.id}>
                  <div className="flex items-center gap-3">
                    <img src={req.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-brand-900">{req.name}</p>
                      <p className="text-xs text-brand-900/60">{req.body}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {req.status === 'pending' ? (
                      <>
                        <Button size="sm" className="flex-1" onClick={() => handleRespond(req.id, 'accepted')}>
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="flex-1"
                          onClick={() => handleRespond(req.id, 'declined')}
                        >
                          Decline
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => handleRespond(req.id, 'cancelled')}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {pending.length === 0 && (
                <p className="text-sm text-brand-900/50">No pending requests right now.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 p-6">
            <h2 className="font-bold text-brand-600">Suggested Skills to Explore</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTED_SKILLS.map((skill) => (
                <SkillTag key={skill} label={skill} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
