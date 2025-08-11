import React, { useState } from 'react'
import { FiList } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import avatarImg from "../assets/avatar.png"
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

// Role-aware navigation function
const getNavigationItems = (currentUser) => {
  if (!currentUser) {
    return [];
  }
  
  const commonItems = [
    { name: "Orders", href: "/orders" },
    { name: "Cart Page", href: "/cart" },
    { name: "Check Out", href: "/checkout" },
  ];

  if (currentUser.role === 'admin') {
    return [
      { name: "Dashboard", href: "/dashboard" },
      ...commonItems
    ];
  } else {
    return [
      ...commonItems
    ];
  }
};

const Navbar = () => {
  const {currentUser, logout} = useAuth()
  const navigation = getNavigationItems(currentUser);
    
  const handleLogOut = () => {
      logout()
  }

  const token = localStorage.getItem('token');

  const cartItems = useSelector(state => state.cart.cartItems);
  
  const [isDropdownOpen,setIsDropdownOpen]=useState(false);
  return (
   <header className='max-w-screen-2xl mx-auto px-4 py-6'>

  <nav className='flex justify-between item-center'>
    {/* left side */}
<div className='flex items-center md:gap-16 gap-4'>
    <Link to="/" className='w-6 h-6'>
    <FiList className="size-6" />
    </Link>

    {/* {search input} */}

    <div className='relative sm:w-72 w-40 space-x-2 '>
        
    <CiSearch  className='absolute inline-block left-3 inset-y-2'/>
    <input type="text" placeholder=' Search here' 
    className='bg-[#EAEAEA] w-full py-1 md:px-8 px-6
    rounded-md focus:outline-none'/>
    </div>
</div>


<div className='relative flex items-center md:space-x-3 space-x-2'>

  <div>
    {
      currentUser ?
      <>
      <button onClick={()=>setIsDropdownOpen(!isDropdownOpen)}>
        <img src={avatarImg} alt="" 
        className={`size-7 rounded-full ${currentUser ?'ring-2 ring-blue-500':''}`}
        />
        
        </button>
        {
          isDropdownOpen&&(
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
            <ul className="py-2">
                {
                    navigation.map((item) => (
                        <li key={item.name} onClick={() => setIsDropdownOpen(false)}>
                            <Link to={item.href} className="block px-4 py-2 text-sm hover:bg-gray-100">
                                {item.name}
                            </Link>
                        </li>
                    ))
                }
                <li>
                    <button
                    onClick={handleLogOut}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Logout</button>
                </li>
            </ul>
        </div>
          )
        }
        </>
        :
      <Link to="/login">  <  FaRegUserCircle className='size-6'/></Link>
    
  }
  </div>

<button className='hidden sm:block'>
<FaRegHeart  className='size-6'/>
</button>

<Link to="/cart" className='bg-[#deb887] p-1 sm:px-6 px-2 flex item-center
rounded-sm'>
    

    <FiShoppingCart className='item-center size-5' />
    {
      cartItems.length > 0 ?  <span className="text-sm font-semibold sm:ml-1">{cartItems.length}</span> :  <span className="text-sm font-semibold sm:ml-1">0</span>
     }

</Link>

</div>
  </nav>

   </header>
  )
}

export default Navbar
