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

export default function Homepage() {
  const [skills, setSkills] = useState([])

  useEffect(() => {
    let isMounted = true
    getFeaturedSkills()
      .then((data) => {
        if (isMounted && data?.length) setSkills(data)
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div>
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
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
              alt="People enthusiastically learning and collaborating around a laptop"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

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

      {skills.length > 0 && (
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
      )}

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

