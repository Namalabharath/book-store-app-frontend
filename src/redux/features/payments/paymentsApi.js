import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/payments`,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const paymentsApi = createApi({
    reducerPath: 'paymentsApi',
    baseQuery,
    tagTypes: ['Payment'],
    endpoints: (builder) => ({
        createRazorpayOrder: builder.mutation({
            query: (orderData) => ({
                url: '/create-order',
                method: 'POST',
                body: orderData,
            }),
        }),
        verifyPayment: builder.mutation({
            query: (paymentData) => ({
                url: '/verify',
                method: 'POST',
                body: paymentData,
            }),
        }),
    }),
});

export const {
    useCreateRazorpayOrderMutation,
    useVerifyPaymentMutation,
} = paymentsApi;

export default paymentsApi;
