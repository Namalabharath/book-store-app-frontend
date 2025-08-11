import React, { useEffect, useState, useRef } from 'react'
import BookCard from '../books/BookCard';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const categories = ["Choose a genre", "Business", "Fiction", "Horror", "Adventure"]

const TopSellers = () => {
    const swiperRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState("Choose a genre");

    // const [books,setBooks]=useState([]);
    
    // useEffect(()=>{
    //     fetch("books.json")
    //     .then(res=>res.json())
    //     .then((data)=>setBooks(data))
    // },[])
    const {data: books = []} = useFetchAllBooksQuery();
  
    const filteredBooks = selectedCategory === "Choose a genre" ? books : books.filter(book => book.category === selectedCategory.toLowerCase())

    const goNext = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };

    const goPrev = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    return (
        <div className='py-10'>
            <h2 className='text-3xl font-semibold mb-6'>Most Shared Books</h2>
            {/* category filtering */}
            <div className='mb-8 flex items-center'>
                <select
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    name="category" id="category" className='border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none'>
                    {
                        categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))
                    }
                </select>
            </div>

            <div className="relative">
                {/* Custom Navigation Buttons */}
                <button 
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-50 bg-white hover:bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                    style={{ zIndex: 1000 }}
                >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <button 
                    onClick={goNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50 bg-white hover:bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                    style={{ zIndex: 1000 }}
                >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <Swiper
                    ref={swiperRef}
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
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
                        1180: {
                            slidesPerView: 3,
                            spaceBetween: 50,
                        }
                    }}
                    modules={[Navigation]}
                    className="mySwiper px-4"
                >

                    {
                       filteredBooks.length > 0 && filteredBooks.map((book, index) => (
                            <SwiperSlide key={index}>
                                <BookCard  book={book} />
                            </SwiperSlide>
                        ))
                    }

                </Swiper>
            </div>


        </div>
    )
}

export default TopSellers