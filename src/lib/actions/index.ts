"use server";

import { IProductModel } from "./../models/product.model";
import Product from "../models/product.model";
import { connectToDb } from "../mongoose";
import { IProduct } from "@/interfaces";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { revalidatePath } from "next/cache";

export const scrapeAndStore = async (productUrl: string) => {
  if (!productUrl) {
    return;
  }

  try {
    await connectToDb();

    //ON SCRAPPE DEPUIS AMAZON
    const scrapped = await scrapeAmazonProduct(productUrl);
    if (!scrapped) {
      return;
    }

    let product = scrapped;

    //ON CHECK S'IL EST DEJA DANS LA DATABASE
    const existingProduct = await Product.findOne({
      $or: [{ url: product.url }, { title: product.title }],
    });

    //SI OUI ON UPDATE LHISTORIQUE DES PRIX
    if (existingProduct) {
      existingProduct.priceHistory.push({ price: product.currentPrice, date: Date.now().toString() });
      existingProduct.lowestPrice = getLowestPrice(existingProduct.priceHistory);
      existingProduct.highestPrice = getHighestPrice(existingProduct.priceHistory, product.currentPrice);
      existingProduct.averagePrice = getAveragePrice(existingProduct.priceHistory);
      await existingProduct.save()
      return revalidatePath(`/products/${existingProduct._id}`);
    }

    //SINON UN CREE UN NOUVEAU PRODUCT DANS LA DB
    const p = new Product(product);
    await p.save();
    return revalidatePath(`/products/${p._id}`);

  } catch (error: any) {
    throw new Error(`Something goes wrong : ${error?.message}`);
  }
};

export const getProductById = async (productId: string) => {
  try {
    await connectToDb();
    const product = await Product.findById(productId);

    if (!product) return;

    return product;
  } catch (error) {
    console.log(error);
  }
};

export const getAllProduct = async () => {
  try {
    await connectToDb();
    const products = await Product.find();
    if (!products) return;
    return products;
  } catch (error) {
    console.log(error);
  }
};
