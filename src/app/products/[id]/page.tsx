import React, { FC } from 'react'


interface IProps {
  params: {
    id: string
  }
}
const ProductDetails: FC<IProps> = ({ params: {id}}) => {
  return (
    <div>PRODUCT DETAILS {id}</div>
  )
}

export default ProductDetails