import { useEffect, useState } from 'react'
import type { HeroRank } from '../../types'
import { RankBadge } from './rank-badge'
import { Button } from '../ui/button'

interface RankUpModalProps {
  newRank: HeroRank
  onClose: () => void
}

const rankNames: Record<HeroRank, string> = {
  C: 'C급 히어로',
  B: 'B급 히어로',
  A: 'A급 히어로',
  S: 'S급 히어로',
}

const rankColors: Record<HeroRank, string> = {
  C: '#a3a3a3',
  B: '#60a5fa',
  A: '#ffc107',
  S: '#ef4444',
}

const rankMessages: Record<HeroRank, string> = {
  C: '히어로의 길이 시작되었다!',
  B: '본격적인 실력이 보이기 시작한다!',
  A: '이제 누구도 널 무시할 수 없다!',
  S: '원펀으로 끝내는 자, 사이타마!',
}

// 파티클 위치 랜덤 생성
function generateParticles(count: number, color: string) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
    const distance = 80 + Math.random() * 60
    return {
      id: i,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      color,
      delay: Math.random() * 0.3,
      size: 4 + Math.random() * 4,
    }
  })
}

export function RankUpModal({ newRank, onClose }: RankUpModalProps) {
  const [showBadge, setShowBadge] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const color = rankColors[newRank]
  const particles = generateParticles(16, color)

  useEffect(() => {
    const t1 = setTimeout(() => setShowBadge(true), 200)
    const t2 = setTimeout(() => setShowParticles(true), 400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[var(--color-bg-card)] rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in relative overflow-hidden">
        {/* 배경 글로우 */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${color}40 0%, transparent 70%)`,
          }}
        />

        {/* 텍스트 */}
        <p className="text-sm uppercase tracking-widest text-[var(--color-text-secondary)] mb-2 relative z-10">
          RANK UP
        </p>
        <h2
          className="text-3xl font-black mb-2 relative z-10"
          style={{ color }}
        >
          {rankNames[newRank]}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8 relative z-10">
          {rankMessages[newRank]}
        </p>

        {/* 배지 + 파티클 컨테이너 */}
        <div className="relative flex justify-center mb-8 h-32">
          {/* 파티클 */}
          {showParticles && particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
                left: '50%',
                top: '50%',
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
                animationDelay: `${p.delay}s`,
              } as React.CSSProperties}
            />
          ))}

          {/* 글로우 링 */}
          {showBadge && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full animate-glow-pulse"
              style={{ '--glow-color': color } as React.CSSProperties}
            />
          )}

          {/* 배지 */}
          {showBadge && (
            <div className="animate-rank-up-spin relative z-10 flex items-center justify-center h-full">
              <RankBadge rank={newRank} size="lg" />
            </div>
          )}
        </div>

        <Button onClick={onClose} size="lg" className="w-full relative z-10">
          계속하기
        </Button>
      </div>
    </div>
  )
}
