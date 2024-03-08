import axios from "axios";
import * as cheerio from "cheerio";
import {
  extractCurrency,
  extractPrice,
  getCategory,
  getDescription,
} from "../utils";
import { IProduct } from "@/interfaces";

export const scrapeAmazonProduct = async (
  url: string
): Promise<IProduct | undefined> => {
  if (!url) {
    return;
  }

  //BRIGHT DATA CONFIGS VALUE
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
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
      $(".a.size.base.a-color-price"),
      $(".a-offscreen")
    );

    const originalPrice = extractPrice(
      $(".a-price.a-text-price span.a-offscreen"),
      $("#priceblock_ourprice"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    const description = getDescription(
      $("#productFactsDesktop_feature_div .a-unordered-list .a-list-item"),
      $(
        "#feature-bullets ul.a-unordered-list li.a-spacing-mini span.a-list-item"
      ),
      $("div#productDescription p span")
    );

    const stars =
      $(".reviewCountTextLinkedHistogram").attr("title")?.split(" ")[0] || "3";

    const reviewsCount =
      +$("#acrCustomerReviewText").text().trim().replace(/\D/g, "") || 0;

    const category = getCategory(
      $("#wayfinding-breadcrumbs_container a.a-link-normal")
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

    const data: IProduct = {
      url,
      title,
      currentPrice: +currentPrice || +originalPrice,
      originalPrice: +originalPrice > +currentPrice ? +originalPrice : +currentPrice,
      isOutOfStock,
      image: imageUrl[0],
      currency: currency || "€",
      discountRate: +parsedDiscount || 0,
      lowestPrice: +currentPrice || +originalPrice,
      highestPrice: +originalPrice > +currentPrice ? +originalPrice : +currentPrice,
      priceHistory: [],
      averagePrice: 0,
      description,
      category,
      reviewsCount,
      stars,
    };
    return data;
  } catch (error: any) {
    console.log("error : ", error);
    return;
  }
};
