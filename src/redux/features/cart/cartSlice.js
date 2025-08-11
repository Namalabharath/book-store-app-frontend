import { createSlice } from "@reduxjs/toolkit";
import Swal  from "sweetalert2";

const initialState = {
    cartItems: []
}

// Helper functions for cart persistence
const getCartStorageKey = (userId) => {
    return userId ? `cart_${userId}` : 'cart_guest';
};

const saveCartToStorage = (cartItems, userId) => {
    try {
        const storageKey = getCartStorageKey(userId);
        localStorage.setItem(storageKey, JSON.stringify(cartItems));
    } catch (error) {
        console.error('Error saving cart to storage:', error);
    }
};

const loadCartFromStorage = (userId) => {
    try {
        const storageKey = getCartStorageKey(userId);
        const savedCart = localStorage.getItem(storageKey);
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error('Error loading cart from storage:', error);
        return [];
    }
};

const clearCartFromStorage = (userId) => {
    try {
        const storageKey = getCartStorageKey(userId);
        localStorage.removeItem(storageKey);
    } catch (error) {
        console.error('Error clearing cart from storage:', error);
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers:{
        // Load cart for specific user (called on login)
        loadUserCart: (state, action) => {
            const userId = action.payload;
            state.cartItems = loadCartFromStorage(userId);
        },
        
        // Add item to cart
        addToCart: (state, action) => {
            const { product, userId } = action.payload;
            const existingItem = state.cartItems.find(item => item._id === product._id);
            
            if(!existingItem) {
                state.cartItems.push({...product, quantity: 1});
                saveCartToStorage(state.cartItems, userId);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Product Added to the Cart",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                existingItem.quantity += 1;
                saveCartToStorage(state.cartItems, userId);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Quantity Updated",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
        
        // Remove item from cart
        removeFromCart: (state, action) => {
            const { product, userId } = action.payload;
            state.cartItems = state.cartItems.filter(item => item._id !== product._id);
            saveCartToStorage(state.cartItems, userId);
        },
        
        // Clear entire cart
        clearCart: (state, action) => {
            const userId = action.payload;
            state.cartItems = [];
            clearCartFromStorage(userId);
        },

        // Increase quantity
        increaseQuantity: (state, action) => {
            const { product, userId } = action.payload;
            const item = state.cartItems.find(item => item._id === product._id);
            if (item) {
                item.quantity += 1;
                saveCartToStorage(state.cartItems, userId);
            }
        },

        // Decrease quantity
        decreaseQuantity: (state, action) => {
            const { product, userId } = action.payload;
            const item = state.cartItems.find(item => item._id === product._id);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                saveCartToStorage(state.cartItems, userId);
            }
        },

        // Update quantity directly
        updateQuantity: (state, action) => {
            const { product, quantity, userId } = action.payload;
            const item = state.cartItems.find(item => item._id === product._id);
            if (item && quantity > 0) {
                item.quantity = quantity;
                saveCartToStorage(state.cartItems, userId);
            }
        },
        
        // Clear cart on logout (doesn't save to storage)
        clearCartOnLogout: (state) => {
            state.cartItems = [];
        },
        
        // Sync cart with storage (useful for page refresh)
        syncCartWithStorage: (state, action) => {
            const userId = action.payload;
            state.cartItems = loadCartFromStorage(userId);
        }
    }
})

// export the actions   
export const  {
    loadUserCart, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    clearCartOnLogout, 
    syncCartWithStorage,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity
} = cartSlice.actions;
export default cartSlice.reducer;