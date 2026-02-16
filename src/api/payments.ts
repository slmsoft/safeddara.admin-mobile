// Payments API endpoints

import { apiClient } from './client';
import type { ApiResponse, PaymentsResponse } from './types';

export const paymentsApi = {
  /**
   * Get all payments
   * GET /payments/all
   * Requires: SessionHeader
   */
  async getAllPayments(): Promise<PaymentsResponse> {
    return apiClient.get<{ userPayments: any[] }>('/payments/all', true);
  },
};
