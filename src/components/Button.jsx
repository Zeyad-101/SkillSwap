const VARIANTS = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 shadow-sm',
  secondary:
    'bg-white text-brand-900 border border-brand-200 hover:bg-brand-50',
  ghost: 'text-brand-700 hover:bg-brand-50',
}

const SIZES = {
  md: 'px-5 py-2.5 min-h-[44px] text-sm',
  lg: 'px-6 py-3 min-h-[44px] text-base',
  sm: 'px-4 py-2 min-h-[44px] text-sm',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Component = 'button',
  className = '',
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
