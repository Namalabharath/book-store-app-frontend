

import React from 'react';
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import { useAuth } from '../../context/AuthContext';

const OrderPage = () => {
    const { currentUser } = useAuth();

    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser.email);
    const { data: books = [], isLoading: booksLoading } = useFetchAllBooksQuery();

    if (isLoading || booksLoading) {
        return <div className="text-center text-blue-600 mt-10 text-lg">Loading your orders...</div>;
    }

    if (isError) {
        return <div className="text-center text-red-600 mt-10 text-lg">Error fetching order data.</div>;
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
                <div className="text-center text-gray-600 text-lg">No orders found!</div>
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
                                <p className="text-sm text-gray-500">
                                    Order ID: <span className="font-mono text-blue-700">{order._id}</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <p><span className="font-semibold text-blue-800">Name:</span> {order.name}</p>
                                    <p><span className="font-semibold text-blue-800">Email:</span> {order.email}</p>
                                    <p><span className="font-semibold text-blue-800">Phone:</span> {order.phone}</p>
                                    <p><span className="font-semibold text-blue-800">Total:</span> ₹{order.totalPrice}</p>
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

