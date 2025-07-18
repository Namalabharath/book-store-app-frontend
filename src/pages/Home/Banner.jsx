import React from 'react'

import bannerImg from "../../assets/banner.png"

const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
         <div className='md:w-1/2 w-full flex items-center md:justify-end'>
            <img src={bannerImg} alt="" />
        </div>
        
        <div className='md:w-1/2 w-full'>
            <h1 className='md:text-5xl text-2xl font-medium mb-7'>Give Books a Second Life</h1>
            <p className='mb-10'>Don’t let valuable study material go to waste. Our platform helps students pass on their gently used books to others who need them — affordably, sustainably, and meaningfully.</p>

            <button className='btn-primary'>Subscribe</button>
        </div>

       
    </div>
  )
}


export default Banner
