export interface ICoin {
  id: string;
  updated_at: string;
  name: string;
  weight: number;
  img: string;
  price: number;
  change?: string;
  color?: string;
  diff?: number;
}
