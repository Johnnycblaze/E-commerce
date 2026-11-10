import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa'
import { toast } from 'react-toastify'

const Header = () => {
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [menuDisplay, setMenuDisplay] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  
  // Extract search query from URL params if present
  const urlSearch = new URLSearchParams(location.search).get("q") || ""
  const [searchQuery, setSearchQuery] = useState(urlSearch)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/')
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user-details", {
        method: "GET",
        credentials: "include"
      })
      if (response.status === 401) { setUser(null); return; }
      const data = await response.json()
      if (data.success) setUser(data.data)
      else setUser(null)
    } catch (err) {
      setUser(null)
    }
  }

  const fetchCartCount = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/count-cart-product", {
        method: "GET",
        credentials: "include"
      })
      if (response.status === 401) { setCartCount(0); return; }
      const data = await response.json()
      if (data.success) setCartCount(data.data?.count || 0)
      else setCartCount(0)
    } catch (err) {
      setCartCount(0)
    }
  }

  useEffect(() => {
    fetchUserData()
    fetchCartCount()

    window.addEventListener('cartUpdated', () => {
      fetchUserData()
      fetchCartCount()
    })
    return () => window.removeEventListener('cartUpdated', () => {})
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "GET",
        credentials: "include"
      })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message || "Logged out successfully")
        setUser(null)
        setMenuDisplay(false)
        navigate('/')
        window.dispatchEvent(new Event('cartUpdated'))
      } else {
        toast.error(data.message || "Logout failed")
      }
    } catch (err) {
      toast.error("Something went wrong connecting to the server.")
    }
  }

  return (
    <header className='fixed top-0 left-0 w-full bg-white shadow-sm z-50 h-16 flex items-center'>
      <div className='container mx-auto px-4 flex items-center justify-between'>
        
        {/* Logo */}
        <Link to={'/'} className='flex items-center gap-2'>
          <div className='bg-red-600 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm'>
            Tessy
          </div>
          <span className='font-bold text-slate-800 text-lg tracking-wide hidden sm:inline'>SHOPPING HUB</span>
        </Link>

        {/* Responsive Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className='hidden md:flex items-center w-full max-w-md border border-slate-200 rounded-full overflow-hidden shadow-inner focus-within:border-red-600 transition-colors'>
          <input 
            type='text' 
            placeholder='Search product here...' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full px-4 py-2 text-sm outline-none bg-transparent' 
          />
          <button type='submit' className='bg-red-600 text-white px-5 py-2.5 flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer'>
            <FaSearch size={14} />
          </button>
        </form>

        {/* Right Actions */}
        <div className='flex items-center gap-6'>
          
          {/* User Account / Dropdown */}
          <div className='relative'>
            {user?._id ? (
              <div 
                onClick={() => setMenuDisplay(prev => !prev)} 
                className='w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 cursor-pointer font-bold uppercase shadow-sm hover:border-red-600 transition-all'
              >
                {user?.name?.charAt(0) || <FaUser />}
              </div>
            ) : (
              <Link to={'/login'} className='bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md transition-all'>
                Login
              </Link>
            )}

            {menuDisplay && (
              <div className='absolute right-0 mt-3 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 flex flex-col'>
                {user?.role === 'ADMIN' && (
                  <Link 
                    to={'/admin-panel/all-users'} 
                    onClick={() => setMenuDisplay(false)}
                    className='px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium'
                  >
                    Admin Panel
                  </Link>
                )}
                <Link 
                  to={'/order-history'} 
                  onClick={() => setMenuDisplay(false)}
                  className='px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium'
                >
                  My Orders
                </Link>
                <button 
                  onClick={handleLogout}
                  className='w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold border-t mt-1 cursor-pointer'
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link to={'/cart'} className='relative text-slate-700 hover:text-red-600 transition-colors'>
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md'>
                {cartCount}
              </span>
            )}
          </Link>

        </div>

      </div>
    </header>
  )
}

export default Header