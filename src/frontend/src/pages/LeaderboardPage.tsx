import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, Recycle, Trophy } from "lucide-react";
import { useLeaderboard } from "../hooks/useQueries";

const BADGE_DATA = [
  { bottles: 1, emoji: "🌱", name: "Eco Beginner" },
  { bottles: 10, emoji: "♻️", name: "Recycling Champion" },
  { bottles: 50, emoji: "🌍", name: "Planet Protector" },
];

function getUserBadges(bottles: bigint) {
  const n = Number(bottles);
  return BADGE_DATA.filter((b) => b.bottles <= n);
}

function getRankBadge(rank: number) {
  if (rank === 1) return { emoji: "🥇", color: "text-yellow-400" };
  if (rank === 2) return { emoji: "🥈", color: "text-slate-300" };
  if (rank === 3) return { emoji: "🥉", color: "text-amber-600" };
  return { emoji: `#${rank}`, color: "text-muted-foreground" };
}

export function LeaderboardPage() {
  const { data: leaders, isLoading } = useLeaderboard();

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-yellow-400 mb-4">
          <Trophy className="w-3.5 h-3.5" />
          Global Rankings
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
          Eco <span className="text-gradient-green">Leaderboard</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Top recyclers making the biggest impact. Every bottle counts toward
          your rank.
        </p>
      </div>

      {/* Top 3 podium */}
      {!isLoading && leaders && leaders.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div
            className="glass rounded-2xl p-5 text-center flex flex-col items-center justify-end"
            style={{ minHeight: 180 }}
          >
            <div className="text-3xl mb-2">🥈</div>
            <div className="font-display font-bold text-lg truncate w-full text-center">
              {leaders[1]?.displayName}
            </div>
            <div className="text-slate-300 font-display text-xl font-black">
              {leaders[1]?.rewardPoints.toString()}
            </div>
            <div className="text-muted-foreground text-xs">points</div>
          </div>
          <div
            className="glass rounded-2xl p-5 text-center flex flex-col items-center justify-end glow-green border-primary/30"
            style={{ minHeight: 220 }}
          >
            <div className="text-4xl mb-2">🥇</div>
            <div className="font-display font-bold text-xl truncate w-full text-center">
              {leaders[0]?.displayName}
            </div>
            <div className="text-primary font-display text-2xl font-black">
              {leaders[0]?.rewardPoints.toString()}
            </div>
            <div className="text-muted-foreground text-xs">points</div>
          </div>
          <div
            className="glass rounded-2xl p-5 text-center flex flex-col items-center justify-end"
            style={{ minHeight: 160 }}
          >
            <div className="text-3xl mb-2">🥉</div>
            <div className="font-display font-bold text-lg truncate w-full text-center">
              {leaders[2]?.displayName}
            </div>
            <div className="text-amber-600 font-display text-xl font-black">
              {leaders[2]?.rewardPoints.toString()}
            </div>
            <div className="text-muted-foreground text-xs">points</div>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4" data-ocid="leaderboard.loading_state">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="w-16 h-4" />
              </div>
            ))}
          </div>
        ) : !leaders?.length ? (
          <div className="p-12 text-center" data-ocid="leaderboard.empty_state">
            <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              No recyclers yet. Be the first!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {leaders.map((user, i) => {
              const rank = getRankBadge(i + 1);
              const userBadges = getUserBadges(user.totalBottlesRecycled);
              return (
                <div
                  key={user.displayName}
                  className={`flex items-center gap-4 p-4 transition-colors hover:bg-white/3 ${i < 3 ? "bg-white/2" : ""}`}
                  data-ocid={`leaderboard.item.${i + 1}`}
                >
                  <div
                    className={`w-10 text-center font-display text-lg font-black ${rank.color}`}
                  >
                    {rank.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">
                        {user.displayName}
                      </span>
                      {userBadges.slice(-1).map((b) => (
                        <span key={b.name} className="text-sm" title={b.name}>
                          {b.emoji}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Recycle className="w-3 h-3" />
                        {user.totalBottlesRecycled.toString()} bottles
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        {user.carbonSavedKg.toFixed(1)} kg CO₂
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-black text-lg text-primary">
                      {user.rewardPoints.toString()}
                    </div>
                    <div className="text-xs text-muted-foreground">pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
