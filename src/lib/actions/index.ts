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
    const existingProduct: IProduct | null = await Product.findOne({
      url: scrapped.url,
    });

    //ON UPDATE LHISTORIQUE DES PRIX
    if (existingProduct) {
      const updatedPriceHistory: IProductModel["priceHistory"] = [
        ...existingProduct.priceHistory,
        { price: product.currentPrice, date: Date.now().toString() },
      ];
      console.log("UPDATED HISTORY :", updatedPriceHistory);
      console.log("ORIGINAL HISTORY :", existingProduct.priceHistory);
      product = {
        ...scrapped,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(
          updatedPriceHistory,
          product.originalPrice
        ),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    //SOIT ON UPDATE SI EXISTANT, SOIT ON CREE UN NOUVEEAU PRODUCT DANS LA DB
    const newProduct = await Product.findOneAndUpdate(
      {
        url: scrapped.url,
      },
      product,
      { upsert: true, new: true }
    );

    //ON REVALIDE LA ROUTE POUR RESET LE CACHE ET DISPLAY LES BONNES INFOS
    revalidatePath(`/products/${newProduct._id}`);
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
