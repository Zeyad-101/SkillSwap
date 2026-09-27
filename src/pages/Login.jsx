import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getProfile } from '../api/profiles.js'
import Button from '../components/Button.jsx'
import logo from '../assets/logo/logo.png'

export default function Login() {
  const { signInWithPassword, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = location.state?.from?.pathname ?? '/dashboard'

  async function goAfterLogin(userId) {
    try {
      const profile = await getProfile(userId)
      const hasOnboarded = profile?.can_teach_categories?.length > 0 || profile?.wants_to_learn_categories?.length > 0
      navigate(hasOnboarded ? redirectTo : '/onboarding', { replace: true })
    } catch {
      navigate('/onboarding', { replace: true })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { user } = await signInWithPassword(email, password)
      await goAfterLogin(user.id)
    } catch (err) {
      setError(err.message ?? 'Could not sign in. Check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <img src={logo} alt="SkillSwap" className="mb-4 h-10 w-10" />
      <h1 className="text-3xl font-extrabold text-brand-600">Welcome back</h1>
      <p className="mt-2 text-sm text-brand-900/60">Sign in to reach your matches and messages.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-brand-900">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-[44px] mt-1 w-full rounded-xl border border-brand-100 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-brand-900">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-[44px] mt-1 w-full rounded-xl border border-brand-100 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Signing in…' : 'Sign In'}
        </Button>
        <div className="relative mt-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-brand-500">Or</span>
          </div>
        </div>
        <Button 
          type="button" 
          variant="secondary" 
          className="w-full"
          onClick={async () => {
            try {
              await signInWithGoogle()
            } catch (err) {
              setError(err.message ?? 'Could not sign in with Google.')
            }
          }}
        >
          Sign in with Google
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-900/60">
        New to SkillSwap?{' '}
        <Link to="/browse" className="font-semibold text-brand-500">
          Browse matches first
        </Link>
      </p>
    </div>
  )
}
