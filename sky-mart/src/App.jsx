import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import { CartProvider } from './context/CartContext'
import { AboutPage } from './pages/AboutPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ShopPage } from './pages/ShopPage'
import { SignupPage } from './pages/SignupPage'
import { getCurrentUser } from './utils/auth'

function App() {
  const isAuthenticated = Boolean(getCurrentUser())

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2600,
            style: {
              background: '#121212',
              color: '#f3f4f6',
              border: '1px solid rgba(210, 255, 0, 0.2)',
              borderRadius: '14px',
            },
          }}
        />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
