"use client";

import React, { ChangeEvent, useState } from "react";
import { Input } from "@nextui-org/react";
import Image from "next/image";
import { searchProducts } from "@/lib/actions";
import Link from "next/link";

interface IProductSearch {
  title: string;
  id: string;
}

const NavBarSearch = () => {
  const [value, setValue] = useState("");
  const [products, setProducts] = useState<IProductSearch[]>([]);
  const [focus, setFocus] = useState(false);
  const [linkFocus, setLinkFocus] = useState(false);

  const changeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    
    setValue(value);
    try {
      if (value !== "") {
        //const r = await new Promise(resolve => setTimeout(resolve, 500));
        const p = await searchProducts(value);
        if (p) {
          setProducts(p);
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clickHandler = () => {
    setFocus(false);
    setValue("");
    setProducts([]);
  };

  const blurHandler = () => {
    if (!linkFocus) {
      setFocus(false);
    }
  };

  return (
    <div
      className="flex flex-col relative w-80"
      onFocus={() => setFocus(true)}
      onBlur={blurHandler}
    >
      <Input
        size="sm"
        placeholder="Search for tracked product..."
        value={value}
        onChange={changeHandler}
        endContent={
          <Image
            src={"/assets/icons/search.svg"}
            alt={"search"}
            height={28}
            width={28}
            className="object-contain cursor-pointer"
          />
        }
      />
      {focus && products.length > 0 && (
        <div
          className="flex flex-col absolute top-full w-full z-50 "
          onMouseEnter={() => setLinkFocus(true)}
          onMouseLeave={() => setLinkFocus(false)}
          onBlur={() => setFocus(false)}
        >
          {products.map((product) => (
            <Link
              key={product.title}
              href={`/products/${product.id}`}
              className="truncate"
              onClick={clickHandler}
            >
              <div className="border-b-3 border-gray-600 bg-gray-100  h-16 flex justify-center items-center">
                <p className="text-sm font-semibold">
                  {product.title.substring(0, 35)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavBarSearch;
