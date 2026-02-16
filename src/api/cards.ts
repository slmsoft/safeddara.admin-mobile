// Cards API endpoints

import { apiClient } from './client';
import type { ApiResponse, Card, CardsResponse } from './types';

export const cardsApi = {
  /**
   * Add user card
   * POST /cards/add
   * Body: entities.Card — pan (required)
   */
  async addCard(card: Card): Promise<ApiResponse<{ userCard: any }>> {
    let pan = (card.pan ?? card.pun ?? '').replace(/\s/g, '');
    // Защита от дублирования: только первые 16 цифр (Swagger: pan — номер карты)
    if (pan.length > 16) pan = pan.slice(0, 16);
    const body = {
      pan, // Swagger production: required
      pun: pan, // backend entities.Card json:"pun" — совместимость
      cvv: card.cvv,
      expMonth: card.expMonth,
      expYear: card.expYear,
      holder: card.holder,
    };
    return apiClient.post<{ userCard: any }>('/cards/add', body, true);
  },

  /**
   * Get all active cards
   * GET /cards/all
   * Requires: SessionHeader
   */
  async getAllCards(): Promise<CardsResponse> {
    return apiClient.get<{ userCards: any[] }>('/cards/all', true);
  },
};
