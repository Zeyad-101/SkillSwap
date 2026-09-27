import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getProfile, updateProfile } from '../api/profiles.js'
import Button from '../components/Button.jsx'

const CATEGORIES = [
  'Music',
  'Art & Design',
  'Tech & Dev',
  'Languages',
  'Cooking',
  'Fitness',
  'Writing',
  'Crafts'
]

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  
  const [canTeach, setCanTeach] = useState([])
  const [customTeach, setCustomTeach] = useState('')
  
  const [wantsToLearn, setWantsToLearn] = useState([])
  const [customLearn, setCustomLearn] = useState('')
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getProfile(user.id).then(profile => {
      if (profile && (profile.can_teach_categories?.length > 0 || profile.wants_to_learn_categories?.length > 0)) {
        navigate('/dashboard', { replace: true })
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [user, navigate])

  function toggleTeach(skill) {
    setCanTeach(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])
  }
  
  function toggleLearn(skill) {
    setWantsToLearn(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])
  }

  function formatSkill(skill) {
    return skill.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
  }

  function handleAddCustomTeach() {
    const formatted = formatSkill(customTeach)
    if (formatted && !canTeach.some(s => s.toLowerCase() === formatted.toLowerCase())) {
      setCanTeach(prev => [...prev, formatted])
    }
    setCustomTeach('')
  }
  
  function handleAddCustomLearn() {
    const formatted = formatSkill(customLearn)
    if (formatted && !wantsToLearn.some(s => s.toLowerCase() === formatted.toLowerCase())) {
      setWantsToLearn(prev => [...prev, formatted])
    }
    setCustomLearn('')
  }

  async function handleFinish() {
    setLoading(true)
    try {
      await updateProfile(user.id, {
        can_teach_categories: canTeach,
        wants_to_learn_categories: wantsToLearn
      })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-10 text-center text-brand-900/60">Loading...</div>
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-card">
        {step === 1 ? (
          <div>
            <h1 className="text-3xl font-extrabold text-brand-900">What skills do you have?</h1>
            <p className="mt-2 text-brand-900/60">Select the skills you can teach or write your own.</p>
            
            <div className="mt-8 flex flex-wrap gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleTeach(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
                    canTeach.includes(cat)
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'bg-white border-brand-200 text-brand-700 hover:bg-brand-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {canTeach.filter(s => !CATEGORIES.includes(s)).map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleTeach(cat)}
                  className="rounded-full px-4 py-2 text-sm font-medium transition-colors border bg-brand-500 border-brand-500 text-white"
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <input
                value={customTeach}
                onChange={e => setCustomTeach(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCustomTeach()}
                placeholder="Other (e.g. Piano, Rust...)"
                className="min-h-[44px] flex-1 rounded-lg border border-brand-200 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <Button variant="secondary" onClick={handleAddCustomTeach}>Add</Button>
            </div>
            
            <div className="mt-10 flex justify-end">
              <Button onClick={() => setStep(2)}>Next</Button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-extrabold text-brand-900">What skills would you like to learn?</h1>
            <p className="mt-2 text-brand-900/60">Select the skills you want to learn from others.</p>
            
            <div className="mt-8 flex flex-wrap gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleLearn(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
                    wantsToLearn.includes(cat)
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : 'bg-white border-brand-200 text-brand-700 hover:bg-teal-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {wantsToLearn.filter(s => !CATEGORIES.includes(s)).map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleLearn(cat)}
                  className="rounded-full px-4 py-2 text-sm font-medium transition-colors border bg-teal-500 border-teal-500 text-white"
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <input
                value={customLearn}
                onChange={e => setCustomLearn(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCustomLearn()}
                placeholder="Other (e.g. Pottery, French...)"
                className="min-h-[44px] flex-1 rounded-lg border border-brand-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <Button variant="secondary" onClick={handleAddCustomLearn}>Add</Button>
            </div>
            
            <div className="mt-10 flex justify-between">
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleFinish}>Complete Setup</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
