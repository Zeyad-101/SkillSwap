import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Button from './Button.jsx'
import icon from '../assets/logo/icon.png'
import { useState, useEffect } from 'react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Explore Matches' },
  { to: '/how-it-works', label: 'How It Works' },
]

export default function NavBar() {
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="border-b border-brand-100 bg-white shadow-sm relative z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <img src={icon} alt="SkillSwap" className="h-12 sm:h-16 md:h-20 w-auto object-contain drop-shadow-sm" />
          <span className="text-lg sm:text-xl font-extrabold text-brand-600">SkillSwap</span>
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

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-brand-900 hover:text-brand-500">
                Dashboard
              </Link>
              <Link to={`/profile/${user.id}`} className="text-sm font-medium text-brand-900 hover:text-brand-500">
                Profile
              </Link>
              <Button size="sm" variant="secondary" onClick={signOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-brand-900 hover:text-brand-500">
                Sign In
              </Link>
              <Button as={Link} to="/login" size="sm">
                Get Started
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 border border-brand-200 rounded-md bg-white text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-brand-100 shadow-lg py-4 px-4 flex flex-col gap-4">
          <nav className="flex flex-col gap-3 text-base font-medium text-brand-900">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block px-2 py-1 ${isActive ? 'text-brand-500 font-bold' : 'text-brand-900 hover:text-brand-500'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <span className="block px-2 py-1 cursor-default text-brand-900/50">Community</span>
          </nav>
          
          <div className="h-px w-full bg-brand-100 my-2"></div>
          
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="block px-2 py-1 text-base font-medium text-brand-900 hover:text-brand-500">
                  Dashboard
                </Link>
                <Link to={`/profile/${user.id}`} className="block px-2 py-1 text-base font-medium text-brand-900 hover:text-brand-500">
                  Profile
                </Link>
                <Button className="w-full justify-center mt-2" variant="secondary" onClick={() => {
                  signOut()
                  setIsMobileMenuOpen(false)
                }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-2 py-1 text-base font-medium text-brand-900 hover:text-brand-500">
                  Sign In
                </Link>
                <Button className="w-full justify-center mt-2" as={Link} to="/login">
                  Get Started Free
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
