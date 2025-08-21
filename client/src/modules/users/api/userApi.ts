// src/modules/users/api/userApi.ts
import { userClient } from "./userClient";
import type {
  User,
  UserDetail,
  CreateUserRequest,
  UpdateUserRequest,
  UserProfile,
  UserStatistics,
  SearchUsersParams,
  ChangePasswordRequest,
  AvatarUploadResponse,
  PaginatedResponse,
} from "../types/user";

export const userApi = {
  // ✅ GET /users - EXISTING (Fixed for nested structure)
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> => {
    try {
      const response = await userClient.get("/", { params });

      console.log("🔍 Raw API Response:", response.data);

      const apiResponse = response.data;

      // Handle nested structure: response.data.data.data
      if (apiResponse?.data?.data && Array.isArray(apiResponse.data.data)) {
        return {
          data: apiResponse.data.data,
          total:
            apiResponse.data.pagination?.total || apiResponse.data.data.length,
          page: apiResponse.data.pagination?.page || params?.page || 1,
          limit: apiResponse.data.pagination?.limit || params?.limit || 20,
          totalPages: apiResponse.data.pagination?.totalPages || 1,
        };
      }

      console.error("❌ Unexpected API response structure:", apiResponse);
      throw new Error("Users array not found in expected location");
    } catch (error) {
      console.error("❌ userApi.getUsers error:", error);
      throw error;
    }
  },

  // ✅ GET /users/:id - EXISTING
  getUserDetail: async (id: number): Promise<UserDetail> => {
    const response = await userClient.get(`/${id}`);
    return response.data.data || response.data;
  },

  // ✅ UPDATED: Create user with complete data
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    console.log("📤 Creating user with data:", userData);

    // ✅ Clean payload - remove fields backend doesn't expect
    const backendPayload = {
      email: userData.email?.trim(),
      username: userData.username?.trim(),
      password: userData.password,
      firstName: userData.firstName?.trim(),
      lastName: userData.lastName?.trim(),
      role: userData.role,
      // ✅ Only include optional fields if they have values
      ...(userData.phone?.trim() && { phone: userData.phone.trim() }),
      ...(userData.avatarUrl?.trim() && {
        avatarUrl: userData.avatarUrl.trim(),
      }),
      // ✅ isActive is NOT included for create - backend handles default value
    };

    console.log("📤 Backend payload (cleaned):", backendPayload);

    try {
      const response = await userClient.post("/", backendPayload);
      console.log("✅ User created successfully:", response.data);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error("❌ Create user API failed:", error.response?.data);
      throw error;
    }
  },

  // ✅ PUT /users/:id - EXISTING
  updateUser: async (
    id: number,
    userData: UpdateUserRequest
  ): Promise<User> => {
    const response = await userClient.put(`/${id}`, userData);
    return response.data.data || response.data;
  },

  // ✅ DELETE /users/:id - EXISTING
  deleteUser: async (id: number): Promise<void> => {
    await userClient.delete(`/${id}`);
  },

  // ✅ GET /users/:id/profile - MISSING METHOD ADDED
  getUserProfile: async (id: number): Promise<UserProfile> => {
    console.log("📤 API: Fetching profile for user ID:", id);

    const response = await userClient.get(`/${id}/profile`);
    console.log("📥 API: Raw response:", response.data);

    // ✅ FIX: Extract data from nested structure
    const profileData = response.data?.data || response.data;
    console.log("📥 API: Extracted profile data:", profileData);

    return profileData;
  },

  // ✅ PUT /users/:id/profile - MISSING METHOD ADDED
  updateUserProfile: async (
    id: number,
    profileData: Partial<UserProfile>
  ): Promise<UserProfile> => {
    console.log("📤 API: Updating profile for user ID:", id);
    console.log("📤 API: Profile data:", profileData);

    const response = await userClient.put(`/${id}/profile`, profileData);

    console.log("📥 API: Profile update response:", response.data);

    return response.data.data || response.data;
  },

  // ✅ PUT /users/:id/password - MISSING METHOD ADDED
  changeUserPassword: async (
    id: number,
    passwordData: ChangePasswordRequest
  ): Promise<void> => {
    await userClient.put(`/${id}/password`, passwordData);
  },

  // ✅ POST /users/:id/avatar - MISSING METHOD ADDED
  uploadAvatar: async (
    userId: number,
    file: File
  ): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await userClient.post(`/${userId}/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    });

    return response.data.data || response.data;
  },
  // ✅ GET /users/search/:query - EXISTING
  searchUsers: async (
    query: string,
    params?: SearchUsersParams
  ): Promise<User[]> => {
    const response = await userClient.get(
      `/search/${encodeURIComponent(query)}`,
      { params }
    );
    return response.data.data || response.data;
  },

  // ✅ GET /users/admin/statistics - EXISTING
  getUserStatistics: async (): Promise<UserStatistics> => {
    try {
      const response = await userClient.get("/admin/statistics");
      console.log("📊 Statistics response:", response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("❌ getUserStatistics error:", error);
      throw error;
    }
  },

  // ✅ GET /users/role/:role - EXISTING
  getUsersByRole: async (role: string): Promise<User[]> => {
    const response = await userClient.get(`/role/${role}`);
    return response.data.data || response.data;
  },
};
