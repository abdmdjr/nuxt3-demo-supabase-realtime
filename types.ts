export interface ICoin {
  id: string;
  name: string;
  weight: number;
  img: string;
  price: number;
  change?: string;
  color?: string;
  diff?: number;
}
