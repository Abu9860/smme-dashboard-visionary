export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  minQuantity?: number;
  description?: string;
  sku?: string;
  imageUrl?: string;
}

export interface StockHistory {
  id: number;
  itemId: number;
  date: string;
  type: "in" | "out";
  quantity: number;
  notes?: string;
}