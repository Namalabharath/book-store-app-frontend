import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import { MdIncompleteCircle } from 'react-icons/md'

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${getBaseUrl()}/admin`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                })

                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if(loading) return <Loading/>

    return (
        <div className="space-y-6">
            {/* Stats Cards Section */}
            <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">{data?.totalBooks || 0}</span>
                        <span className="block text-gray-500">Total Books</span>
                    </div>
                </div>
                
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">₹{data?.totalSales || 0}</span>
                        <span className="block text-gray-500">Total Sales</span>
                    </div>
                </div>
                
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                    </div>
                    <div>
                        <span className="inline-block text-2xl font-bold">{data?.trendingBooks || 0}</span>
                        <span className="block text-gray-500">Trending Books</span>
                    </div>
                </div>
                
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                        <MdIncompleteCircle className='size-6'/>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">{data?.totalOrders || 0}</span>
                        <span className="block text-gray-500">Total Orders</span>
                    </div>
                </div>
            </section>

            {/* Monthly Sales Chart Section */}
            <section className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 font-semibold border-b border-gray-100">
                    Monthly Sales Overview
                </div>
                <div className="p-4">
                    {data?.monthlySales && data.monthlySales.length > 0 ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Sales by Month</h3>
                            <div className="grid gap-4">
                                {data.monthlySales.map((monthData, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="font-medium">{monthData._id}</span>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-green-600">₹{monthData.totalSales}</div>
                                            <div className="text-sm text-gray-500">{monthData.totalOrders} orders</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400 text-lg">
                            No sales data available
                        </div>
                    )}
                </div>
            </section>

            {/* Quick Actions Section */}
            <section className="grid md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button 
                            onClick={() => navigate('/dashboard/add-new-book')}
                            className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <div className="font-medium text-blue-700">Add New Book</div>
                            <div className="text-sm text-blue-600">Create a new book listing</div>
                        </button>
                        <button 
                            onClick={() => navigate('/dashboard/manage-books')}
                            className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        >
                            <div className="font-medium text-green-700">Manage Books</div>
                            <div className="text-sm text-green-600">Edit existing books</div>
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="text-gray-500">
                        <div className="text-sm">Total Books: {data?.totalBooks || 0}</div>
                        <div className="text-sm">Total Orders: {data?.totalOrders || 0}</div>
                        <div className="text-sm">Trending Books: {data?.trendingBooks || 0}</div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">System Status</h3>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">Database Connected</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">API Services Running</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Dashboard
