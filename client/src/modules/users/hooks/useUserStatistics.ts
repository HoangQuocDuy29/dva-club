// src/modules/users/hooks/useUserStatistics.ts
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api";
import { UserStatistics, FormattedUserStats } from "../types/user";

// ✅ CORRECTED: Format function to match actual API structure
const formatUserStats = (stats: any): FormattedUserStats | null => {
  if (!stats) {
    console.warn("⚠️ No stats data provided to formatUserStats");
    return null;
  }

  console.log("🔍 Formatting stats:", stats);

  const roleMapping = {
    admin: "Admins",
    coach: "Coaches",
    player: "Players",
    manager: "Managers",
    viewer: "Viewers",
  };

  // ✅ FIXED: Access correct nested properties
  const totalUsers = stats.overview?.total || 0;
  const activeUsers = stats.overview?.active || 0;
  const newUsersThisMonth = stats.overview?.newThisMonth || 0;

  console.log("📊 Overview data:", {
    totalUsers,
    activeUsers,
    newUsersThisMonth,
  });

  // ✅ FIXED: Use byRole instead of usersByRole
  const roleData = stats.byRole || {};
  console.log("👥 Role data:", roleData);

  const usersByRole = Object.entries(roleData)
    .map(([key, count]) => ({
      role: roleMapping[key as keyof typeof roleMapping] || key,
      count: (count as number) || 0,
      percentage:
        totalUsers > 0
          ? Math.round(((count as number) / totalUsers) * 100 * 10) / 10
          : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const result = {
    totalUsers,
    activeUsers,
    newUsersThisMonth,
    usersByRole,
  };

  console.log("✅ Final formatted result:", result);
  return result;
};

export const useUserStatistics = () => {
  const {
    data: rawStats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userStatistics"],
    queryFn: userApi.getUserStatistics,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  // ✅ Debug logs
  console.log("📊 Raw Statistics:", rawStats);

  // ✅ Safe format data for UI consumption
  const formattedStats = rawStats ? formatUserStats(rawStats) : null;

  console.log("📊 Formatted Statistics:", formattedStats);

  return {
    statistics: formattedStats,
    rawStatistics: rawStats,
    isLoading,
    error,
    refetch,
  };
};
