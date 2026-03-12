# CokeCycle – Smart Bottle Recycling Rewards Platform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Landing page with hero, problem stats, how-it-works steps, environmental impact counters, and CTA
- QR scanner page using device camera with real QR detection, scan result display, and scan history
- User dashboard with stats (bottles recycled, reward points, carbon saved), scan history, and animated cards
- Gamification system: leaderboard, achievement badges, monthly eco challenges
- Collection centers page with a list/map-style layout showing nearby drop-off locations
- Admin panel: total scans, active users, rewards distributed, environmental impact metrics
- Authorization (login/register) with role-based access (user vs admin)
- Full backend: user profiles, scan records, reward points, leaderboard, badges

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- User profile: principal, displayName, totalBottles, rewardPoints, carbonSaved, joinedAt
- Scan record: id, userId, bottleId, pointsEarned, timestamp, status
- Leaderboard: sorted list of users by points
- Badge system: assign badges based on milestones (10, 50, 100 bottles)
- Admin queries: aggregate stats across all users
- Register/update profile, submitScan, getScanHistory, getLeaderboard, getBadges, getAdminStats

### Frontend
- App shell with nav (Landing, Scan, Dashboard, Centers, Leaderboard, Admin)
- Landing page: animated hero, problem section with stat cards, 4-step how-it-works, impact counters, CTA
- QR Scanner: camera feed using qr-code component, scan result modal, stored history
- User Dashboard: animated stat cards, recent scans table, badge showcase, challenges
- Leaderboard page: ranked user list with points and badges
- Collection Centers: card grid with mock center data
- Admin Panel: protected route, aggregate stats cards, recent activity
- Dark theme with eco-green (#22c55e) and red (#ef4444) accents, glassmorphism cards
