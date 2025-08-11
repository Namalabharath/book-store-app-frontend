import React from 'react'

import bannerImg from "../../assets/bannerimg.jpg"

// const Banner = () => {
//   return (
//     <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
//          <div className='md:w-1/2 w-full flex items-center md:justify-end'>
//             <img src={bannerImg} alt="" />
//         </div>
        
//         <div className='md:w-1/2 w-full'>
//             <h1 className='md:text-5xl text-2xl font-medium mb-7'>New Releases This Week</h1>
//             <p className='mb-10'>It's time to update your reading list with some of the latest and greatest releases in the literary world. From heart-pumping thrillers to captivating memoirs, this week's new releases offer something for everyone</p>

//             <button className='btn-primary'>Subscribe</button>
//         </div>

       
//     </div>
//   )
// }


// export default Banner
const Banner = () => {
  return (
    // <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
    //   <div className='md:w-1/2 w-full flex items-center md:justify-end'>
    //     <img src={bannerImg} alt="" />
    //   </div>

    //   <div className='md:w-1/2 w-full'>
    //     <h1 className='md:text-5xl text-2xl font-medium mb-7'>Give Books a Second Life</h1>
    //     <p className='mb-10'>
    //       Don’t let valuable study material go to waste. Our platform helps students pass on their gently used books to others who need them — affordably, sustainably, and meaningfully.
    //     </p>

    //     <button className='btn-primary'>Share or Discover Books</button>
    //   </div>
    // </div>
    <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
  <div className='md:w-1/2 w-full flex items-center md:justify-end'>
    <img 
      src={bannerImg} 
      alt="Students sharing books" 
      className="max-h-[400px] w-auto object-contain md:ml-auto"
    />
  </div>

  <div className='md:w-1/2 w-full'>
    <h1 className='md:text-5xl text-2xl font-medium mb-7'>Give Books a Second Life</h1>
    <p className='mb-10'>
      Don’t let valuable study material go to waste. Our platform helps students pass on their gently used books to others who need them — affordably, sustainably, and meaningfully.
    </p>

    <button className='btn-primary'>Share or Discover Books</button>
  </div>
</div>

  );
};

export default Banner;
