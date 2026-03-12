import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Badge = {
    name : Text;
    description : Text;
    bottlesRequired : Nat;
  };

  public type UserProfile = {
    displayName : Text;
    totalBottlesRecycled : Nat;
    rewardPoints : Nat;
    carbonSavedKg : Float;
    joinedAt : Time.Time;
  };

  public type ScanRecord = {
    bottleId : Text;
    pointsEarned : Nat;
    timestamp : Time.Time;
    recyclingStatus : RecyclingStatus;
  };

  public type RecyclingStatus = {
    #verified;
  };

  public type AdminStats = {
    totalBottles : Nat;
    activeUsers : Nat;
    totalRewards : Nat;
    totalCarbonSaved : Float;
  };

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      Nat.compare(b.rewardPoints, a.rewardPoints);
    };

    public func compareByDisplayName(a : UserProfile, b : UserProfile) : Order.Order {
      Text.compare(a.displayName, b.displayName);
    };
  };

  let firestore = Map.empty<Principal, UserProfile>();
  let scanStore = Map.empty<Principal, List.List<ScanRecord>>();
  var totalBottles = 0;
  var totalRewards = 0;
  var totalCarbonSaved = 0.0;

  let badges = [
    {
      name = "Eco Beginner";
      description = "Recycled your first bottle";
      bottlesRequired = 1;
    },
    {
      name = "Recycling Champion";
      description = "Recycled 10 bottles";
      bottlesRequired = 10;
    },
    {
      name = "Planet Protector";
      description = "Recycled 50 bottles";
      bottlesRequired = 50;
    },
  ];

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    firestore.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    firestore.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    firestore.add(caller, profile);
  };

  public shared ({ caller }) func registerUser(displayName : Text) : async () {
    switch (firestore.get(caller)) {
      case (?_exist) { Runtime.trap("User already registered") };
      case (null) {
        let profile : UserProfile = {
          displayName;
          totalBottlesRecycled = 0;
          rewardPoints = 0;
          carbonSavedKg = 0.0;
          joinedAt = Time.now();
        };
        firestore.add(caller, profile);
        scanStore.add(caller, List.empty<ScanRecord>());
      };
    };
  };

  public shared ({ caller }) func updateProfile(displayName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    switch (firestore.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedProfile = { profile with displayName };
        firestore.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func submitScan(bottleId : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit scans");
    };
    let points = 5;
    let scan : ScanRecord = {
      bottleId;
      pointsEarned = points;
      timestamp = Time.now();
      recyclingStatus = #verified;
    };
    switch (firestore.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedProfile = {
          profile with
          totalBottlesRecycled = profile.totalBottlesRecycled + 1;
          rewardPoints = profile.rewardPoints + points;
          carbonSavedKg = profile.carbonSavedKg + 0.025;
        };
        firestore.add(caller, updatedProfile);

        let userScans = switch (scanStore.get(caller)) {
          case (null) { List.empty<ScanRecord>() };
          case (?scans) { scans };
        };
        userScans.add(scan);
        scanStore.add(caller, userScans);

        totalBottles += 1;
        totalRewards += points;
        totalCarbonSaved += 0.025;

        points;
      };
    };
  };

  public query ({ caller }) func getScanHistory() : async [ScanRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view scan history");
    };
    switch (scanStore.get(caller)) {
      case (null) { [] };
      case (?scans) { scans.toArray() };
    };
  };

  public query ({ caller }) func getLeaderboard() : async [UserProfile] {
    let allProfiles = firestore.values().toArray();
    let sortedProfiles = allProfiles.sort();
    sortedProfiles.sliceToArray(0, Nat.min(20, sortedProfiles.size()));
  };

  public query ({ caller }) func getMyProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    switch (firestore.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getBadges() : async [Badge] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view badges");
    };
    switch (firestore.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let earnedBadges = badges.filter(
          func(badge) {
            profile.totalBottlesRecycled >= badge.bottlesRequired;
          },
        );
        earnedBadges;
      };
    };
  };

  public query ({ caller }) func getAdminStats() : async AdminStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view stats");
    };
    {
      totalBottles;
      activeUsers = firestore.size();
      totalRewards;
      totalCarbonSaved;
    };
  };

  public query ({ caller }) func getAllScans() : async [(Principal, [ScanRecord])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all scans");
    };
    let scanList = scanStore.toArray();
    let result = scanList.map(
      func((user, scans)) {
        (user, scans.toArray());
      },
    );
    result;
  };
};
