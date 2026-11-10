import React from 'react'
import CategoryList from '../component/CategoryList'
import BannerProduct from '../component/BannerProduct'
import HorizontalCartProduct from '../component/HorizontalCartProduct'
import VerticalCartProduct from '../component/VerticalCartProduct'

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />
      
      <HorizontalCartProduct category={"airpods"} heading={"Top's Airpodes"} />
      <HorizontalCartProduct category={"watches"} heading={"Popular's Watches"} />

      <VerticalCartProduct category={"mobiles"} heading={"Mobiles"} />
      <VerticalCartProduct category={"mouse"} heading={"Mouse"} />
      <VerticalCartProduct category={"television"} heading={"Television"} />
      <VerticalCartProduct category={"camera"} heading={"Camera"} />
      <VerticalCartProduct category={"earphones"} heading={"Earphones"} />
      <VerticalCartProduct category={"speakers"} heading={"Speakers"} />
      <VerticalCartProduct category={"refrigerator"} heading={"Refrigerator"} />
      <VerticalCartProduct category={"trimmers"} heading={"Trimmers"} />
    </div>
  )
}

export default Home