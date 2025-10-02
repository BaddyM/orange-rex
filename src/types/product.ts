export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: any;
  category: string;
  inStock: number;
}

export interface CartItem extends Product {
  quantity: number;
}
