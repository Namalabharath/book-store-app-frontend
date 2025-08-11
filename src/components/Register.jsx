import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [message, setMessage] = useState("");
    const { registerUser } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        try {
            const result = await registerUser({
                username: data.username,
                email: data.email,
                password: data.password
            });
            alert("User registered successfully!");
            
            // Redirect based on user role
            if (result.user.role === 'admin') {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        } catch (error) {
            setMessage(error.message || "Registration failed. Please try again.")
            console.error(error)
        }
    }
    return (
        <div className='h-[calc(100vh-120px)] flex justify-center items-center '>
            <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <h2 className='text-xl font-semibold mb-4'>Please Register</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="username">Username</label>
                        <input
                            {...register("username", { required: true })}
                            type="text" name="username" id="username" placeholder='Username'
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">Email</label>
                        <input
                            {...register("email", { required: true })}
                            type="email" name="email" id="email" placeholder='Email Address'
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
                        <input
                            {...register("password", { required: true, minLength: 6 })}
                            type="password" name="password" id="password" placeholder='Password'
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                        />
                        {errors.password && <p className='text-red-500 text-xs italic'>Password must be at least 6 characters.</p>}
                    </div>
                    {
                        message && <p className='text-red-500 text-xs italic mb-3'>{message}</p>
                    }
                    <div>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none'>Register</button>
                    </div>
                </form>
                <p className='align-baseline font-medium mt-4 text-sm'>Have an account? Please <Link to="/login" className='text-blue-500 hover:text-blue-700'>Login</Link></p>

                <p className='mt-5 text-center text-gray-500 text-xs'>©2025 Book Store. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Register
