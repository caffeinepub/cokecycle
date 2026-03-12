import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    totalBottlesRecycled: bigint;
    displayName: string;
    joinedAt: Time;
    rewardPoints: bigint;
    carbonSavedKg: number;
}
export interface ScanRecord {
    recyclingStatus: RecyclingStatus;
    bottleId: string;
    pointsEarned: bigint;
    timestamp: Time;
}
export type Time = bigint;
export interface AdminStats {
    activeUsers: bigint;
    totalBottles: bigint;
    totalRewards: bigint;
    totalCarbonSaved: number;
}
export interface Badge {
    name: string;
    description: string;
    bottlesRequired: bigint;
}
export enum RecyclingStatus {
    verified = "verified"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAdminStats(): Promise<AdminStats>;
    getAllScans(): Promise<Array<[Principal, Array<ScanRecord>]>>;
    getBadges(): Promise<Array<Badge>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(): Promise<Array<UserProfile>>;
    getMyProfile(): Promise<UserProfile>;
    getScanHistory(): Promise<Array<ScanRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(displayName: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitScan(bottleId: string): Promise<bigint>;
    updateProfile(displayName: string): Promise<void>;
}
