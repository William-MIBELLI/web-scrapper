import { updatePriceDataAndSave } from "@/lib/actions";
import Product, { IProductModel } from "@/lib/models/product.model";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { checkForEmail } from "@/lib/utils";
import { NextResponse } from "next/server";

export const maxDuration = 300;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = async (request: Request) => {
  try {
    const products = await Product.find();

    if (!products) throw new Error("No products.");

    const updatedProducts = await Promise.all(
      products.map(async (current) => {
        const scrapped = await scrapeAmazonProduct(current.url);

        if (!scrapped) return;

        //SI LE PRODUCT EST TRACKED, ON CHECK SIL FAUT ENVOYER DES MAILS
        if (current?.users && current?.users?.length > 0) {
          const users = current.users.map((u) => u.email);
          checkForEmail(scrapped, current, users);
        }
        //SI LE PRIX A CHANGE
        if (scrapped.currentPrice !== current.currentPrice) {
          //ON UPDATE LES LE PRICE HISTORY ET LES DIFFERENT PRIX
          const p = updatePriceDataAndSave(current, scrapped.currentPrice);
          return p;
        }
        return current;
      })
    );
    return NextResponse.json({ message: "OK", data: updatedProducts });
  } catch (error: any) {
    throw new Error(`Failed to get all products : ${error?.message}`);
  }
};
