import { IProductModel } from '@/lib/models/product.model'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'

interface IProps {
  product: IProductModel
}
const ProductCard: FC<IProps> = ({ product }) => {

  const { image, title, category, currency, currentPrice } = product;

  return (
    <Link href={`/products/${product._id}`} className='product-card'>
      <div className='product-card_img-container'>
        <Image
          src={image}
          alt={title}
          width={200}
          height={200}
          className='product-card_img'
        />
      </div>
      <div className='flex flex-col gap-3'>
        <h3 className='product-title border-y border-y-[#E4E4E4] py-4'>{title}</h3>
        <div className='flex justify-between'>
          <p className='text-black opacity-50 text-lg capitalize'>
            {category}
          </p>
          <p>
            <span className='text-slate-400 text-lg font-semibold'>{currentPrice/100 }</span>
            <span >{currency}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard