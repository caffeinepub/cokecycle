import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Principal } from "@icp-sdk/core/principal";
import {
  AlertTriangle,
  Leaf,
  Loader2,
  Package,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  UserRole,
  useAdminStats,
  useAllScans,
  useAssignRole,
  useIsAdmin,
} from "../hooks/useQueries";

function formatTime(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleString();
}

export function AdminPage() {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: allScans, isLoading: scansLoading } = useAllScans();
  const assignRole = useAssignRole();

  const [targetPrincipal, setTargetPrincipal] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.user);

  const handleAssignRole = async () => {
    if (!targetPrincipal.trim()) return;
    try {
      const principal = Principal.fromText(targetPrincipal.trim());
      await assignRole.mutateAsync({ principal, role: selectedRole });
      toast.success("Role updated successfully");
      setTargetPrincipal("");
    } catch {
      toast.error("Failed to assign role. Check the principal ID.");
    }
  };

  if (checkingAdmin) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="admin.error_state"
      >
        <AlertTriangle className="w-12 h-12 text-secondary mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          You don't have admin permissions.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-secondary mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          Admin Panel
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
          Admin <span className="text-secondary">Dashboard</span>
        </h1>
        <p className="text-muted-foreground">
          Monitor platform activity and manage user permissions.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            icon: Package,
            label: "Total Bottles",
            value: statsLoading ? null : stats?.totalBottles.toString() || "0",
            color: "text-primary",
          },
          {
            icon: Users,
            label: "Active Users",
            value: statsLoading ? null : stats?.activeUsers.toString() || "0",
            color: "text-blue-400",
          },
          {
            icon: Star,
            label: "Rewards Distributed",
            value: statsLoading ? null : stats?.totalRewards.toString() || "0",
            color: "text-yellow-400",
          },
          {
            icon: Leaf,
            label: "Carbon Saved (kg)",
            value: statsLoading
              ? null
              : (stats?.totalCarbonSaved || 0).toFixed(1),
            color: "text-green-400",
          },
        ].map((card, i) => (
          <div
            key={card.label}
            className="glass rounded-2xl p-5"
            data-ocid={`admin.card.${i + 1}`}
          >
            <div
              className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center mb-3 ${card.color}`}
            >
              <card.icon className="w-4 h-4" />
            </div>
            {card.value === null ? (
              <Skeleton className="h-8 w-16 mb-1" />
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

      {/* Role Assignment */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-secondary" />
          Assign User Role
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 space-y-2">
            <Label>User Principal ID</Label>
            <Input
              placeholder="e.g. rdmx6-jaaaa-aaaaa-aaadq-cai"
              value={targetPrincipal}
              onChange={(e) => setTargetPrincipal(e.target.value)}
              className="bg-muted border-border font-mono text-sm"
              data-ocid="admin.input"
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(v) => setSelectedRole(v as UserRole)}
            >
              <SelectTrigger
                className="bg-muted border-border"
                data-ocid="admin.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-border">
                <SelectItem value={UserRole.user}>User</SelectItem>
                <SelectItem value={UserRole.admin}>Admin</SelectItem>
                <SelectItem value={UserRole.guest}>Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          className="mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          onClick={handleAssignRole}
          disabled={assignRole.isPending || !targetPrincipal.trim()}
          data-ocid="admin.submit_button"
        >
          {assignRole.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Assigning...
            </>
          ) : (
            "Assign Role"
          )}
        </Button>
      </div>

      {/* All Scans Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            All Scan Activity
          </h2>
        </div>
        {scansLoading ? (
          <div className="p-6 space-y-3" data-ocid="admin.loading_state">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !allScans?.length ? (
          <div className="p-12 text-center" data-ocid="admin.empty_state">
            <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No scan activity yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>User</TableHead>
                  <TableHead>Bottle ID</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allScans.flatMap(([principal, records]) =>
                  records.map((r, ri) => (
                    <TableRow
                      key={`${principal.toString()}-${ri}`}
                      className="border-border"
                      data-ocid="admin.row"
                    >
                      <TableCell className="font-mono text-xs truncate max-w-32">
                        {principal.toString().slice(0, 12)}...
                      </TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-32">
                        {r.bottleId}
                      </TableCell>
                      <TableCell className="text-primary font-bold">
                        +{r.pointsEarned.toString()}
                      </TableCell>
                      <TableCell className="text-primary text-xs">
                        Verified
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatTime(r.timestamp)}
                      </TableCell>
                    </TableRow>
                  )),
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
