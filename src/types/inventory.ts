export interface InventoryItem {
  id: number;
  name: string;
  category: string | null;
  quantity: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  min_quantity: number | null;
  description: string | null;
  sku: string | null;
  image_url: string | null;
  tags: string[] | null;
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