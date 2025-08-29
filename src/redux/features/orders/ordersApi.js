import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";


const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/orders`,
        credentials: 'include',
        prepareHeaders: (Headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                Headers.set('Authorization', `Bearer ${token}`);
            }
            return Headers;
        }
    }),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        createOrder: (builder.mutation) ({
            query: (newOrder) => ({
                url: "/",
                method: "POST",
                body: newOrder,
                credentials: 'include',
            }),
            invalidatesTags: ['Orders']
        }),
        getOrderByEmail: (builder.query) ({
            query: (email) => ({
                url: `/email/${email}`
            }),
            providesTags: ['Orders']
        }),
        // Admin: Get all orders
        fetchAllOrders: (builder.query) ({
            query: () => ({
                url: "/"
            }),
            providesTags: ['Orders']
        }),
        // Admin: Update order status
        updateOrderStatus: (builder.mutation) ({
            query: ({ orderId, orderStatus }) => ({
                url: `/${orderId}/status`,
                method: "PATCH",
                body: { orderStatus },
                credentials: 'include',
            }),
            invalidatesTags: ['Orders']
        })
    })
})

export const {
    useCreateOrderMutation, 
    useGetOrderByEmailQuery,
    useFetchAllOrdersQuery,
    useUpdateOrderStatusMutation
} = ordersApi;

export default ordersApi;