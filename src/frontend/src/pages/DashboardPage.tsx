import { Badge as UiBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Leaf,
  QrCode,
  Recycle,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import { useMyProfile, useScanHistory } from "../hooks/useQueries";

const BADGE_DATA = [
  {
    emoji: "🌱",
    name: "Eco Beginner",
    desc: "Recycle your first bottle",
    bottles: 1,
  },
  {
    emoji: "♻️",
    name: "Recycling Champion",
    desc: "Recycle 10 bottles",
    bottles: 10,
  },
  {
    emoji: "🌍",
    name: "Planet Protector",
    desc: "Recycle 50 bottles",
    bottles: 50,
  },
];

const CHALLENGES = [
  { title: "Recycle 5 bottles this week", reward: "25 pts", progress: 60 },
  { title: "Reach 100 total points", reward: "50 pts", progress: 75 },
  { title: "Visit 3 different centers", reward: "30 pts", progress: 33 },
];

function formatTime(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: history, isLoading: historyLoading } = useScanHistory();

  const bottleCount = Number(profile?.totalBottlesRecycled || 0);
  const nextBadge = BADGE_DATA.find((b) => b.bottles > bottleCount);
  const badgeProgress = nextBadge
    ? Math.min((bottleCount / nextBadge.bottles) * 100, 100)
    : 100;
  const earnedBadges = BADGE_DATA.filter((b) => b.bottles <= bottleCount);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-primary mb-4">
          <Star className="w-3.5 h-3.5" />
          My Dashboard
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
              Welcome back,{" "}
              <span className="text-gradient-green">
                {profileLoading ? "..." : profile?.displayName || "Recycler"}
              </span>
            </h1>
            <p className="text-muted-foreground">
              Keep up the eco momentum! Every bottle counts.
            </p>
          </div>
          <Link to="/scan">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-green"
              data-ocid="dashboard.primary_button"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Scan New Bottle
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            icon: Recycle,
            label: "Bottles Recycled",
            value: profileLoading
              ? null
              : String(profile?.totalBottlesRecycled || 0),
            color: "text-primary",
          },
          {
            icon: Star,
            label: "Reward Points",
            value: profileLoading ? null : String(profile?.rewardPoints || 0),
            color: "text-yellow-400",
          },
          {
            icon: Leaf,
            label: "Carbon Saved (kg)",
            value: profileLoading
              ? null
              : (profile?.carbonSavedKg || 0).toFixed(2),
            color: "text-green-400",
          },
          {
            icon: Trophy,
            label: "Badges Earned",
            value: profileLoading ? null : String(earnedBadges.length),
            color: "text-secondary",
          },
        ].map((card, i) => (
          <div
            key={card.label}
            className="glass glass-hover rounded-2xl p-5"
            data-ocid={`dashboard.card.${i + 1}`}
          >
            <div
              className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center mb-3 ${card.color}`}
            >
              <card.icon className="w-4 h-4" />
            </div>
            {card.value === null ? (
              <Skeleton
                className="h-8 w-16 mb-1"
                data-ocid="dashboard.loading_state"
              />
            ) : (
              <div
                className={`font-display text-3xl font-black mb-1 ${card.color}`}
              >
                {card.value}
              </div>
            )}
            <div className="text-muted-foreground text-xs">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 mb-6">
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Badge Progress
        </h2>
        {nextBadge ? (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">
                Next:{" "}
                <strong className="text-foreground">
                  {nextBadge.emoji} {nextBadge.name}
                </strong>
              </span>
              <span className="text-sm text-primary">
                {bottleCount}/{nextBadge.bottles} bottles
              </span>
            </div>
            <Progress value={badgeProgress} className="h-2" />
          </div>
        ) : (
          <p className="text-primary font-medium">
            🎉 You've earned all badges! You're a Planet Protector!
          </p>
        )}
        <div className="flex flex-wrap gap-3 mt-5">
          {BADGE_DATA.map((badge) => (
            <div
              key={badge.name}
              className={`glass rounded-xl px-4 py-3 flex items-center gap-3 transition-all ${badge.bottles <= bottleCount ? "border-primary/30" : "opacity-40"}`}
              data-ocid="dashboard.badge.card"
            >
              <span className="text-2xl">{badge.emoji}</span>
              <div>
                <div className="text-sm font-semibold">{badge.name}</div>
                <div className="text-xs text-muted-foreground">
                  {badge.desc}
                </div>
              </div>
              {badge.bottles <= bottleCount && (
                <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Recycle className="w-5 h-5 text-primary" />
            Recent Scans
          </h2>
          {historyLoading ? (
            <div className="space-y-3" data-ocid="dashboard.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !history?.length ? (
            <div
              className="text-center py-10"
              data-ocid="dashboard.empty_state"
            >
              <Recycle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No scans yet</p>
              <Link to="/scan">
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  data-ocid="dashboard.secondary_button"
                >
                  Start Scanning
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Bottle ID</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.slice(0, 8).map((r, i) => (
                  <TableRow
                    key={r.bottleId}
                    className="border-border"
                    data-ocid={`dashboard.item.${i + 1}`}
                  >
                    <TableCell className="font-mono text-xs truncate max-w-32">
                      {r.bottleId}
                    </TableCell>
                    <TableCell className="text-primary font-bold">
                      +{r.pointsEarned.toString()}
                    </TableCell>
                    <TableCell>
                      <UiBadge className="bg-primary/15 text-primary border-primary/20 text-xs">
                        Verified
                      </UiBadge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {formatTime(r.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-secondary" />
            Eco Challenges
          </h2>
          <div className="space-y-4">
            {CHALLENGES.map((c) => (
              <div
                key={c.title}
                className="glass rounded-xl p-4"
                data-ocid="dashboard.challenge.card"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium leading-snug flex-1 mr-2">
                    {c.title}
                  </p>
                  <UiBadge className="bg-primary/15 text-primary border-primary/20 text-xs shrink-0">
                    {c.reward}
                  </UiBadge>
                </div>
                <Progress value={c.progress} className="h-1.5" />
                <div className="text-xs text-muted-foreground mt-1.5">
                  {c.progress}% complete
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
