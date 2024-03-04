import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice } from "../utils";
import { Product } from "@/types";

export const scrapeAmazonProduct = async (url: string) => {
  if (!url) {
    return;
  }

  //BRIGHT DATA CONFIGS VALUE
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWOR);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  //OBJECT CONFIG FOR AXIOS
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    //FETCH THE PRODUCT PAGE FROM AMAZON
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const title = $("#productTitle").text().trim();

    const currentPrice = extractPrice(
      $(".priceToPay"),
      $(".a-button-selected .a-color-base"),
      $(".a.size.base.a-color-price")
    );

    const originalPrice = extractPrice(
      $(".a-price.a-text-price span.a-offscreen"),
      $("#priceblock_ourprice"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    //TODO : Faire un Array avec les différentes langues it,de,co.uk,es,pt
    const isOutOfStock =
      $("#availability span").text().trim().toLowerCase() === "en stock"
        ? false
        : true;

    const images =
      $("#landingImage").attr("data-a-dynamic-image") ||
      $("#imgBlikFront").attr("data-a-dynamic-image") ||
      "";

    const imageUrl = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-price-symbol"));

    const discount = $(".savingsPercentage").text().trim().match(/\d+/);

    const parsedDiscount = discount ? discount[0] : "";

    const data: Product = {
      url,
      title,
      currentPrice: +currentPrice || +originalPrice,
      originalPrice: +originalPrice || +currentPrice,
      isOutOfStock,
      image: imageUrl[0],
      currency: currency || '€',
      discountRate: +parsedDiscount || 0,
      lowestPrice: +currentPrice || +originalPrice,
      highestPrice: +originalPrice || +currentPrice,
      priceHistory: [],
      averagePrice: 0,
      description: "",
      category: "",
      reviewsCount: 0,
      stars: 0
    };
    return data;
  } catch (error: any) {
    console.log("error : ", error);
    return;
  }
};
