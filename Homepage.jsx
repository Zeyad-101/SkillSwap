import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { getFeaturedSkills } from '../api/skills.js'

const STEPS = [
  {
    number: 1,
    icon: '✎',
    title: 'Share your skills',
    body: 'List hobbies, arts, languages or professional skills you love sharing with others.',
  },
  {
    number: 2,
    icon: '⇄',
    title: 'Find a complementary match',
    body: 'Our friendly matching engine introduces you to peers who want to learn your skill and teach yours.',
  },
  {
    number: 3,
    icon: '📖',
    title: 'Learn & grow together',
    body: 'Connect safely over coffee or video call for structured, friendly 1-on-1 knowledge swaps.',
  },
]

const FALLBACK_SKILLS = [
  {
    id: 'acoustic-guitar',
    category: 'Music',
    title: 'Acoustic Guitar',
    image:
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'portrait-photography',
    category: 'Art',
    title: 'Portrait Photography',
    image:
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'react-ui-coding',
    category: 'Tech',
    title: 'React & UI Coding',
    image:
      'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'sourdough-baking',
    category: 'Cooking',
    title: 'Sourdough Baking',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'spanish-conversation',
    category: 'Languages',
    title: 'Spanish Conversation',
    image:
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'digital-illustration',
    category: 'Art',
    title: 'Digital Illustration',
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop',
  },
]

export default function Homepage() {
  const [skills, setSkills] = useState(FALLBACK_SKILLS)

  useEffect(() => {
    let isMounted = true
    getFeaturedSkills()
      .then((data) => {
        if (isMounted && data?.length) setSkills(data)
      })
      .catch(() => {
        // Supabase not configured yet — keep the fallback demo skills.
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-50">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-500">
              <span>✦</span> Meet your next creative hobby partner
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight text-brand-900">
              Your skills. <span className="text-brand-400">Their hobbies.</span> A bigger you.
            </h1>
            <p className="mt-5 max-w-md text-brand-900/70">
              Share what you know. Learn what you love. Join a friendly community where
              trading knowledge is the currency of connection. No fees, no algorithms — just
              real people helping each other grow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/browse" size="lg">
                Find Your Match Now
              </Button>
              <Button as={Link} to="/how-it-works" variant="secondary" size="lg">
                Explore Skills
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop"
              alt="A small group learning crafts together around a table"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3 steps */}
      <section className="bg-brand-50 py-16">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white px-8 py-14 shadow-card">
          <h2 className="text-center text-3xl font-extrabold text-brand-600">
            Learning together in 3 simple steps
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-brand-900/60">
            Getting matched with a complementary learning partner is fast, secure, and
            entirely designed around constructive peer growth.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number} className="rounded-2xl bg-brand-50 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    {step.number}
                  </span>
                  <span className="text-lg text-brand-400">{step.icon}</span>
                </div>
                <h3 className="mt-4 font-bold text-brand-600">{step.title}</h3>
                <p className="mt-2 text-sm text-brand-900/70">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore skills */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-extrabold text-brand-600">What do you want to learn next?</h2>
        <p className="mt-2 text-sm text-brand-900/60">
          Explore some of the most popular classes and knowledge swaps happening right now near you.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Link
              key={skill.id}
              to="/browse"
              className="overflow-hidden rounded-2xl border border-brand-100 shadow-card transition-transform hover:-translate-y-0.5"
            >
              <img src={skill.image} alt={skill.title} className="h-40 w-full object-cover" />
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-900/50">
                  {skill.category}
                </p>
                <p className="mt-1 font-bold text-brand-600">{skill.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How skill match works */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-center text-3xl font-extrabold text-brand-600">How Skill Match Works</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-brand-900/60">
          Our smart discovery network pairs users with complementary needs. One person's
          passion becomes another person's breakthrough.
        </p>
        <div className="mt-10 flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <MatchPreviewCard
            name="Sofia Chen"
            location="Vancouver, BC"
            canTeach="Spanish"
            wantsToLearn="Photography"
            avatar="https://i.pravatar.cc/150?img=32"
          />
          <div className="flex flex-col items-center text-brand-500">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-white">
              ♥
            </span>
            <span className="mt-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              Perfect Exchange Match!
            </span>
          </div>
          <MatchPreviewCard
            name="Marcus Brody"
            location="Vancouver, BC"
            canTeach="Photography"
            wantsToLearn="Spanish"
            avatar="https://i.pravatar.cc/150?img=51"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-50 py-16 text-center">
        <p className="text-2xl text-brand-400">☆</p>
        <h2 className="mt-2 text-3xl font-extrabold text-brand-600">Start trading skills today</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-brand-900/60">
          Unlock new talents, make authentic local connections, and discover how rewarding
          community learning can be.
        </p>
        <Button as={Link} to="/login" size="lg" className="mt-6">
          Create Your Free Profile
        </Button>
      </section>
    </div>
  )
}

function MatchPreviewCard({ name, location, canTeach, wantsToLearn, avatar }) {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-brand-100 bg-white p-5 text-left shadow-card">
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-brand-900">{name}</p>
          <p className="text-xs text-brand-900/50">{location}</p>
        </div>
      </div>
      <hr className="my-3 border-brand-100" />
      <p className="text-xs text-brand-900/50">Can Teach:</p>
      <p className="mt-1 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600">
        {canTeach}
      </p>
      <p className="mt-3 text-xs text-brand-900/50">Wants to Learn:</p>
      <p className="mt-1 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600">
        {wantsToLearn}
      </p>
    </div>
  )
}
