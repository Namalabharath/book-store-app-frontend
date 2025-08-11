import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getImgUrl } from '../../utils/getImgUrl';
import { 
    clearCart, 
    removeFromCart, 
    increaseQuantity, 
    decreaseQuantity, 
    updateQuantity 
} from '../../redux/features/cart/cartSlice';
import { useAuth } from '../../context/AuthContext';

const CartPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const dispatch =  useDispatch();
    const { currentUser } = useAuth();

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.newPrice * (item.quantity || 1)), 0).toFixed(2);
    const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart({ 
            product, 
            userId: currentUser?.id 
        }));
    }

    const handleClearCart = () => {
        dispatch(clearCart(currentUser?.id));
    }

    const handleIncreaseQuantity = (product) => {
        dispatch(increaseQuantity({ 
            product, 
            userId: currentUser?.id 
        }));
    }

    const handleDecreaseQuantity = (product) => {
        dispatch(decreaseQuantity({ 
            product, 
            userId: currentUser?.id 
        }));
    }

    const handleQuantityChange = (product, quantity) => {
        const newQuantity = parseInt(quantity);
        if (newQuantity > 0) {
            dispatch(updateQuantity({ 
                product, 
                quantity: newQuantity, 
                userId: currentUser?.id 
            }));
        }
    }
    return (
        <>
            <div className="flex mt-12 h-full flex-col overflow-hidden bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                        <div className="text-lg font-medium text-gray-900">Shopping cart</div>
                        <div className="ml-3 flex h-7 items-center ">
                            <button
                                type="button"
                                onClick={handleClearCart }
                                className="relative -m-2 py-1 px-2 bg-red-500 text-white rounded-md hover:bg-secondary transition-all duration-200  "
                            >
                                <span className="">Clear Cart</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flow-root">

                            {
                                cartItems.length > 0 ? (
                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                        {
                                            cartItems.map((product) => (
                                                <li key={product?._id} className="flex py-6">
                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                        <img
                                                            src={product.coverImage}
                                                            alt={product.title}
                                                            className="h-full w-full object-cover object-center"
                                                        />
  
                                                    </div>

                                                    <div className="ml-4 flex flex-1 flex-col">
                                                        <div>
                                                            <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                                                                <h3>
                                                                    <Link to='/'>{product?.title}</Link>
                                                                </h3>
                                                                <p className="sm:ml-4">₹{(product?.newPrice * (product.quantity || 1)).toFixed(2)}</p>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-500 capitalize"><strong>Category: </strong>{product?.category}</p>
                                                            <p className="mt-1 text-sm text-gray-600"><strong>Price each: </strong>₹{product?.newPrice}</p>
                                                        </div>
                                                        <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                                                            {/* Quantity Controls */}
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-gray-500 font-medium">Qty:</span>
                                                                <div className="flex items-center border rounded">
                                                                    <button 
                                                                        onClick={() => handleDecreaseQuantity(product)}
                                                                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50"
                                                                        disabled={(product.quantity || 1) <= 1}
                                                                    >
                                                                        <span className="text-lg font-semibold">−</span>
                                                                    </button>
                                                                    
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        max="99"
                                                                        value={product.quantity || 1}
                                                                        onChange={(e) => handleQuantityChange(product, e.target.value)}
                                                                        className="w-12 h-8 text-center border-l border-r text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                                    />
                                                                    
                                                                    <button 
                                                                        onClick={() => handleIncreaseQuantity(product)}
                                                                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                                                    >
                                                                        <span className="text-lg font-semibold">+</span>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="flex">
                                                                <button
                                                                onClick={() => handleRemoveFromCart(product)}
                                                                type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        }



                                    </ul>
                                ) : (<p>No product found!</p>)
                            }


                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal ({totalItems} items)</p>
                        <p>₹{totalPrice ? totalPrice : 0}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                        <Link
                            to="/checkout"
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            Checkout
                        </Link>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <Link to="/">
                            or
                            <button
                                type="button"

                                className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                            >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartPage
