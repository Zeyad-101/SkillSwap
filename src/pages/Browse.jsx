import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { searchSkillSwappers } from '../api/skills.js'
import { getSuggestedMatches } from '../api/matches.js'
import MatchCard from '../components/MatchCard.jsx'

import { useNavigate } from 'react-router-dom'

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

export default function Browse() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [category, setCategory] = useState('All Skills')
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [swappers, setSwappers] = useState([])
  const [matches, setMatches] = useState([])

  useEffect(() => {
    if (user) {
      getSuggestedMatches(user.id)
        .then((data) => {
          if (data?.length) {
            setMatches(data.map(m => ({
              id: m.id,
              name: m.matched_profile?.name || 'User',
              location: m.matched_profile?.location || 'Unknown Location',
              avatar: m.matched_profile?.avatar_url || 'https://i.pravatar.cc/150',
              matchScore: `${Math.round((m.match_score || 0) * 100)}% Match`,
              matchSignal: m.match_signal || '',
              canTeach: m.matched_profile?.can_teach_categories || [],
              wantsToLearn: m.matched_profile?.wants_to_learn_categories || []
            })))
          }
        })
        .catch(() => {})
    }
    applyFilters()
  }, [user, category])

  function applyFilters() {
    searchSkillSwappers({
      category: category === 'All Skills' ? 'all' : category,
      searchQuery,
    })
      .then((data) => {
        if (data) {
          setSwappers(data.map(p => ({
            id: p.id,
            name: p.name || 'User',
            location: p.location || 'Unknown Location',
            avatar: p.avatar_url || 'https://i.pravatar.cc/150',
            canTeach: p.can_teach_categories || [],
            wantsToLearn: p.wants_to_learn_categories || []
          })))
        }
      })
      .catch(() => {})
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex max-w-md items-center gap-2">
        <input
          type="text"
          placeholder="Search skills, people, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          className="flex-1 rounded-full border border-brand-200 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <button
          onClick={applyFilters}
          className="min-h-[44px] rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Search
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`min-h-[44px] rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
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
            <button className="min-h-[44px] px-2 text-xs font-medium text-brand-500">Reset All</button>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold text-brand-900/60">Location</p>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="min-h-[44px] mt-1.5 w-full rounded-lg border border-brand-100 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            >
              <option value="">All of Egypt</option>
              <option>Cairo</option>
              <option>Giza</option>
              <option>Alexandria</option>
              <option>Sharm El-Sheikh</option>
              <option>Hurghada</option>
              <option>Luxor</option>
              <option>Aswan</option>
              <option>Mansoura</option>
              <option>Tanta</option>
              <option>Zagazig</option>
              <option>Ismailia</option>
              <option>Suez</option>
              <option>Port Said</option>
              <option>Damietta</option>
              <option>Minya</option>
              <option>Sohag</option>
              <option>Qena</option>
              <option>Beni Suef</option>
              <option>Fayoum</option>
              <option>Asyut</option>
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="min-h-[44px] mt-6 w-full rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Apply Filters
          </button>
        </aside>

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-brand-600">
                {user ? 'Your Smart Skill Matches' : `Showing ${swappers.length} Skill Swappers`}
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
                primaryLabel="View Profile"
                onPrimaryAction={() => navigate(`/profile/${person.matched_user_id || person.id}`)}
                onlyPrimary={true}
              />
            ))}
            {(user ? matches : swappers).length === 0 && (
              <p className="text-sm text-brand-900/50">No results found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
