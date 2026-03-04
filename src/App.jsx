import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { RequireAdmin } from './components/RequireAdmin'

import Home from './pages/Home'
import Essays from './pages/Essays'
import PostDetail from './pages/PostDetail'
import Category from './pages/Category'
import Search from './pages/Search'
import About from './pages/About'
import Login from './pages/admin/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import PostEditor from './pages/admin/PostEditor'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/essays" element={<Essays />} />
            <Route path="/essays/:slug" element={<PostDetail />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/tag/:slug" element={<Category />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Admin — protected */}
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/new" element={<RequireAdmin><PostEditor /></RequireAdmin>} />
            <Route path="/admin/edit/:id" element={<RequireAdmin><PostEditor /></RequireAdmin>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}