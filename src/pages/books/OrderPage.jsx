

import React from 'react';
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import { useAuth } from '../../context/AuthContext';

const OrderPage = () => {
    const { currentUser } = useAuth();

    const { data: orders = [], isLoading, isError, error } = useGetOrderByEmailQuery(currentUser.email);
    const { data: books = [], isLoading: booksLoading } = useFetchAllBooksQuery();

    if (isLoading || booksLoading) {
        return <div className="text-center text-blue-600 mt-10 text-lg">Loading your orders...</div>;
    }

    // Check if it's a real error (not just empty orders)
    if (isError && error?.status !== 404) {
        return (
            <div className="container mx-auto p-6 max-w-5xl text-center">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
                <p className="text-red-500 text-lg">We couldn't fetch your orders right now. Please try again later.</p>
                <p className="text-gray-600 text-sm mt-2">Error: {error?.message || 'Unknown error occurred'}</p>
            </div>
        );
    }

    // Create a map of book IDs to book objects for quick lookup
    const bookMap = {};
    books.forEach(book => {
        bookMap[book._id] = book;
    });

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b-4 border-yellow-400 pb-2">Your Orders</h2>

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                        <div className="mb-6">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet!</h3>
                        <p className="text-gray-500 text-lg mb-6">You haven't placed any orders yet.</p>
                        <a 
                            href="/" 
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Start Shopping
                        </a>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <div
                            key={order._id}
                            className="p-6 rounded-2xl shadow-lg bg-white border border-blue-100 hover:shadow-xl transition duration-300"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm bg-yellow-400 text-blue-900 px-3 py-1 rounded-full font-semibold shadow">
                                    Order #{index + 1}
                                </p>
                                <div className="text-right text-sm text-gray-500">
                                    <p>Order ID: <span className="font-mono text-blue-700">{order._id}</span></p>
                                    <p>Date: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span></p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <p><span className="font-semibold text-blue-800">Name:</span> {order.name}</p>
                                    <p><span className="font-semibold text-blue-800">Email:</span> {order.email}</p>
                                    <p><span className="font-semibold text-blue-800">Phone:</span> {order.phone}</p>
                                    <p><span className="font-semibold text-blue-800">Total:</span> ₹{order.totalPrice}</p>
                                    
                                    {/* Payment and Order Status */}
                                    <div className="mt-3 p-2 bg-gray-50 rounded-lg space-y-2">
                                        <p><span className="font-semibold text-blue-800">Payment:</span> 
                                            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                                                order.paymentMethod === 'online' || order.paymentStatus === 'paid'
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                {order.paymentMethod === 'online' || order.paymentStatus === 'paid' ? 'PAID' : 'COD'}
                                            </span>
                                        </p>
                                        <p><span className="font-semibold text-blue-800">Status:</span> 
                                            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1) : 'Pending'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-800">Address:</p>
                                    <p className="text-gray-700 ml-2">
                                        {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="font-semibold text-blue-800 mb-2">Books Ordered:</p>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    {order.products && order.products.length > 0 ? (
                                        // New order format with products array
                                        <ul className="list-disc list-inside space-y-1">
                                            {order.products.map((product, idx) => (
                                                <li key={idx} className="text-blue-700 font-medium">
                                                    {product.title || product.bookId?.title || "Unknown Book"} 
                                                    <span className="text-gray-600 text-sm ml-2">(Qty: {product.quantity || 1})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : order.productIds && order.productIds.length > 0 ? (
                                        // Old order format with productIds
                                        <ul className="list-disc list-inside space-y-1">
                                            {order.productIds.map((productId, idx) => {
                                                const book = bookMap[productId];
                                                return (
                                                    <li key={idx} className="text-blue-700 font-medium">
                                                        {book ? book.title : `Unknown Book (ID: ${productId})`}
                                                        <span className="text-gray-600 text-sm ml-2">(Qty: 1)</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <div className="text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                                            <p className="font-medium">⚠️ Order data incomplete</p>
                                            <p className="text-sm mt-1">
                                                This order has a total of ₹{order.totalPrice} but no product information was saved.
                                                This may have occurred due to a technical issue during order placement.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderPage;

