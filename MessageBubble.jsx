export default function MessageBubble({ body, isOwn, timestamp, avatarUrl }) {
  if (isOwn) {
    return (
      <div className="flex justify-end">
        <div className="max-w-md rounded-2xl rounded-tr-sm bg-brand-500 px-4 py-3 text-sm text-white">
          <p>{body}</p>
          <p className="mt-1 text-right text-[11px] text-white/70">{timestamp}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2">
      {avatarUrl && (
        <img src={avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
      )}
      <div className="max-w-md rounded-2xl rounded-tl-sm bg-brand-50 px-4 py-3 text-sm text-brand-900">
        <p>{body}</p>
        <p className="mt-1 text-[11px] text-brand-900/50">{timestamp}</p>
      </div>
    </div>
  )
}
