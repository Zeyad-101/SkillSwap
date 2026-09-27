import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Button from './Button.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Explore Matches' },
  { to: '/how-it-works', label: 'How It Works' },
]

export default function NavBar() {
  const { user } = useAuth()

  return (
    <header className="border-b border-brand-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-lg">
            🧶
          </span>
          <span className="text-lg font-extrabold text-brand-600">SkillSwap</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-brand-900 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'text-brand-500' : 'text-brand-900 hover:text-brand-500'
              }
            >
              {link.label}
            </NavLink>
          ))}
          <span className="cursor-default text-brand-900/50">Community</span>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link to={`/profile/${user.id}`} className="text-sm font-medium text-brand-900">
              {user.email}
            </Link>
          ) : (
            <Link to="/login" className="text-sm font-medium text-brand-900 hover:text-brand-500">
              Sign In
            </Link>
          )}
          <Button as={Link} to="/login" size="sm">
            Get Started Free
          </Button>
        </div>
      </div>
    </header>
  )
}
