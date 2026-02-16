// Orders API — строго по Swagger (api.safeddara.tj)

import { apiClient } from './client';
import type { ApiResponse, Order } from './types';

export const ordersApi = {
  /**
   * POST /orders/products/create
   * Body: entities.Order { cardId, categoryId, startDate, endDate, products }
   */
  async createOrder(order: Order): Promise<ApiResponse<null>> {
    return apiClient.post<null>('/orders/products/create', order, true);
  },

  /**
   * GET /orders/{id}/barcode
   * Returns image/png
   */
  async getBarcode(orderId: string): Promise<Response> {
    return apiClient.getRaw(`/orders/${encodeURIComponent(orderId)}/barcode`, true);
  },
};
