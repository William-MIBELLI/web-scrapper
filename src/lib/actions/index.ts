'use server';

import { scrapeAmazonProduct } from "../scraper";

export const scrapeAndStore = async (productUrl: string) => {
  if (!productUrl) {
    return
  }

  try {
    const scappred = scrapeAmazonProduct(productUrl);
    return scappred;
  } catch (error: any) {
    throw new Error(`Something goes wrong : ${error?.message}`)
  }
}