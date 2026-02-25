interface ReferenceItemProps {
  title: string
  desc: string
}

export function ReferenceItem({ title, desc }: ReferenceItemProps) {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <p className="text-xs font-medium text-[var(--color-text-primary)]">{title}</p>
      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">{desc}</p>
    </div>
  )
}
