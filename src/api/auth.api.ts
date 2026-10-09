import apiClient from "./client";

import type {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  TokenResponse,
  LogoutResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
} from "../types/auth";

// ============================================================
// REGISTER
// ============================================================

export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    data,
  );

  return response.data;
};

// ============================================================
// LOGIN
// ============================================================

export const login = async (
  data: LoginRequest,
): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>(
    "/auth/login",
    data,
  );

  return response.data;
};

// ============================================================
// REFRESH TOKEN
// ============================================================

export const refreshToken = async (
  data: RefreshTokenRequest,
): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>(
    "/auth/refresh",
    data,
  );

  return response.data;
};

// ============================================================
// LOGOUT
// ============================================================

export const logout = async (
  data: RefreshTokenRequest,
): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>(
    "/auth/logout",
    data,
  );

  return response.data;
};

// ============================================================
// FORGOT PASSWORD
// ============================================================

export const forgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ForgotPasswordResponse>(
    "/auth/password/forgot",
    data,
  );

  return response.data;
};

// ============================================================
// RESET PASSWORD
// ============================================================

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>(
    "/auth/password/reset",
    data,
  );

  return response.data;
};

// ============================================================
// CHANGE PASSWORD
// ============================================================

export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<ChangePasswordResponse> => {
  const response = await apiClient.post<ChangePasswordResponse>(
    "/auth/password/change",
    data,
  );

  return response.data;
};

// ============================================================
// VERIFY EMAIL
// ============================================================

export const verifyEmail = async (
  data: VerifyEmailRequest,
): Promise<VerifyEmailResponse> => {
  const response = await apiClient.post<VerifyEmailResponse>(
    "/auth/email/verify",
    data,
  );

  return response.data;
};

// ============================================================
// RESEND EMAIL VERIFICATION
// ============================================================

export const resendVerification = async (
  data: ResendVerificationRequest,
): Promise<ResendVerificationResponse> => {
  const response = await apiClient.post<ResendVerificationResponse>(
    "/auth/email/resend-verification",
    data,
  );

  return response.data;
};