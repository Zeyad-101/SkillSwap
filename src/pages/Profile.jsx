import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile, updateProfile } from '../api/profiles.js'
import { useAuth } from '../context/AuthContext.jsx'
import SkillTag from '../components/SkillTag.jsx'
import Button from '../components/Button.jsx'

const FALLBACK_PROFILE = null

export default function Profile() {
  const { userId } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(null)
  
  const isOwnProfile = user?.id === userId

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile(userId)
      .then((data) => {
        if (data) {
          const mapped = {
            name: data.name || 'User',
            status: 'Active',
            location: data.location || 'Unknown Location',
            memberSince: data.created_at ? new Date(data.created_at).getFullYear() : '2024',
            avatar: data.avatar_url || 'https://i.pravatar.cc/150',
            banner: 'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=1600&auto=format&fit=crop',
            about: data.about || 'No bio provided.',
            canTeach: data.can_teach_categories || [],
            wantsToLearn: data.wants_to_learn_categories || []
          }
          setProfile(mapped)
          setEditForm(mapped)
        } else {
          setProfile(null)
          setEditForm(null)
        }
      })
      .catch(() => {
        setProfile(null)
        setEditForm(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [userId])

  async function handleSaveProfile() {
    if (!isOwnProfile) return
    try {
      await updateProfile(user.id, {
        name: editForm.name,
        avatar_url: editForm.avatar,
        about: editForm.about,
        can_teach_categories: editForm.canTeach,
        wants_to_learn_categories: editForm.wantsToLearn
      })
    } catch {}
    setProfile(editForm)
    setIsEditing(false)
  }

  if (loading) {
    return <div className="p-10 text-center text-brand-900/50">Loading profile...</div>
  }

  if (!profile) {
    return <div className="p-10 text-center text-brand-900/50">Profile not found.</div>
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="h-40 w-full overflow-hidden rounded-2xl">
        <img src={profile.banner} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="-mt-12 flex items-end gap-4 px-2">
        <img
          src={isEditing ? editForm.avatar : profile.avatar}
          alt={isEditing ? editForm.name : profile.name}
          className="h-24 w-24 rounded-full border-4 border-white object-cover"
        />
        <div className="pb-1 w-full max-w-sm">
          {isEditing ? (
            <div className="space-y-2">
              <input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="min-h-[44px] w-full rounded-lg border border-brand-200 px-3 py-1.5 text-lg font-bold focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Your Name"
              />
              <input
                value={editForm.avatar}
                onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                className="min-h-[44px] w-full rounded-lg border border-brand-200 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Avatar URL"
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-brand-900">{profile.name}</h1>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600">
                  {profile.status}
                </span>
              </div>
              <p className="text-sm text-brand-900/60">
                📍 {profile.location} · Member since {profile.memberSince}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-6 max-w-4xl">
          <div className="rounded-2xl border border-brand-100 p-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-brand-600">About Me</h2>
              {isOwnProfile && !isEditing && <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>Edit Profile</Button>}
              {isEditing && <Button size="sm" onClick={handleSaveProfile}>Save Changes</Button>}
            </div>
            {isEditing ? (
              <textarea
                value={editForm?.about || ''}
                onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                className="mt-4 w-full rounded-lg border border-brand-200 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                rows={4}
              />
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-brand-900/80">{profile.about}</p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-100 p-6">
              <h2 className="flex items-center gap-2 font-bold text-brand-600">
                ✓ Skills I Can Teach
              </h2>
              {isEditing ? (
                <input
                  value={editForm?.canTeach?.join(', ') || ''}
                  onChange={(e) => setEditForm({ ...editForm, canTeach: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="min-h-[44px] mt-3 w-full rounded-lg border border-brand-200 p-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Comma separated skills..."
                />
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.canTeach.map((skill) => (
                    <SkillTag key={skill} label={skill} tone="teach" />
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-brand-100 p-6">
              <h2 className="flex items-center gap-2 font-bold text-brand-600">
                ⌕ Skills I Want to Learn
              </h2>
              {isEditing ? (
                <input
                  value={editForm?.wantsToLearn?.join(', ') || ''}
                  onChange={(e) => setEditForm({ ...editForm, wantsToLearn: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="min-h-[44px] mt-3 w-full rounded-lg border border-brand-200 p-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Comma separated skills..."
                />
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.wantsToLearn.map((skill) => (
                    <SkillTag key={skill} label={skill} tone="learn" />
                  ))}
                </div>
              )}
            </div>
          </div>

      </div>
    </div>
  )
}
