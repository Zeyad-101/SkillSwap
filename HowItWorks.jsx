import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'

const STEPS = [
  {
    title: 'Share your skills',
    body: 'Tell us what you can teach — a hobby, a craft, a language, a professional skill. There is no such thing as too niche.',
  },
  {
    title: 'Find a complementary match',
    body: 'Our matching engine looks for people who want exactly what you teach, and who teach exactly what you want to learn.',
  },
  {
    title: 'Learn & grow together',
    body: 'Message your match, agree on a time, and swap knowledge over a call or in person. No fees, ever.',
  },
]

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-extrabold text-brand-600">How SkillSwap works</h1>
      <p className="mt-3 max-w-xl text-brand-900/70">
        SkillSwap pairs people who each have something the other wants to learn. No money
        changes hands — just time, patience, and a genuine trade of knowledge.
      </p>

      <div className="mt-12 space-y-8">
        {STEPS.map((step, index) => (
          <div key={step.title} className="flex gap-5">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
              {index + 1}
            </span>
            <div>
              <h2 className="font-bold text-brand-600">{step.title}</h2>
              <p className="mt-1 text-sm text-brand-900/70">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl bg-brand-50 p-8 text-center">
        <h2 className="text-2xl font-extrabold text-brand-600">Ready to find your match?</h2>
        <Button as={Link} to="/browse" size="lg" className="mt-5">
          Explore Matches
        </Button>
      </div>
    </div>
  )
}
