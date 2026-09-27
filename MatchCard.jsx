import SkillTag from './SkillTag.jsx'
import Button from './Button.jsx'

export default function MatchCard({
  name,
  location,
  avatarUrl,
  matchScore,
  canTeach = [],
  wantsToLearn = [],
  matchSignal,
  primaryLabel = 'Send Request',
  onPrimaryAction,
  onViewProfile,
  onlyPrimary = false,
}) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt={name}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-brand-900">{name}</p>
            <p className="text-xs text-brand-900/60">{location}</p>
          </div>
        </div>
        {matchScore && (
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-600">
            {matchScore}
          </span>
        )}
      </div>

      {matchSignal && (
        <p className="mt-3 text-xs font-medium text-brand-500">{matchSignal}</p>
      )}

      {canTeach.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-brand-900/60">Can Teach:</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {canTeach.map((skill) => (
              <SkillTag key={skill} label={skill} tone="teach" />
            ))}
          </div>
        </div>
      )}

      {wantsToLearn.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-brand-900/60">Wants to Learn:</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {wantsToLearn.map((skill) => (
              <SkillTag key={skill} label={skill} tone="learn" />
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <Button size="sm" className="flex-1" onClick={onPrimaryAction}>
          {primaryLabel}
        </Button>
        {!onlyPrimary && (
          <Button size="sm" variant="secondary" className="flex-1" onClick={onViewProfile}>
            View Profile
          </Button>
        )}
      </div>
    </div>
  )
}
