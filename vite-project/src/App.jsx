import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import AddProperty from './pages/AddProperty'
import MyBookings from './pages/MyBookings'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Saved from './pages/Saved'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181f',
            color: '#f1f0f5',
            border: '1px solid #2e2e3a',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#7c3aed', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/add-property" element={<ProtectedRoute roles={['host', 'admin']}><AddProperty /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['host', 'admin']}><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
              <div className="text-8xl mb-4">🏚️</div>
              <h1 className="text-4xl font-bold mb-2">404</h1>
              <p className="text-[var(--color-muted)] mb-6">This page doesn't exist</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
