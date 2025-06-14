import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { getImgUrl } from '../../utils/getImgUrl'

import { Link } from'react-router-dom'

 import { useDispatch } from'react-redux'
 import { addToCart } from '../../redux/features/cart/cartSlice'

const BookCard = ({book}) => {
    const dispatch =  useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }
    return (
        <div className="rounded-lg transition-shadow duration-300 p-4 shadow-md bg-white w-80 sm:w-96 h-50 flex flex-row items-center gap-4">
            
            {/* Image Section */}
            <div className="h-36 w-28 sm:h-40 sm:w-32 border rounded-md flex-shrink-0">
                <Link to={`/books/${book._id}`}>
                    <img
                        src={getImgUrl(book?.coverImage)}
                        alt={book?.title}
                        className="w-full h-full object-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
                    />
                </Link>
            </div>

            {/* Book Info Section */}
            <div className="flex flex-col justify-between h-full w-full overflow-hidden">
                <div className="flex-grow">
                    <Link to={`/books/${book._id}`}>
                        <h3 className="text-lg font-semibold hover:text-blue-600 mb-1 truncate">
                            {book?.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {book?.description}
                    </p>
                    <p className="font-medium mt-1">
                    ₹{book?.newPrice} <span className="line-through font-normal ml-2 text-gray-500">₹{book?.oldPrice}</span>
                    </p>
                </div>

                {/* Add to Cart Button */}
                <button 
                    onClick={() => handleAddToCart(book)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-md flex items-center gap-2 w-max text-center mt-2"
                >
                    <FiShoppingCart />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>

    )
    
}

export default BookCard
