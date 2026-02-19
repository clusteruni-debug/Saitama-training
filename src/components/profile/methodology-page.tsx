import { useNavigate } from 'react-router-dom'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { LEVEL_UP_CRITERIA, VOLUME_CAP, TRACK_INFO, getExerciseForTrack } from '../../data/progression-data'
import type { TrackType } from '../../types'

export function MethodologyPage() {
  const navigate = useNavigate()
  const trackProgress = useTrainingStore((s) => s.trackProgress)
  const consecutiveEasy = useTrainingStore((s) => s.consecutiveEasy)
  const activeTracks = useTrainingStore((s) => s.activeTracks)
  const hasPullUpBar = useTrainingStore((s) => s.hasPullUpBar)

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      {/* 헤더 */}
      <header className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/profile')}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-[var(--color-text-secondary)]"
        >
          &larr;
        </button>
        <h1 className="text-xl font-black text-[var(--color-hero-yellow)]">
          운동 방법론
        </h1>
      </header>

      {/* 1. 프로그레시브 오버로드 */}
      <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
          프로그레시브 오버로드란?
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          근력/체력을 향상시키려면 몸에 <span className="text-[var(--color-hero-yellow)] font-medium">점진적으로 더 큰 부하</span>를
          주어야 합니다. 같은 운동을 같은 강도로 계속하면 몸이 적응해서 더 이상 발전하지 않아요.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-2">
          이 앱은 <span className="text-[var(--color-text-primary)] font-medium">3가지 축</span>으로 오버로드를 적용합니다:
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">볼륨</span>
            <span className="text-sm text-[var(--color-text-secondary)]">같은 동작, 횟수를 늘림 (10개 &rarr; 12개)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">속도</span>
            <span className="text-sm text-[var(--color-text-secondary)]">같은 횟수를 더 빠르게 (개인 기록 갱신)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">난이도</span>
            <span className="text-sm text-[var(--color-text-secondary)]">더 어려운 동작으로 진급 (푸시업 &rarr; 다이아몬드)</span>
          </div>
        </div>
      </section>

      {/* 2. RPE 자동조절 */}
      <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
          RPE 자동조절
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          운동 후 <span className="text-[var(--color-text-primary)] font-medium">"쉬웠다 / 적당했다 / 힘들었다"</span> 피드백에 따라
          다음 세션의 목표 횟수가 <span className="text-[var(--color-hero-yellow)] font-medium">비율 기반</span>으로 자동 조절됩니다.
        </p>

        <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
          <div className="grid grid-cols-3 text-center text-xs font-medium">
            <div className="bg-green-500/20 text-green-400 py-2">쉬웠다</div>
            <div className="bg-yellow-500/20 text-yellow-400 py-2">적당했다</div>
            <div className="bg-red-500/20 text-red-400 py-2">힘들었다</div>
          </div>
          <div className="grid grid-cols-3 text-center text-sm font-bold py-3 bg-white/5">
            <div className="text-green-400">+10%</div>
            <div className="text-yellow-400">+5%</div>
            <div className="text-red-400">-5%</div>
          </div>
        </div>

        <div className="mt-3 bg-white/5 rounded-xl p-3">
          <p className="text-xs text-[var(--color-text-secondary)]">
            <span className="text-[var(--color-text-primary)] font-medium">예시:</span> 현재 20개 &times; "쉬웠다" = 다음에 22개 (+10%)
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            현재 50개 &times; "쉬웠다" = 다음에 55개 (+10%)
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
            고정값(+3)이 아니라 비율이라서, 적은 횟수에서도 많은 횟수에서도 적절한 증가폭을 유지합니다.
          </p>
        </div>
      </section>

      {/* 3. 레벨업 기준 */}
      <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
          레벨업 기준
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
          각 트랙마다 <span className="text-[var(--color-text-primary)] font-medium">다른 레벨업 기준</span>이 적용됩니다.
          풀업 50개는 비현실적이지만, 푸시업 25개는 합리적이죠. 고난도 동작으로 갈수록 안전을 위해 더 많은 확인이 필요합니다.
        </p>

        {activeTracks.map((track) => {
          const progress = trackProgress[track]
          const info = TRACK_INFO[track]
          const criteria = LEVEL_UP_CRITERIA[track]?.[progress.currentLevel]
          const easyCount = consecutiveEasy[track] || 0
          const exercise = getExerciseForTrack(track, progress.currentLevel, hasPullUpBar)
          const nextExercise = progress.currentLevel < 5
            ? getExerciseForTrack(track, progress.currentLevel + 1, hasPullUpBar)
            : null

          return (
            <div key={track} className="mb-3 last:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{info.emoji}</span>
                <span className="text-sm font-bold text-[var(--color-text-primary)]">{info.label}</span>
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  Lv.{progress.currentLevel} {exercise.name}
                </span>
              </div>

              {criteria && nextExercise ? (
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-[var(--color-text-secondary)]">
                      다음: <span className="text-[var(--color-text-primary)] font-medium">{nextExercise.name}</span>
                    </span>
                  </div>
                  {/* 렙수 진행률 */}
                  <LevelUpProgressBar
                    label="렙수"
                    current={progress.currentReps}
                    target={criteria.minReps}
                    unit={track === 'run' ? '분' : (exercise.id === 'core-0' || exercise.id === 'pull-0' ? '초' : '개')}
                  />
                  {/* Easy 연속 진행률 */}
                  <LevelUpProgressBar
                    label="Easy 연속"
                    current={easyCount}
                    target={criteria.consecutiveEasy}
                    unit="회"
                  />
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-[var(--color-text-tertiary)]">최고 레벨 도달!</p>
                </div>
              )}
            </div>
          )
        })}
      </section>

      {/* 4. 볼륨 캡 */}
      <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
          볼륨 캡 (최대 렙수)
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
          각 레벨마다 <span className="text-[var(--color-hero-yellow)] font-medium">최대 렙수 제한</span>이 있습니다.
          50개 이상 푸시업을 반복하면 근력보다 <span className="text-[var(--color-text-primary)]">지구력 훈련</span>이 되어버려요.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
          캡에 가까워지면 <span className="text-[var(--color-text-primary)] font-medium">동작 난이도를 올리는 것</span>이 더 효과적입니다.
          이것이 프로그레시브 오버로드의 핵심이에요.
        </p>

        <div className="rounded-xl overflow-hidden border border-white/10">
          <div className="grid grid-cols-6 text-center text-[10px] font-medium bg-white/10 text-[var(--color-text-secondary)]">
            <div className="py-2">트랙</div>
            <div className="py-2">Lv0</div>
            <div className="py-2">Lv1</div>
            <div className="py-2">Lv2</div>
            <div className="py-2">Lv3</div>
            <div className="py-2">Lv4</div>
          </div>
          {(['push', 'squat', 'pull', 'core', 'run'] as TrackType[]).map((track) => (
            <div key={track} className="grid grid-cols-6 text-center text-xs border-t border-white/5">
              <div className="py-2 text-[var(--color-text-secondary)] font-medium">
                {TRACK_INFO[track].emoji}
              </div>
              {VOLUME_CAP[track].slice(0, 5).map((cap, i) => {
                const isCurrentLevel = trackProgress[track]?.currentLevel === i
                return (
                  <div
                    key={i}
                    className={`py-2 ${isCurrentLevel ? 'text-[var(--color-hero-yellow)] font-bold' : 'text-[var(--color-text-secondary)]'}`}
                  >
                    {cap}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[var(--color-text-tertiary)] mt-2 text-center">
          노란색 = 현재 레벨의 캡
        </p>
      </section>

      {/* 5. 디로드와 회복 */}
      <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
          디로드와 회복
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <span className="text-[var(--color-hero-yellow)] font-medium">3~4주마다</span> 볼륨을 50%로 줄이는
          "디로드 주간"이 필요합니다. 계속 강하게 밀면 과훈련으로 부상이나 정체가 와요.
        </p>
        <div className="mt-3 bg-white/5 rounded-xl p-3">
          <p className="text-xs font-medium text-[var(--color-text-primary)] mb-2">과훈련 증상:</p>
          <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
            <li>- 연속 "힘들었다" 3회 이상</li>
            <li>- 수행 능력 저하 (렙수가 계속 줄어듦)</li>
            <li>- 만성 피로, 수면 장애, 관절통</li>
          </ul>
        </div>
        <div className="mt-3 bg-white/5 rounded-xl p-3">
          <p className="text-xs font-medium text-[var(--color-text-primary)] mb-2">앱의 자동 감지:</p>
          <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
            <li>- 14일 이상 연속 + hard 비율 &gt; 30% &rarr; 디로드 권장</li>
            <li>- 최근 3세션 연속 hard &rarr; 과훈련 경고</li>
            <li>- 근육군별 회복 상태 표시 (24h/48h)</li>
          </ul>
        </div>
      </section>

      {/* 6. 스마트 휴식 시간 */}
      <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
          스마트 휴식 시간
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          세트 간 휴식 시간은 운동 강도에 따라 달라야 합니다. NSCA 가이드라인 기반으로 자동 추천해요.
        </p>
        <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
          <div className="grid grid-cols-3 text-center text-xs font-medium">
            <div className="bg-purple-500/20 text-purple-400 py-2">근력 (1-5회)</div>
            <div className="bg-blue-500/20 text-blue-400 py-2">근비대 (6-12회)</div>
            <div className="bg-green-500/20 text-green-400 py-2">근지구력 (13+회)</div>
          </div>
          <div className="grid grid-cols-3 text-center text-sm font-bold py-3 bg-white/5">
            <div className="text-purple-400">120초</div>
            <div className="text-blue-400">75초</div>
            <div className="text-green-400">45-60초</div>
          </div>
        </div>
        <p className="text-[10px] text-[var(--color-text-tertiary)] mt-2 text-center">
          &plusmn;15초 버튼으로 개인 체감에 맞게 조절 가능
        </p>
      </section>

      {/* 7. 워밍업의 중요성 */}
      <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
          워밍업의 중요성
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          본 운동 전 <span className="text-[var(--color-hero-yellow)] font-medium">50% 강도</span>로 가볍게 몸을 풀면:
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">부상 방지</span>
            <span className="text-sm text-[var(--color-text-secondary)]">근육과 관절이 준비됨 — 갑작스러운 부하 방지</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">퍼포먼스</span>
            <span className="text-sm text-[var(--color-text-secondary)]">체온 상승 + 혈류 증가 &rarr; 더 많은 렙수 가능</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">신경 활성</span>
            <span className="text-sm text-[var(--color-text-secondary)]">운동 패턴 리허설 &rarr; 정확한 폼 유지</span>
          </div>
        </div>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-3">
          앱에서 운동 시작 전 자동으로 워밍업 안내가 표시됩니다. 건너뛰기도 가능하지만, 가능하면 해주세요!
        </p>
      </section>

      {/* 8. 참고 문헌 */}
      <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
          참고 문헌
        </h2>
        <div className="flex flex-col gap-2">
          <Reference
            title="Schoenfeld et al. (2017)"
            desc="근비대를 위한 볼륨 증가: 주당 5-10% 증가 권장"
          />
          <Reference
            title="Helms et al. (2016)"
            desc="RPE 기반 자동조절 — 주관적 난이도로 훈련 부하 조절"
          />
          <Reference
            title="Schoenfeld & Grgic (2019)"
            desc="디로드 타이밍: 3~4주마다 볼륨 50% 감소 권장"
          />
          <Reference
            title="NSCA CSCS 가이드라인"
            desc="프로그레시브 오버로드 원칙 + 렙수별 최적 휴식 시간"
          />
          <Reference
            title="Convict Conditioning (Paul Wade)"
            desc="맨몸운동 프로그레션 — 동작별 마스터리 기준"
          />
        </div>
      </section>
    </div>
  )
}

// 레벨업 진행률 바 컴포넌트
function LevelUpProgressBar({ label, current, target, unit }: {
  label: string
  current: number
  target: number
  unit: string
}) {
  const pct = Math.min(100, Math.round((current / target) * 100))
  const met = current >= target

  return (
    <div className="mb-1.5 last:mb-0">
      <div className="flex justify-between text-[10px] mb-0.5">
        <span className="text-[var(--color-text-tertiary)]">{label}</span>
        <span className={met ? 'text-green-400 font-medium' : 'text-[var(--color-text-secondary)]'}>
          {current}/{target}{unit} {met && '\u2713'}
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${met ? 'bg-green-500' : 'bg-[var(--color-hero-yellow)]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// 참고 문헌 항목
function Reference({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <p className="text-xs font-medium text-[var(--color-text-primary)]">{title}</p>
      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">{desc}</p>
    </div>
  )
}
