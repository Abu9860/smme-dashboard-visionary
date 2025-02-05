export interface InventoryItem {
  id: number;
  name: string;
  category: string | null;
  quantity: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  minQuantity?: number;
  description?: string;
  sku?: string;
  imageUrl?: string;
  tags?: string[];
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface StockHistoryRecord {
  id: number;
  itemId: number;
  date: string;
  type: "in" | "out";
  quantity: number;
  notes?: string;
}