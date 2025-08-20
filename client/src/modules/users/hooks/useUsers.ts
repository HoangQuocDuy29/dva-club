// src/modules/users/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api"; // ✅ Import từ api module riêng
import {
  User,
  CreateUserRequest,
  UserDetail,
  PaginatedResponse,
  SearchUsersParams,
  UpdateUserRequest,
  UserStatistics,
  UserProfile,
  ChangePasswordRequest,
  AvatarUploadResponse,
} from "../types/user";

interface UseUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

export const useUsers = (params?: UseUsersParams) => {
  const queryClient = useQueryClient();

  // ✅ Get paginated users
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<PaginatedResponse<User>>({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers(params), // ✅ Sử dụng userApi
    staleTime: 5 * 60 * 1000,
  });

  // ✅ Get user statistics
  const { data: statistics, isLoading: isLoadingStats } =
    useQuery<UserStatistics>({
      queryKey: ["userStatistics"],
      queryFn: userApi.getUserStatistics, // ✅ Sử dụng userApi
      staleTime: 10 * 60 * 1000,
    });

  // ✅ Create user mutation
  const createUserMutation = useMutation<User, Error, CreateUserRequest>({
    mutationFn: userApi.createUser, // ✅ Sử dụng userApi
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStatistics"] });
    },
  });

  // ✅ Update user mutation
  const updateUserMutation = useMutation<
    User,
    Error,
    { id: number; data: UpdateUserRequest }
  >({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data), // ✅ Sử dụng userApi
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userDetail"] });
    },
  });

  // ✅ Delete user mutation
  const deleteUserMutation = useMutation<void, Error, number>({
    mutationFn: userApi.deleteUser, // ✅ Sử dụng userApi
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStatistics"] });
    },
  });

  // ✅ Update user profile mutation
  const updateProfileMutation = useMutation<
    UserProfile,
    Error,
    { id: number; data: Partial<UserProfile> }
  >({
    mutationFn: ({ id, data }) => userApi.updateUserProfile(id, data), // ✅ Sử dụng userApi
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDetail"] });
    },
  });

  // ✅ Change password mutation
  const changePasswordMutation = useMutation<
    void,
    Error,
    { id: number; data: ChangePasswordRequest }
  >({
    mutationFn: ({ id, data }) => userApi.changeUserPassword(id, data), // ✅ Sử dụng userApi
  });

  // ✅ Upload avatar mutation
  const uploadAvatarMutation = useMutation<
    AvatarUploadResponse,
    Error,
    { id: number; file: FormData }
  >({
    mutationFn: ({ id, file }) => userApi.uploadAvatar(id, file), // ✅ Sử dụng userApi
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userDetail"] });
    },
  });

  // ✅ Restore user mutation
  const restoreUserMutation = useMutation<User, Error, number>({
    mutationFn: userApi.restoreUser, // ✅ Sử dụng userApi
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStatistics"] });
    },
  });

  return {
    // ✅ Data với proper typing
    users: usersResponse?.data || [],
    total: usersResponse?.total || 0,
    totalPages: usersResponse?.totalPages || 0,
    currentPage: usersResponse?.page || 1,
    statistics,

    // ✅ Loading states
    isLoading,
    isLoadingStats,

    // ✅ Error states
    error,

    // ✅ Actions
    refetch,

    // ✅ Mutations với proper typing
    createUser: (data: CreateUserRequest) =>
      createUserMutation.mutateAsync(data),
    updateUser: (id: number, data: UpdateUserRequest) =>
      updateUserMutation.mutateAsync({ id, data }),
    deleteUser: (id: number) => deleteUserMutation.mutateAsync(id),
    updateProfile: (id: number, data: Partial<UserProfile>) =>
      updateProfileMutation.mutateAsync({ id, data }),
    changePassword: (id: number, data: ChangePasswordRequest) =>
      changePasswordMutation.mutateAsync({ id, data }),
    uploadAvatar: (id: number, file: FormData) =>
      uploadAvatarMutation.mutateAsync({ id, file }),
    restoreUser: (id: number) => restoreUserMutation.mutateAsync(id),

    // ✅ Mutation states
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    isRestoring: restoreUserMutation.isPending,
  };
};

// ✅ Separate hook for user detail
export const useUserDetail = (userId: number | null, enabled = true) => {
  return useQuery<UserDetail>({
    queryKey: ["userDetail", userId],
    queryFn: () => userApi.getUserDetail(userId!), // ✅ Sử dụng userApi
    enabled: !!userId && enabled,
  });
};

// ✅ Hook for user search
export const useUserSearch = (query: string, params?: SearchUsersParams) => {
  return useQuery<User[]>({
    queryKey: ["userSearch", query, params],
    queryFn: () => userApi.searchUsers(query, params), // ✅ Sử dụng userApi
    enabled: query.length >= 2,
  });
};

// ✅ Hook for users by role
export const useUsersByRole = (role: string) => {
  return useQuery<User[]>({
    queryKey: ["usersByRole", role],
    queryFn: () => userApi.getUsersByRole(role), // ✅ Sử dụng userApi
    staleTime: 5 * 60 * 1000,
  });
};
