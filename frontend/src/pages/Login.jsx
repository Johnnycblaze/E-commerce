import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Corrected URL matching backend route: /api/signin
      const response = await fetch("http://localhost:8000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      })
      const result = await response.json()
      if (result.success) {
        toast.success(result.message || "Login successfully")
        window.dispatchEvent(new Event('cartUpdated'))
        navigate('/')
      } else {
        toast.error(result.message || "Login failed")
      }
    } catch (err) {
      console.error("Login error:", err)
      toast.error("Something went wrong. Make sure the backend server is running.")
    }
  }

  return (
    <div className='container mx-auto px-4 py-20 mt-16 flex justify-center items-center'>
      <div className='bg-white p-8 rounded-2xl shadow-sm border w-full max-w-md'>
        <h2 className='text-2xl font-bold text-slate-800 mb-6 text-center'>Welcome Back</h2>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase mb-1'>Email :</label>
            <input 
              type='email' 
              name='email' 
              placeholder='Enter your email' 
              value={data.email} 
              onChange={handleOnChange} 
              required 
              className='w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-red-600 transition-colors' 
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-600 uppercase mb-1'>Password :</label>
            <div className='relative flex items-center'>
              <input 
                type={showPassword ? 'text' : 'password'} 
                name='password' 
                placeholder='Enter your password' 
                value={data.password} 
                onChange={handleOnChange} 
                required 
                className='w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-red-600 transition-colors' 
              />
              <span onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 cursor-pointer text-slate-400 hover:text-slate-600'>
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>
            <Link to={'/forgot-password'} className='block text-right text-xs text-red-600 hover:underline mt-1'>
              Forgot password?
            </Link>
          </div>

          <button type='submit' className='w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-full font-semibold mt-2 shadow-md transition-all cursor-pointer'>
            Login
          </button>
        </form>

        <p className='text-center text-sm text-slate-500 mt-6'>
          Don't have an account? <Link to={'/sign-up'} className='text-red-600 font-semibold hover:underline'>Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login