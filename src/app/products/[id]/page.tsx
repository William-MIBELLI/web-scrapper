import { getProductById } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { FC } from "react";

interface IProps {
  params: {
    id: string;
  };
}
const ProductDetails: FC<IProps> = async ({ params: { id } }) => {
  const product = await getProductById(id);

  if (!product) {
    return redirect("/");
  }

  const { image, title, url, reviewsCount, currency, currentPrice, originalPrice } = product;

  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image
            src={image}
            alt={title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {title}
              </p>
              <Link
                href={url}
                target="_blank"
                className="text-black opcaity-50"
              >
                Visit product
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="product-hearts">
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="review count"
                  width={20}
                  height={20}
                />
                <p className="text-basee font-semibold text-[#D46F77]">
                  {reviewsCount}
                </p>
              </div>
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/share.svg"
                  alt="share"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {currency} {currentPrice / 100}
              </p>
              <p className="text-[34px] text-secondary font-bold opacity-50 line-through">
                {currency} {originalPrice / 100}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
