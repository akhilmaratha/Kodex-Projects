import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  addItemToCart,
  calculateCartSummary,
  createOrder,
  getStoredCart,
  removeCartItem,
  saveStoredCart,
  updateCartItemQuantity,
} from '../utils/cart'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => getStoredCart())

  useEffect(() => {
    saveStoredCart(cartItems)
  }, [cartItems])

  const cartSummary = useMemo(() => calculateCartSummary(cartItems), [cartItems])

  function addToCart(product) {
    setCartItems((currentItems) => addItemToCart(currentItems, product))
  }

  function incrementItem(productId) {
    setCartItems((currentItems) => updateCartItemQuantity(currentItems, productId, 1))
  }

  function decrementItem(productId) {
    setCartItems((currentItems) => updateCartItemQuantity(currentItems, productId, -1))
  }

  function removeItem(productId) {
    setCartItems((currentItems) => removeCartItem(currentItems, productId))
  }

  function clearCart() {
    setCartItems([])
  }

  function checkout(customer) {
    if (cartItems.length === 0) {
      throw new Error('Your cart is empty.')
    }

    const order = createOrder(cartItems, customer)
    setCartItems([])

    return order
  }

  const value = {
    cartItems,
    cartSummary,
    addToCart,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    checkout,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider.')
  }

  return context
}