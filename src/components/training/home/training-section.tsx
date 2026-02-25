import type { TrackType } from '../../../types'
import { TRACK_INFO } from '../../../data/progression-data'
import { TrackCard } from '../track-card'

const ALL_TRACKS: TrackType[] = ['push', 'squat', 'pull', 'core', 'run']

interface TrainingSectionProps {
  activeTracks: TrackType[]
  toggleActiveTrack: (track: TrackType) => void
}

export function TrainingSection({ activeTracks, toggleActiveTrack }: TrainingSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider font-medium">
          오늘의 트레이닝
        </h2>
      </div>

      {/* 트랙 토글 칩 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {ALL_TRACKS.map((track) => {
          const info = TRACK_INFO[track]
          const isActive = activeTracks.includes(track)
          return (
            <button
              key={track}
              onClick={() => toggleActiveTrack(track)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white/15 text-[var(--color-text-primary)]'
                  : 'bg-white/5 text-[var(--color-text-secondary)] opacity-50'
              }`}
            >
              <span>{info.emoji}</span>
              <span>{info.label}</span>
            </button>
          )
        })}
      </div>

      {/* 활성 트랙 카드 */}
      <div className="flex flex-col gap-3">
        {activeTracks.map((track) => (
          <TrackCard key={track} track={track} />
        ))}
      </div>
    </section>
  )
}
