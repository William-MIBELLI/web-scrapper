import { PriceHistoryItem, User } from "@/types";

export interface IProduct {
  _id?: any,
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistoryItem[];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  category: string[];
  reviewsCount: number;
  stars: string;
  isOutOfStock: Boolean;
  users?: User[];
};

