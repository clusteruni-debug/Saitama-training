import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', label: '홈', icon: '⚡' },
  { path: '/progression', label: '트리', icon: '🌳' },
  { path: '/stats', label: '통계', icon: '📊' },
  { path: '/profile', label: '프로필', icon: '👤' },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  // 운동 실행 화면에서는 탭바 숨김
  if (location.pathname.startsWith('/workout')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg-card)] border-t border-white/10 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(tab.path)

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-colors ${
                isActive
                  ? 'text-[var(--color-hero-yellow)]'
                  : 'text-[var(--color-text-secondary)]'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
