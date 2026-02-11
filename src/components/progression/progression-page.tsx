import type { TrackType } from '../../types'
import { TrackTree } from './track-tree'

const TRACKS: TrackType[] = ['push', 'squat', 'pull', 'core']

export function ProgressionPage() {
  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-black text-[var(--color-hero-yellow)]">
          프로그레션 트리
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          각 트랙의 레벨을 올려 사이타마에 도달하라
        </p>
      </header>

      {TRACKS.map((track) => (
        <TrackTree key={track} track={track} />
      ))}
    </div>
  )
}
