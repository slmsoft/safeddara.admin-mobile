// Users API endpoints

import { apiClient } from './client';
import { getDeviceToken } from './auth';
import type {
  ApiResponse,
  UserRegistration,
  UserLogin,
  UserEmail,
  UserEmailVerification,
  UserSMSVerification,
  SendSMSCodeRequest,
} from './types';

export const usersApi = {
  /**
   * Register new user
   * POST /users/register
   */
  async register(userData: UserRegistration): Promise<ApiResponse> {
    return apiClient.post('/users/register', userData, false);
  },

  /**
   * Login user
   * POST /users/login
   */
  async login(credentials: UserLogin): Promise<ApiResponse> {
    return apiClient.post('/users/login', credentials, false);
  },

  /**
   * Send SMS code
   * POST /users/send/sms-code
   */
  async sendSMSCode(request: SendSMSCodeRequest): Promise<ApiResponse> {
    return apiClient.post('/users/send/sms-code', request, false);
  },

  /**
   * Verify SMS code
   * POST /users/verify/sms-code
   */
  async verifySMSCode(data: UserSMSVerification): Promise<ApiResponse> {
    return apiClient.post('/users/verify/sms-code', data, false);
  },

  /**
   * Send email verification code
   * POST /users/send/email
   */
  async sendEmail(data: UserEmail): Promise<ApiResponse> {
    return apiClient.post('/users/send/email', data, false);
  },

  /**
   * Verify email code
   * POST /users/verify/email
   */
  async verifyEmail(data: UserEmailVerification): Promise<ApiResponse> {
    return apiClient.post('/users/verify/email', data, false);
  },

  /**
   * Refresh session
   * GET /users/refresh
   */
  async refreshSession(): Promise<ApiResponse> {
    return apiClient.get('/users/refresh', true);
  },

  /**
   * Verify device token
   * GET /users/verify/device-token?device-token={token}
   */
  async verifyDeviceToken(token: string): Promise<ApiResponse> {
    return apiClient.get(`/users/verify/device-token?device-token=${encodeURIComponent(token)}`, false);
  },
};
