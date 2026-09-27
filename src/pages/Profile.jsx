import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfile, updateProfile, deleteProfile } from '../api/profiles.js'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'
import SkillTag from '../components/SkillTag.jsx'
import Button from '../components/Button.jsx'

const FALLBACK_PROFILE = null

export default function Profile() {
  const { userId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const fileInputRef = useRef(null)
  
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

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setAvatarUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      setEditForm(prev => ({ ...prev, avatar: data.publicUrl }))
    } catch (err) {
      console.error('Avatar upload failed:', err)
    } finally {
      setAvatarUploading(false)
    }
  }

  async function handleDeleteProfile() {
    if (!isOwnProfile) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteProfile(user.id)
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Delete failed:', err)
      setDeleteError(err.message ?? 'Delete failed. Check console for details.')
      setDeleting(false)
    }
  }

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
        <div className="relative h-24 w-24 shrink-0">
          <img
            src={isEditing ? editForm.avatar : profile.avatar}
            alt={isEditing ? editForm.name : profile.name}
            className="h-24 w-24 rounded-full border-4 border-white object-cover"
          />
          {isEditing && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white text-xs font-semibold opacity-0 hover:opacity-100 transition-opacity disabled:opacity-100"
              >
                {avatarUploading ? '...' : '📷 Change'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </>
          )}
        </div>
        <div className="pb-1 w-full max-w-sm">
          {isEditing ? (
            <div className="space-y-2">
              <input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="min-h-[44px] w-full rounded-lg border border-brand-200 px-3 py-1.5 text-lg font-bold focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Your Name"
              />
              {avatarUploading && (
                <p className="text-xs text-brand-500">Uploading photo...</p>
              )}
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
              <div className="flex items-center gap-2">
                {isOwnProfile && !isEditing && (
                  <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
                {isEditing && (
                  <Button size="sm" onClick={handleSaveProfile}>Save Changes</Button>
                )}
                {isOwnProfile && !isEditing && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="min-h-[36px] rounded-lg border border-red-200 px-3 py-1 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    Delete Profile
                  </button>
                )}
              </div>
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

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-brand-900">Delete Profile?</h2>
            <p className="mt-2 text-sm text-brand-900/70">
              This will erase all your profile data and sign you out. This action <strong>cannot be undone</strong>.
            </p>
            {deleteError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{deleteError}</p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="min-h-[44px] rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                disabled={deleting}
                className="min-h-[44px] rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
