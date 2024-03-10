"use server";

import { IProductModel } from "./../models/product.model";
import Product from "../models/product.model";
import { connectToDb } from "../mongoose";
import { IProduct } from "@/interfaces";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { revalidatePath } from "next/cache";
import { IModalState } from "@/components/Modal";
import { generateMailBody, sendEmail } from "../nodemailer";

export const scrapeAndStore = async (productUrl: string): Promise<string | void> => {
  if (!productUrl) {
    return;
  }

  try {
    await connectToDb();

    //ON SCRAPPE DEPUIS AMAZON
    const scrapped = await scrapeAmazonProduct(productUrl);
    if (!scrapped) {
      console.log('PAS DE SRCAPPED');
      return;
    }

    let product = scrapped;

    //ON CHECK S'IL EST DEJA DANS LA DATABASE
    const existingProduct = await Product.findOne({
      $or: [{ url: product.url }, { title: product.title }],
    });

    //SI OUI ON UPDATE LHISTORIQUE DES PRIX
    if (existingProduct) {
      const p = await updatePriceDataAndSave(existingProduct, product.currentPrice);
      revalidatePath(`/products/${existingProduct._id}`);
      return p._id.toString()
    }

    //SINON UN CREE UN NOUVEAU PRODUCT DANS LA DB
    const p = new Product(product);
    p.priceHistory.push({
      price: product.currentPrice,
      date: Date.now().toString(),
    });
    p.averagePrice = getAveragePrice(p.priceHistory);
    await p.save();
    revalidatePath(`/products/${p._id}`);
    return p._id.toString();
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

export const getProductsByCategory = async (category: string, id: string) => {
  try {
    await connectToDb();
    const products = await Product.find({
      category: { $in: category },
      _id: { $ne: id },
    }).limit(3);
    products.forEach((p) => console.log(p._id));
    return products;
  } catch (error) {
    console.log("error productsbyId : ", error);
  }
};

export const searchProducts = async (key: string) => {
  console.log('SEARCH PRODUCTS');
  try {
    await connectToDb();
    const products = await Product.find({
      $or: [
        { title: { $regex: key, $options: 'i' } },
        { category: { $regex: key, $options: 'i' } },
        { description: { $regex: key, $options: 'i'}}
      ]
    })
    return products.map(p => {return {title: p.title, id: p._id.toString()}});
  } catch (error) {
    console.log(error)
  }
}

export const modalSubmit = async (
  state: IModalState,
  fd: FormData
): Promise<IModalState> => {
  const email = fd.get("email");
  const productId = fd.get("productId");

  //const r = await new Promise(reesolve => setTimeout(reesolve, 2500));

  if (!email || !email.toString().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
    return { ...state, error: "Please providee a valid address." };
  }
  try {
    const product = await Product.findById(productId);

    //SI AUCUN PRODUCT AVEC L'ID, ON RETURN
    if (!product) {
      return { ...state, error: "Can't find product with this ID 😥." };
    }

    const existingUser = product.users?.find((user) => {
      console.log(user.email, email.toString().toLowerCase())
      return user.email === email.toString().toLowerCase();
    });

    //SI L'USER TRACK DEJA LE PRODUCT, ON RETURN
    if (existingUser) {
      return { error: "This email is already attached to this product." };
    }

    //SINON ON LE PUSH DANS LE PRODUCT ET ON SAVE
    product.users?.push({ email: email.toString().toLowerCase() });
    await product.save();

    const mailBody = generateMailBody({ title: product.title, url: product.url }, 'WELCOME')

    const m = await sendEmail(mailBody, [email.toString()]);

    return { success: true};

  } catch (err: any) {
    console.log(err);
    return { error: err?.message };
  }
};

export const updatePriceDataAndSave = async (product: IProductModel, newPrice: number) => {
  product.priceHistory.push({
    price: newPrice,
    date: Date.now().toString()
  })
  product.lowestPrice = getLowestPrice(product.priceHistory);
  product.highestPrice = getHighestPrice(product.priceHistory, newPrice);
  product.averagePrice = getAveragePrice(product.priceHistory);

  return product.save();
}
