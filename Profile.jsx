import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile } from '../api/profiles.js'
import { sendLearningRequest } from '../api/matches.js'
import { useAuth } from '../context/AuthContext.jsx'
import SkillTag from '../components/SkillTag.jsx'
import Button from '../components/Button.jsx'

const FALLBACK_PROFILE = {
  name: 'Clara Vance',
  status: 'Online & In-Person',
  location: 'Seattle, Washington',
  memberSince: 'Oct 2024',
  avatar: 'https://i.pravatar.cc/150?img=47',
  banner:
    'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=1600&auto=format&fit=crop',
  about:
    "Hey fellow learners! I'm a professional photographer and UX designer based in Seattle. I love the beauty of captured film and clean user interfaces. When I'm not behind the lens or in front of Figma, you'll find me trying out new sourdough recipes. I'm excited to swap my digital media and photography expertise for someone who can teach me Spanish or intermediate guitar!",
  canTeach: ['Portrait Photography', 'Figma Layouts', 'Adobe Lightroom', 'Interaction Design'],
  wantsToLearn: ['Spanish Conversation', 'Acoustic Guitar', 'Creative Writing'],
  teachingGoal:
    'I want to help absolute beginners demystify manual camera settings (ISO, aperture, shutter speed) so they feel confident with any camera they hold.',
  learningGoal:
    "I'm planning a trip to South America next year, so my primary goal is basic conversational Spanish confidence, specifically talking about food, directions, and hotel bookings.",
  availability: [
    { day: 'Monday', time: '6:00 PM – 9:00 PM' },
    { day: 'Tuesday', time: 'Unavailable' },
    { day: 'Wednesday', time: '6:00 PM – 9:00 PM' },
    { day: 'Thursday', time: 'Unavailable' },
    { day: 'Friday', time: 'Unavailable' },
    { day: 'Saturday', time: '10:00 AM – 4:00 PM' },
    { day: 'Sunday', time: '12:00 PM – 6:00 PM' },
  ],
  interests: ['Film Photography', 'Baking', 'Hiking', 'Travel', 'Museums'],
}

export default function Profile() {
  const { userId } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(FALLBACK_PROFILE)
  const [requestSent, setRequestSent] = useState(false)

  useEffect(() => {
    getProfile(userId)
      .then((data) => data && setProfile(data))
      .catch(() => {
        // Supabase not configured yet — keep the fallback demo profile.
      })
  }, [userId])

  async function handleSendRequest() {
    if (!user) return
    try {
      await sendLearningRequest(user.id, userId, 'Hi! I would love to propose a skill swap.')
    } catch {
      // Supabase not configured yet — the button still reflects the action locally.
    }
    setRequestSent(true)
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="h-40 w-full overflow-hidden rounded-2xl">
        <img src={profile.banner} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="-mt-12 flex items-end gap-4 px-2">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="h-24 w-24 rounded-full border-4 border-white object-cover"
        />
        <div className="pb-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-brand-900">{profile.name}</h1>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600">
              {profile.status}
            </span>
          </div>
          <p className="text-sm text-brand-900/60">
            📍 {profile.location} · Member since {profile.memberSince}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-100 p-6">
            <h2 className="font-bold text-brand-600">About Me</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-900/80">{profile.about}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-100 p-6">
              <h2 className="flex items-center gap-2 font-bold text-brand-600">
                ✓ Skills I Can Teach
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.canTeach.map((skill) => (
                  <SkillTag key={skill} label={skill} tone="teach" />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-brand-100 p-6">
              <h2 className="flex items-center gap-2 font-bold text-brand-600">
                ⌕ Skills I Want to Learn
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.wantsToLearn.map((skill) => (
                  <SkillTag key={skill} label={skill} tone="learn" />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 p-6">
            <h2 className="font-bold text-brand-600">Exchange Goals</h2>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-500">
              Teaching Goals
            </p>
            <p className="mt-1 text-sm text-brand-900/80">{profile.teachingGoal}</p>
            <hr className="my-4 border-brand-100" />
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
              Learning Goals
            </p>
            <p className="mt-1 text-sm text-brand-900/80">{profile.learningGoal}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-100 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
              Interested in a Swap?
            </p>
            <h2 className="mt-1 font-bold text-brand-600">
              Connect with {profile.name.split(' ')[0]}
            </h2>
            <p className="mt-2 text-sm text-brand-900/70">
              Propose a mutual skill trade. It is completely free, and we'll protect your
              personal contact info until you decide to share it.
            </p>
            <Button className="mt-4 w-full" onClick={handleSendRequest} disabled={requestSent}>
              {requestSent ? 'Request Sent' : 'Send Learning Request'}
            </Button>
          </div>

          <div className="rounded-2xl border border-brand-100 p-6">
            <h2 className="font-bold text-brand-600">Availability & Preferences</h2>
            <div className="mt-3 space-y-2 text-sm">
              {profile.availability.map((slot) => (
                <div key={slot.day} className="flex justify-between">
                  <span className="text-brand-900/70">{slot.day}</span>
                  <span
                    className={
                      slot.time === 'Unavailable' ? 'text-brand-300' : 'font-medium text-teal-600'
                    }
                  >
                    {slot.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 p-6">
            <h2 className="font-bold text-brand-600">Interests & Hobbies</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <SkillTag key={interest} label={interest} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
