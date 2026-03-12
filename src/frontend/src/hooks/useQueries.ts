import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminStats, Badge, ScanRecord, UserProfile } from "../backend.d";
import { UserRole } from "../backend.d";
import { useActor } from "./useActor";

export type { UserProfile, ScanRecord, Badge, AdminStats };
export { UserRole };

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const profile = await actor.getCallerUserProfile();
        return profile;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useScanHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<ScanRecord[]>({
    queryKey: ["scanHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getScanHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBadges() {
  const { actor, isFetching } = useActor();
  return useQuery<Badge[]>({
    queryKey: ["badges"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBadges();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminStats() {
  const { actor, isFetching } = useActor();
  return useQuery<AdminStats | null>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllScans() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[Principal, Array<ScanRecord>]>>({
    queryKey: ["allScans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllScans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitScan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<bigint, Error, string>({
    mutationFn: async (bottleId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitScan(bottleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["scanHistory"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (displayName: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerUser(displayName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useAssignRole() {
  const { actor } = useActor();
  return useMutation<void, Error, { principal: Principal; role: UserRole }>({
    mutationFn: async ({ principal, role }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignCallerUserRole(principal, role);
    },
  });
}
