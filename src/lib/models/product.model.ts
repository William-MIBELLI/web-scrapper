import { IProduct } from "@/interfaces";
import mongoose, { Document, Model } from "mongoose";

export interface IProductModel extends IProduct, Document {}

const productSchema = new mongoose.Schema<IProductModel>(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
    currency: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    priceHistory: [
      {
        price: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    lowestPrice: {
      type: Number,
    },
    highestPrice: {
      type: Number,
    },
    averagePrice: {
      type: Number,
    },
    discountRate: {
      type: Number,
    },
    description: {
      type: String,
    },
    category: [
      {
        type: String,
      },
    ],
    reviewsCount: {
      type: Number,
    },
    isOutOfStock: {
      type: Boolean,
    },
    stars: {
      type: String,
      required: true
    },
    users: [
      {
        email: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product: Model<IProductModel> =
  mongoose.models.Product ||
  mongoose.model<IProductModel>("Product", productSchema);

export default Product;
