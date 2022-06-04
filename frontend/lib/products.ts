export type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
};

export async function getProducts() {
  const response = await fetch("http://localhost:8000/products/");
  const data: Product[] = await response.json();
  return data;
}
