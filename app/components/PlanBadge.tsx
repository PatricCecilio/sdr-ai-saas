type PlanBadgeProps = {
  isPro: boolean;
};

export default function PlanBadge({ isPro }: PlanBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide border ${
        isPro
          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
          : "border-zinc-600 bg-zinc-700/50 text-zinc-300"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isPro ? "bg-emerald-400" : "bg-zinc-400"
        }`}
      />
      {isPro ? "PRO" : "FREE"}
    </span>
  );
}