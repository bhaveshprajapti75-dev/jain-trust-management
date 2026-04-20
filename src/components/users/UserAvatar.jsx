function getInitials(name) {
  return String(name || 'User')
    .split(' ')
    .map(function(part) { return part[0] || '' })
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function UserAvatar({ user, size = 'md', className = '', preferImage = false }) {
  const sizeClass = size === 'lg' ? 'w-16 h-16' : size === 'sm' ? 'w-10 h-10' : 'w-12 h-12'

  if (preferImage && user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user?.name || 'User'}
        className={`${sizeClass} rounded-full object-cover border border-slate-200 shadow-sm bg-slate-100 ${className}`}
      />
    )
  }

  return (
    <div className={`${sizeClass} rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shadow-sm shadow-emerald-600/20 ${className}`}>
      {getInitials(user?.name)}
    </div>
  )
}
