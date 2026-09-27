const TONES = {
  teach: 'bg-brand-50 text-brand-600',
  learn: 'bg-teal-50 text-teal-600',
  neutral: 'bg-brand-50 text-brand-700',
}

export default function SkillTag({ label, tone = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${TONES[tone]}`}
    >
      {label}
    </span>
  )
}
