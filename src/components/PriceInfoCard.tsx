import Image from 'next/image'
import React, { FC } from 'react'


interface IProps {
  title: string,
  iconSrc: string,
  value: string,
}
const PriceInfoCard: FC<IProps> = ({ title, iconSrc, value }) => {
  
  return (
    <div className={`price-info_card`}>
      <p className='text-base text-black-900'>{title}</p>
      <div className="flex gap-1">
        <Image
          src={iconSrc}
          alt={title}
          width={24}
          height={24}
        />
        <p className='text-2xl font-bold text-secondary'>{value}</p>
      </div>
    </div>
  )
}

export default PriceInfoCard