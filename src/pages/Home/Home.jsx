import React from 'react'
import Banner from './Banner'
import TopSellers from './TopSellers'
import Recommened from './Recommened'
import News from './News'
const Home = () => {
  return (
    <div >
      <Banner/>
      <TopSellers></TopSellers>
      <Recommened></Recommened>
      <News></News>
    </div>
  )
}

export default Home
