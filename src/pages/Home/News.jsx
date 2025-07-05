import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

import news1 from "../../assets/news/news-1.png"
import news2 from "../../assets/news/news-2.png"
import news3 from "../../assets/news/news-3.png"
import news4 from "../../assets/news/news-4.png"
import { Link } from 'react-router-dom';
const news = [
  {
    id: 1,
    title: "From Trash to Treasure: How Students Are Saving Books",
    description: "Instead of discarding old textbooks, students are sharing them with others through our platform — reducing waste and making education more affordable.",
    image: news1
  },
  {
    id: 2,
    title: "Second-Hand, First-Class: The Rise of Reused Books",
    description: "Learn how reused books are benefiting students and the environment — with stories from our campus contributors who’ve saved big through peer-to-peer exchanges.",
    image: news2
  },
  {
    id: 3,
    title: "Why Buying Used Is the Smart Student Choice",
    description: "Used books not only save money — they come with notes, highlights, and insights that can help the next student understand topics better.",
    image: news3
  },
  {
    id: 4,
    title: "How One Book Helped Three Students Succeed",
    description: "A single book passed through three students — each sharing their own experience. Find out how shared books build a stronger academic community.",
    image: news4
  },
  {
    id: 5,
    title: "Eco-Friendly Education: The Power of Reuse",
    description: "Sustainable student living starts with responsible choices. See how book sharing is reducing our academic carbon footprint.",
    image: news2
  }
];

const News = () => {
  return (
    <div className='py-16'>
        <h2 className='text-3xl font-semibold mb-6'>News </h2>

        <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        
        {
            news.map((item, index) => (
                <SwiperSlide key={index}>
                    <div className='flex flex-col sm:flex-row sm:justify-between items-center gap-12'>
                        {/* content */}
                        <div className='py-4'>
                            <Link to="/">
                                 <h3 className='text-lg font-medium hover:text-blue-500 mb-4'>{item.title}</h3>
                            </Link>
                            <div className='w-12 h-[4px] bg-primary mb-5'></div>
                            <p className='text-sm text-gray-600'>{item.description}</p>
                        </div>

                        <div className='flex-shrink-0'>
                            <img src={item.image} alt=""  className='w-full object-cover'/>
                        </div>
                    </div>
                </SwiperSlide>
            ) )
        }
      </Swiper>
    </div>
  )
}

export default News
