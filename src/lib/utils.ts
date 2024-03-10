import { IProduct } from "@/interfaces";
import { EmailContent, PriceHistoryItem } from "./../types/index";
import Product from "@/lib/models/product.model";
import * as cheerio from "cheerio";
import { generateMailBody, sendEmail } from "./nodemailer";


//TODO : FIX ORIGINAL PRICE
export const extractPrice = (
  ...elements: cheerio.Cheerio<cheerio.Element>[]
): string => {
  for (const element of elements) {
    let priceToReturn = "";
    element.each((index, el) => {
      const $ = cheerio.load(el);
      const price = $(el).text().trim();

      if (price) {
        const parsedPrice = price.replace(/\D/g, "");
        //console.log('price :',price)
        priceToReturn = parsedPrice;
        return false;
      }
    });
    if (priceToReturn !== "") {
      return priceToReturn;
    }
  }

  return "";
};

export const getDescription = (...elements: cheerio.Cheerio<cheerio.Element>[]): string => {
  for (const element of elements) {
    const description = element.text().trim();
    if (description !== "") {
      return description
    }
  }
  return "Unable to retrieve the product description."
}


export const getCategory = (
  elements: cheerio.Cheerio<cheerio.Element>
): string[] => {
  const cat: string[] = [];
  elements.each((i, elem) => {
    const $ = cheerio.load(elem);
    cat.push($(elem).text().trim());
  });
  return cat;
};

export const extractCurrency = (
  element: cheerio.Cheerio<cheerio.Element>
): string => {
  const currency = element.text().trim().slice(0, 1);
  return currency ? currency : "";
};

export const getLowestPrice = (priceList: PriceHistoryItem[]): number => {
  const sortedPrice = priceList.sort((a, b) => {
    return a.price - b.price;
  });
  return sortedPrice[0].price;
};

export const getHighestPrice = (
  priceList: PriceHistoryItem[],
  originalPrice: number
): number => {
  const sortedPrice = priceList.sort((a, b) => {
    return b.price - a.price;
  });
  return sortedPrice[0].price > originalPrice
    ? sortedPrice[0].price
    : originalPrice;
};

export const getAveragePrice = (priceList: PriceHistoryItem[]): number => {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length;
  return averagePrice;
};

export const checkForEmail = async (newProduct: IProduct, oldProduct: IProduct, sendTo: string[]): Promise<void> => {

  let emailBody: EmailContent | undefined;
  const productInfo = { title: newProduct.title, url: newProduct.url };
  //NOUVEAU PRIX INFERIEUR A LANCIEN
  if (newProduct.currentPrice < oldProduct.currentPrice) {
    emailBody = generateMailBody(productInfo, "LOWEST_PRICE");
  }

  //SI LE PRODUCT EST DE NOUVEAU EN STOCK
  if (oldProduct.isOutOfStock && !newProduct.isOutOfStock) {
    emailBody = generateMailBody(productInfo, "CHANGE_OF_STOCK");
  }

  //SI LE PRODUIT A AU MOINS 50% DE REDUCTION
  if (newProduct.discountRate >= 50) {
    emailBody = generateMailBody(productInfo, "THRESHOLD_MET");
  }

  //SI EMAILBODY, ON ENVOIE LEMAIL: L'USER N'EN RECEVRA QU'UN SEUL MAX MEME SI PLUSIEURS VALUES CHANGENT
  if (emailBody) {
    await sendEmail(emailBody, sendTo);
  }

}