export interface Coin {
  id: number;
  coin_amount: number;
  price: number;
  create_at: string;
}

export interface CoinAction {
  id: number;
  coin_amount: number;
  price: number;
}

//payment response
export interface PaymentResponse {
  amount: number;
  message: string;
  orderId: string;
  partnerCode: string;
  payUrl: string;
  requestId: string;
  responseTime: number;
  resultCode: number;
  shortLink: string;
}
