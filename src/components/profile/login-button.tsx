import { useAuthStore } from '../../stores/useAuthStore'
import { loginWithGoogle, logout } from '../../hooks/use-firebase-sync'
import { Button } from '../ui/button'

export function LoginButton() {
  const user = useAuthStore((s) => s.user)

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt=""
            className="w-10 h-10 rounded-full"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
            {user.displayName}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] truncate">
            {user.email}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          로그아웃
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={loginWithGoogle} variant="secondary" className="w-full">
      Google로 로그인
    </Button>
  )
}
