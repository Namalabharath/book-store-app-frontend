import React, { useState } from 'react';
import { useFetchAllOrdersQuery, useUpdateOrderStatusMutation } from '../../../redux/features/orders/ordersApi';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';

const ManageOrders = () => {
    const { data: orders = [], isLoading, isError, refetch } = useFetchAllOrdersQuery();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Handle order status update
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus({ orderId, orderStatus: newStatus }).unwrap();
            
            Swal.fire({
                title: "Success!",
                text: `Order status updated to ${newStatus}`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            
            refetch(); // Refresh the orders list
        } catch (error) {
            console.error('Error updating order status:', error);
            
            Swal.fire({
                title: "Error!",
                text: error.data?.message || "Failed to update order status",
                icon: "error"
            });
        }
    };

    // Get status color classes
    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter orders based on search and status
    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order._id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    if (isLoading) return <Loading />;

    if (isError) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 text-lg">Error loading orders. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Orders</h2>
            
            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by name, email, or order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => {
                    const count = orders.filter(order => order.orderStatus === status).length;
                    return (
                        <div key={status} className="bg-white p-4 rounded-lg shadow border">
                            <h3 className="font-medium text-gray-600 capitalize">{status}</h3>
                            <p className="text-2xl font-bold text-gray-800">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 text-lg">No orders found matching your criteria.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition duration-200"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="mt-2 lg:mt-0">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Pending'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <p><span className="font-medium">Customer:</span> {order.name}</p>
                                    <p><span className="font-medium">Email:</span> {order.email}</p>
                                    <p><span className="font-medium">Phone:</span> {order.phone}</p>
                                </div>
                                <div>
                                    <p><span className="font-medium">Payment:</span> 
                                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                            order.paymentMethod === 'online' || order.paymentStatus === 'paid'
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-orange-100 text-orange-800'
                                        }`}>
                                            {order.paymentMethod === 'online' || order.paymentStatus === 'paid' ? 'PAID' : 'COD'}
                                        </span>
                                    </p>
                                    <p><span className="font-medium">Total:</span> ₹{order.totalPrice}</p>
                                    <p><span className="font-medium">Items:</span> {order.products?.length || 0}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Address:</p>
                                    <p className="text-sm text-gray-600">
                                        {order.address.city}, {order.address.state}<br/>
                                        {order.address.country} - {order.address.zipcode}
                                    </p>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="mb-4">
                                <p className="font-medium mb-2">Products:</p>
                                <div className="bg-gray-50 p-3 rounded">
                                    {order.products && order.products.length > 0 ? (
                                        <ul className="text-sm space-y-1">
                                            {order.products.map((product, idx) => (
                                                <li key={idx}>
                                                    {product.title || product.bookId?.title || "Unknown Book"} 
                                                    <span className="text-gray-600 ml-2">(Qty: {product.quantity || 1})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-600">No product details available</p>
                                    )}
                                </div>
                            </div>

                            {/* Status Update */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t">
                                <p className="font-medium mb-2 sm:mb-0">Update Status:</p>
                                <div className="flex gap-2 flex-wrap">
                                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(order._id, status)}
                                            disabled={order.orderStatus === status}
                                            className={`px-3 py-1 rounded text-sm font-medium transition duration-200 ${
                                                order.orderStatus === status
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                            }`}
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
