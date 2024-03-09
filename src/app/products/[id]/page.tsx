import Modal from "@/components/Modal";
import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";
import { getProductById, getProductsByCategory } from "@/lib/actions";
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

  
  const {
    image,
    title,
    url,
    reviewsCount,
    currency,
    currentPrice,
    originalPrice,
    stars,
    averagePrice, 
    highestPrice,
    lowestPrice,
    description,
    category,
    _id
  } = product;
  
  const similarProducts = await getProductsByCategory(category[category.length - 1], _id);

  return (
    <div className="product-container">
      {/* PRODUCT HEADER */}
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image
            src={image}
            alt={title}
            width={580}
            height={400}
            className="mx-auto max-w-full w-auto"
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
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="product-stars">
                  <Image
                    src="/assets/icons/star.svg"
                    alt="star"
                    width={16}
                    height={16}
                  />
                  <p className="teext-sm text-primary-orange font-semibold">
                    {stars}
                  </p>
                </div>
                <div className="product-reviews">
                  <Image
                    src="/assets/icons/comment.svg"
                    alt="comment"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-secondary font-semibold">
                    {reviewsCount} Reviews
                  </p>
                </div>
              </div>
              <p className="text-sm text-black opacity-50">
                <span className="text-primary-green font-semibold">93% </span>{" "}
                of buyers have recomended this.
              </p>
            </div>
          </div>

          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${currency}${currentPrice / 100}`}
              />
              <PriceInfoCard
                title="Average"
                iconSrc="/assets/icons/chart.svg"
                value={`${currency}${averagePrice / 100}`}
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${currency}${highestPrice / 100}`}
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${currency}${lowestPrice / 100}`}
              />
            </div>
          </div>
          <Modal productId={_id.toString()} />
        </div>
      </div>
      {/* PRODUCT DESCRIPTION */}
      <div className="flex flex-col gap-16">
        <h3 className="text-3xl text-secondary font-semibold">Product Description</h3>
        <div className="flex flex-col gap-4">
          {description.split('\n')}
        </div>
        <Link href={'/'} className="text-base text-white">
          <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]" type="button">
            <Image
              src="/assets/icons/bag.svg"
              alt="check"
              width={22}
              height={22}
          /> Buy Now
          </button>
        </Link>
      </div>
      {/* SIMILAR PRODUCTS */}
      {
        similarProducts && similarProducts?.length > 0 && (
          <div className="py-14 flex flex-col gap-2 w-full">
            <p className="section-text">Similar Products</p>
            <div className="flex flex-wrap gap-10 mt-7 w-full">
              {
                similarProducts.map(product => (
                  <ProductCard key={product._id} product={product}/>
                ))
              }
            </div>
          </div>
        )
      }
    </div>
  );
};

export default ProductDetails;
