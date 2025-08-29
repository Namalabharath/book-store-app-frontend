import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form"
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from'sweetalert2';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
import { useCreateRazorpayOrderMutation, useVerifyPaymentMutation } from '../../redux/features/payments/paymentsApi';
import baseURL from '../../utils/baseURL';

const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.newPrice * (item.quantity || 1)), 0).toFixed(2);
    const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const { currentUser } = useAuth()
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
        trigger,
    } = useForm({ mode: 'onChange' })

    const [createOrder, {isLoading, error}] = useCreateOrderMutation();
    const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
    const [verifyPayment] = useVerifyPaymentMutation();
    const navigate = useNavigate()

    const [isChecked, setIsChecked] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Watch form fields for validation
    const watchedFields = watch(['name', 'phone', 'city', 'state', 'country', 'zipcode']);
    const isFormValid = watchedFields.every(field => field && field.trim() !== '') && currentUser?.email;

    // Load Razorpay script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCODOrder = async (orderData) => {
        try {
            const result = await createOrder(orderData).unwrap();
            
            Swal.fire({
                title: "Order Confirmed!",
                text: "Your order has been placed successfully. You will pay on delivery.",
                icon: "success",
                confirmButtonText: "OK"
            });
            
            navigate("/orders");
        } catch (error) {
            console.error("Error placing COD order:", error);
            console.error("Error details:", error.data || error.message);
            Swal.fire({
                title: "Order Failed!",
                text: error.data?.message || error.message || "Failed to place your order. Please try again.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    };

    const handleOnlinePayment = async (orderData) => {
        setIsProcessingPayment(true);
        
        try {
            // Create Razorpay order using RTK Query
            const razorpayOrderResult = await createRazorpayOrder({
                amount: Math.round(parseFloat(totalPrice) * 100), // Convert to paise
                currency: 'INR',
                orderData: orderData
            }).unwrap();

            if (!razorpayOrderResult.success) {
                throw new Error(razorpayOrderResult.message || 'Failed to create payment order');
            }

            // Load Razorpay script
            const isRazorpayLoaded = await loadRazorpayScript();
            
            if (!isRazorpayLoaded) {
                throw new Error('Failed to load Razorpay script');
            }

            const options = {
                key: razorpayOrderResult.key,
                amount: razorpayOrderResult.amount,
                currency: razorpayOrderResult.currency,
                name: 'Book Store',
                description: 'Book Purchase',
                order_id: razorpayOrderResult.orderId,
                handler: async function (response) {
                    try {
                        // Verify payment using RTK Query
                        const verifyResult = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderData: orderData
                        }).unwrap();
                        
                        if (verifyResult.success) {
                            Swal.fire({
                                title: "Payment Successful!",
                                text: "Your order has been placed successfully.",
                                icon: "success",
                                confirmButtonText: "OK"
                            });
                            navigate("/orders");
                        } else {
                            throw new Error(verifyResult.message || 'Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        Swal.fire({
                            title: "Payment Verification Failed!",
                            text: "Your payment couldn't be verified. Please contact support.",
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    }
                },
                prefill: {
                    name: orderData.name,
                    email: orderData.email,
                    contact: orderData.phone
                },
                theme: {
                    color: '#3399cc'
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessingPayment(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            
        } catch (error) {
            console.error("Payment initiation error:", error);
            Swal.fire({
                title: "Payment Failed!",
                text: error.message || "Failed to initiate payment. Please try again.",
                icon: "error",
                confirmButtonText: "OK"
            });
            setIsProcessingPayment(false);
        }
    };

    const onSubmit = async (data) => {
        // Check if cart is empty
        if (!cartItems || cartItems.length === 0) {
            Swal.fire({
                title: "Cart is Empty",
                text: "Please add some books to your cart before placing an order.",
                icon: "warning",
                confirmButtonText: "OK"
            });
            return;
        }

        const orderData = {
            name: data.name,
            email: currentUser?.email,
            address: {
                city: data.city,
                country: data.country,
                state: data.state,
                zipcode: data.zipcode
            },
            phone: data.phone,
            cartItems: cartItems,
            totalPrice: totalPrice,
            paymentMethod: paymentMethod
        };

        if (paymentMethod === 'cod') {
            await handleCODOrder(orderData);
        } else if (paymentMethod === 'online') {
            await handleOnlinePayment(orderData);
        }
    };

    return (
        <section>
            <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
                <div className="container max-w-screen-lg mx-auto">
                    <div>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-600 mb-2">Checkout</h2>
                            <p className="text-gray-500 mb-2">Total Price: ₹{totalPrice}</p>
                            <p className="text-gray-500 mb-6">Items: {totalItems} ({cartItems.length} unique books)</p>
                        </div>

                        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8">
                                <div className="text-gray-600">
                                    <p className="font-medium text-lg">Personal Details</p>
                                    <p>Please fill out all the fields.</p>
                                </div>

                                <div className="lg:col-span-2">
                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                        <div className="md:col-span-5">
                                            <label htmlFor="name">Full Name</label>
                                            <input
                                                {...register("name", { required: true })}
                                                type="text" 
                                                name="name" 
                                                id="name" 
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" 
                                            />
                                        </div>

                                        <div className="md:col-span-5">
                                            <label htmlFor="email">Email Address</label>
                                            <input
                                                type="text" 
                                                name="email" 
                                                id="email" 
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                defaultValue={currentUser?.email}
                                                readOnly
                                                placeholder="email@domain.com" 
                                            />
                                        </div>

                                        <div className="md:col-span-5">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input
                                                {...register("phone", { required: true })}
                                                type="text" 
                                                name="phone" 
                                                id="phone" 
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" 
                                                placeholder="+91 9999999999" 
                                            />
                                        </div>

                                        <div className="md:col-span-3">
                                            <label htmlFor="city">City</label>
                                            <input
                                                {...register("city", { required: true })}
                                                type="text" 
                                                name="city" 
                                                id="city" 
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" 
                                                placeholder="City" 
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="state">State</label>
                                            <input
                                                {...register("state", { required: true })}
                                                type="text" 
                                                name="state" 
                                                id="state" 
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" 
                                                placeholder="State" 
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="country">Country</label>
                                            <input
                                                {...register("country", { required: true })}
                                                type="text" 
                                                name="country" 
                                                id="country" 
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" 
                                                placeholder="Country" 
                                            />
                                        </div>

                                        <div className="md:col-span-3">
                                            <label htmlFor="zipcode">Zipcode</label>
                                            <input
                                                {...register("zipcode", { required: true })}
                                                type="text" 
                                                name="zipcode" 
                                                id="zipcode" 
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" 
                                                placeholder="Zipcode" 
                                            />
                                        </div>

                                        {/* Payment Method Selection */}
                                        <div className="md:col-span-5 mt-4">
                                            <label className="font-medium text-gray-700 mb-2 block">Payment Method</label>
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id="cod"
                                                        name="paymentMethod"
                                                        value="cod"
                                                        checked={paymentMethod === 'cod'}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    <label htmlFor="cod" className="text-gray-700">
                                                        Cash on Delivery (COD)
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id="online"
                                                        name="paymentMethod"
                                                        value="online"
                                                        checked={paymentMethod === 'online'}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    <label htmlFor="online" className="text-gray-700">
                                                        Online Payment (Razorpay)
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Terms and Conditions */}
                                        <div className="md:col-span-5 mt-4">
                                            <div className="flex items-start">
                                                <input
                                                    onChange={(e) => setIsChecked(e.target.checked)}
                                                    type="checkbox" 
                                                    name="isChecked" 
                                                    id="isChecked" 
                                                    className="mt-1 mr-2" 
                                                />
                                                <label htmlFor="isChecked" className="text-xs text-gray-600">
                                                    I agree to the <Link className="underline underline-offset-2 text-blue-600">Terms & Conditions</Link> and <Link className="underline underline-offset-2 text-blue-600">Shopping Policy.</Link>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="md:col-span-5 text-right mt-6">
                                            <div className="inline-flex items-end">
                                                <button 
                                                    disabled={!isChecked || !isFormValid || isProcessingPayment}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                >
                                                    {isProcessingPayment ? 'Processing...' : 
                                                     paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'}
                                                </button>
                                            </div>
                                            {(!isFormValid || !isChecked) && (
                                                <p className="text-red-500 text-sm mt-2">
                                                    {!isFormValid ? 'Please fill all required fields' : 'Please accept terms and conditions'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CheckoutPage

