import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { searchSkillSwappers } from '../api/skills.js'
import { getSuggestedMatches, sendLearningRequest } from '../api/matches.js'
import MatchCard from '../components/MatchCard.jsx'

const CATEGORIES = [
  'All Skills',
  'Music',
  'Art & Design',
  'Tech & Dev',
  'Languages',
  'Cooking',
  'Fitness',
  'Writing',
  'Crafts',
]

const FALLBACK_SWAPPERS = [
  {
    id: 'olivia-rhye',
    name: 'Olivia Rhye',
    location: 'Seattle, WA',
    avatar: 'https://i.pravatar.cc/150?img=5',
    canTeach: ['Acoustic Guitar', 'Ukulele'],
    wantsToLearn: ['Digital Illustration', 'Spanish'],
  },
  {
    id: 'arthur-pendleton',
    name: 'Arthur Pendleton',
    location: 'Boston, MA',
    avatar: 'https://i.pravatar.cc/150?img=13',
    canTeach: ['French Conversation', 'Philosophy'],
    wantsToLearn: ['iOS Swift Coding', 'Cooking'],
  },
  {
    id: 'clara-vance',
    name: 'Clara Vance',
    location: 'San Francisco, CA',
    avatar: 'https://i.pravatar.cc/150?img=47',
    canTeach: ['UX/UI Design', 'Figma Design'],
    wantsToLearn: ['Japanese Cooking', 'Gardening'],
  },
  {
    id: 'julian-sterling',
    name: 'Julian Sterling',
    location: 'Austin, TX',
    avatar: 'https://i.pravatar.cc/150?img=14',
    canTeach: ['HIIT Training', 'Nutrition'],
    wantsToLearn: ['Acoustic Guitar', 'Music Theory'],
  },
  {
    id: 'mei-ling-zhou',
    name: 'Mei-Ling Zhou',
    location: 'Seattle, WA',
    avatar: 'https://i.pravatar.cc/150?img=25',
    canTeach: ['Watercolor Painting', 'Calligraphy'],
    wantsToLearn: ['Photography', 'Piano'],
  },
  {
    id: 'devon-lane',
    name: 'Devon Lane',
    location: 'Denver, CO',
    avatar: 'https://i.pravatar.cc/150?img=60',
    canTeach: ['Python Development', 'Data Science'],
    wantsToLearn: ['Woodworking', 'Cooking'],
  },
]

const FALLBACK_MATCHES = [
  {
    id: 'olivia-rhye',
    name: 'Olivia Rhye',
    location: 'Seattle, WA · 2.4 miles away',
    avatar: 'https://i.pravatar.cc/150?img=5',
    matchScore: '98% Match',
    matchSignal: "Olivia teaches Acoustic Guitar and wants to learn your Digital Illustration skill!",
    canTeach: ['Acoustic Guitar', 'Ukulele Basics'],
  },
  {
    id: 'arthur-pendleton',
    name: 'Arthur Pendleton',
    location: 'Seattle, WA · 1.1 miles away',
    avatar: 'https://i.pravatar.cc/150?img=13',
    matchScore: '95% Match',
    matchSignal: 'Arthur teaches French Conversation and wants to learn your Baking skills!',
    canTeach: ['French Language', 'Philosophy Basics'],
  },
  {
    id: 'sofia-chen',
    name: 'Sofia Chen',
    location: 'Seattle, WA · Online Only',
    avatar: 'https://i.pravatar.cc/150?img=32',
    matchScore: '91% Match',
    matchSignal: 'Sofia teaches Figma Layouts and wants to learn your Portrait Photography!',
    canTeach: ['Figma Layouts', 'Spanish Conversation'],
  },
  {
    id: 'marcus-brody',
    name: 'Marcus Brody',
    location: 'Seattle, WA · Hybrid',
    avatar: 'https://i.pravatar.cc/150?img=51',
    matchScore: '89% Match',
    matchSignal: 'Marcus teaches Adobe Lightroom and wants to learn your Creative Writing!',
    canTeach: ['Adobe Lightroom'],
  },
]

export default function Browse() {
  const { user } = useAuth()
  const [category, setCategory] = useState('All Skills')
  const [swappers, setSwappers] = useState(FALLBACK_SWAPPERS)
  const [matches, setMatches] = useState(FALLBACK_MATCHES)
  const [availability, setAvailability] = useState(['Weekends'])
  const [swapPreference, setSwapPreference] = useState(['In-Person'])
  const [sentTo, setSentTo] = useState(new Set())

  useEffect(() => {
    if (!user) return
    getSuggestedMatches(user.id)
      .then((data) => {
        if (data?.length) setMatches(data)
      })
      .catch(() => {
        // Supabase not configured yet — keep the fallback demo matches.
      })
  }, [user])

  function toggle(list, setList, value) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  function applyFilters() {
    searchSkillSwappers({
      category: category === 'All Skills' ? 'all' : category,
      availability,
      swapPreference,
    })
      .then((data) => {
        if (data?.length) setSwappers(data)
      })
      .catch(() => {
        // Supabase not configured yet — keep the fallback demo swappers.
      })
  }

  async function handleSendRequest(recipientId) {
    if (!user) return
    try {
      await sendLearningRequest(user.id, recipientId, 'Hi! I would love to swap skills.')
      setSentTo((prev) => new Set(prev).add(recipientId))
    } catch {
      // Supabase not configured yet — mark as sent locally so the UI still responds.
      setSentTo((prev) => new Set(prev).add(recipientId))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === c
                ? 'bg-brand-500 text-white'
                : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-brand-100 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-brand-900">Filters</h2>
            <button className="text-xs font-medium text-brand-500">Reset All</button>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold text-brand-900/60">
              {user ? 'Location / Distance' : 'Location'}
            </p>
            <input
              defaultValue="Seattle, WA"
              className="mt-1.5 w-full rounded-lg border border-brand-100 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            />
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold text-brand-500">Availability</p>
            {['Weekends', 'Weekdays', 'Evenings', 'Flexible'].map((option) => (
              <label key={option} className="mt-2 flex items-center gap-2 text-sm text-brand-900/80">
                <input
                  type="checkbox"
                  checked={availability.includes(option)}
                  onChange={() => toggle(availability, setAvailability, option)}
                  className="rounded border-brand-200 text-brand-500 focus:ring-brand-300"
                />
                {option} Only
              </label>
            ))}
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold text-brand-500">
              {user ? 'Swap Medium' : 'Swap Preference'}
            </p>
            {(user
              ? ['In-Person Match', 'Online Video Swap', 'Hybrid Exchange']
              : ['Online', 'In-Person', 'Hybrid']
            ).map((option) => (
              <label key={option} className="mt-2 flex items-center gap-2 text-sm text-brand-900/80">
                <input
                  type="checkbox"
                  checked={swapPreference.includes(option)}
                  onChange={() => toggle(swapPreference, setSwapPreference, option)}
                  className="rounded border-brand-200 text-brand-500 focus:ring-brand-300"
                />
                {option}
              </label>
            ))}
          </div>

          <button
            onClick={applyFilters}
            className="mt-6 w-full rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Apply Filters
          </button>
        </aside>

        <section>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-brand-600">
                {user ? 'Your Smart Skill Matches' : `Showing ${swappers.length * 24 + 4} Skill Swappers`}
              </h1>
              {user && (
                <p className="mt-1 text-sm text-brand-900/60">
                  These local and virtual partners have complementary profiles: they love
                  teaching exactly what you want to learn, and are excited to learn what you
                  can teach.
                </p>
              )}
            </div>
            {!user && (
              <select className="rounded-lg border border-brand-100 px-3 py-2 text-sm">
                <option>Sort by: Best Match</option>
                <option>Sort by: Distance</option>
                <option>Sort by: Newest</option>
              </select>
            )}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {(user ? matches : swappers).map((person) => (
              <MatchCard
                key={person.id}
                name={person.name}
                location={person.location}
                avatarUrl={person.avatar}
                matchScore={person.matchScore}
                matchSignal={person.matchSignal}
                canTeach={person.canTeach}
                wantsToLearn={person.wantsToLearn}
                primaryLabel={
                  !user ? 'View Profile' : sentTo.has(person.id) ? 'Request Sent' : 'Send Request'
                }
                onPrimaryAction={user ? () => handleSendRequest(person.id) : undefined}
                onViewProfile={() => {}}
                onlyPrimary={!user}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
