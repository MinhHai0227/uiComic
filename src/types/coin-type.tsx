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
