import React from "react";
import HeroCarousel from "@/components/HeroCarousel";
import Searchbar from "@/components/Searchbar";
import Image from "next/image";
import { redirect } from "next/navigation";

const SearchSection = () => {
  

  const navigate = async (productId: string): Promise<void> => {
    'use server';
    redirect(`/products/${productId}`);
  }

  return (
    <section className="px-6 md:px-20 py-20">
      <div className="flex max-lg:flex-col gap-16">
        <div className="flex flex-col justify-center">
          <p className="small-text">
            Smart Shopping start here:
            <Image
              src="/assets/icons/arrow-right.svg"
              alt="arrow right"
              width={16}
              height={16}
            />
          </p>
          <h1 className="head-text">
            Unleash the power of
            <span className="text-primary"> PriceWise</span>
          </h1>
          <p className="mt-6">
            Powerful, self-serve product and growth analytics to help your
            convert, engage, and retain more.
          </p>
          <Searchbar navigate={navigate} />
        </div>
        <HeroCarousel />
      </div>
    </section>
  );
};

export default SearchSection;
