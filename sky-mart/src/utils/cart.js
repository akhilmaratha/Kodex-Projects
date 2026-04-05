const CART_STORAGE_KEY = 'skymart_cart'
const ORDERS_STORAGE_KEY = 'skymart_orders'

function readJson(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  const storedValue = window.localStorage.getItem(key)
  if (!storedValue) {
    return fallback
  }

  try {
    return JSON.parse(storedValue)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

function normalizeProduct(product) {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category,
    rating: product.rating?.rate ?? 0,
    reviews: product.rating?.count ?? 0,
    quantity: 1,
  }
}

export function getStoredCart() {
  return readJson(CART_STORAGE_KEY, [])
}

export function saveStoredCart(cartItems) {
  writeJson(CART_STORAGE_KEY, cartItems)
}

export function addItemToCart(cartItems, product) {
  const existingItem = cartItems.find((item) => item.id === product.id)

  if (existingItem) {
    return cartItems.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    )
  }

  return [...cartItems, normalizeProduct(product)]
}

export function updateCartItemQuantity(cartItems, productId, delta) {
  return cartItems
    .map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + delta } : item,
    )
    .filter((item) => item.quantity > 0)
}

export function removeCartItem(cartItems, productId) {
  return cartItems.filter((item) => item.id !== productId)
}

export function clearStoredCart() {
  writeJson(CART_STORAGE_KEY, [])
}

export function calculateCartSummary(cartItems) {
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return { itemCount, total }
}

export function createOrder(cartItems, customer) {
  const orders = readJson(ORDERS_STORAGE_KEY, [])
  const summary = calculateCartSummary(cartItems)
  const order = {
    orderId: `SM-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customer,
    items: cartItems,
    itemCount: summary.itemCount,
    total: Number(summary.total.toFixed(2)),
  }

  writeJson(ORDERS_STORAGE_KEY, [order, ...orders])
  clearStoredCart()

  return order
}