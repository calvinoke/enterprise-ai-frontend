import apiClient from "./client";
import type { CurrentUser } from "../types/users";


// ============================================================
// USER ROLES
// ============================================================

export type UserRole = "user" | "admin";

// ============================================================
// PROFILE UPDATE
// ============================================================

export interface UserUpdatePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
}


// ============================================================
// ADMIN USER CREATION
// ============================================================

export interface AdminUserCreatePayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
}


// ============================================================
// ROLE UPDATE
// ============================================================

export interface UserRoleUpdatePayload {
  role: UserRole;
}


// ============================================================
// GET CURRENT USER
// ============================================================

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await apiClient.get<CurrentUser>(
    "/users/me",
  );

  return response.data;
}


// ============================================================
// UPDATE CURRENT USER
// ============================================================

export async function updateCurrentUser(
  data: UserUpdatePayload,
): Promise<CurrentUser> {

  const response = await apiClient.patch<CurrentUser>(
    "/users/me",
    data,
  );

  return response.data;
}


// ============================================================
// CREATE USER - ADMIN
// ============================================================

export async function createUser(
  data: AdminUserCreatePayload,
): Promise<CurrentUser> {

  const response = await apiClient.post<CurrentUser>(
    "/users",
    data,
  );

  return response.data;
}


// ============================================================
// GET ALL USERS - ADMIN
// ============================================================

export async function getUsers(): Promise<CurrentUser[]> {

  const response = await apiClient.get<CurrentUser[]>(
    "/users",
  );

  return response.data;
}


// ============================================================
// GET USER BY ID
// ============================================================

export async function getUserById(
  userId: string,
): Promise<CurrentUser> {

  const response = await apiClient.get<CurrentUser>(
    `/users/${userId}`,
  );

  return response.data;
}


// ============================================================
// UPDATE USER BY ID
// ============================================================

export async function updateUser(
  userId: string,
  data: UserUpdatePayload,
): Promise<CurrentUser> {

  const response = await apiClient.patch<CurrentUser>(
    `/users/${userId}`,
    data,
  );

  return response.data;
}


// ============================================================
// UPDATE ROLE
// ============================================================

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<CurrentUser> {

  const response = await apiClient.patch<CurrentUser>(
    `/users/${userId}/role`,
    {
      role,
    },
  );

  return response.data;
}


// ============================================================
// DELETE USER
// ============================================================

export async function deleteUser(
  userId: string,
): Promise<void> {

  await apiClient.delete(
    `/users/${userId}`,
  );
}


// ============================================================
// ACTIVATE USER
// ============================================================

export async function activateUser(
  userId: string,
): Promise<CurrentUser> {

  const response = await apiClient.patch<CurrentUser>(
    `/users/${userId}/activate`,
  );

  return response.data;
}


// ============================================================
// DEACTIVATE USER
// ============================================================

export async function deactivateUser(
  userId: string,
): Promise<CurrentUser> {

  const response = await apiClient.patch<CurrentUser>(
    `/users/${userId}/deactivate`,
  );

  return response.data;
}