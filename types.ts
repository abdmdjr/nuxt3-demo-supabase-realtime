export interface ICoin {
  id: number;
  updated_at: string;
  name: string;
  weight: number;
  img: string;
  price: number;
  change?: string;
  color?: string;
  diff?: number;
}
