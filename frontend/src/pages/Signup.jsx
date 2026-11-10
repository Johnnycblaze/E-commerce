import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import summaryApi from '../common'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    profilePic: ""
  })

  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (data.password !== data.confirmPassword) {
      toast.error("Password and confirm password do not match")
      return
    }

    try {
      const { confirmPassword, ...submitData } = data

      // Uses summaryApi configuration ensuring correct URL routing
      const response = await fetch(summaryApi.signUP.url, {
        method: summaryApi.signUP.method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.message || "Account created successfully!")
        navigate("/login")
      } else {
        toast.error(result.message || "Signup failed.")
      }
    } catch (err) {
      console.error("Signup error:", err)
      toast.error("Failed to connect to the server.")
    }
  }

  return (
    <div className='container mx-auto px-4 py-8 mt-16 max-w-md'>
      <div className='bg-white p-8 rounded-2xl shadow-sm border'>
        <h2 className='text-2xl font-bold mb-6 text-slate-800 text-center'>Create Account</h2>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-1'>Name :</label>
            <input 
              type='text' 
              name='name'
              value={data.name}
              onChange={handleOnChange}
              placeholder='Enter your name'
              required
              className='w-full border p-2.5 rounded-xl text-sm outline-none focus:border-red-600'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-1'>Email :</label>
            <input 
              type='email' 
              name='email'
              value={data.email}
              onChange={handleOnChange}
              placeholder='Enter your email'
              required
              className='w-full border p-2.5 rounded-xl text-sm outline-none focus:border-red-600'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-1'>Password :</label>
            <div className='relative flex items-center'>
              <input 
                type={showPassword ? 'text' : 'password'} 
                name='password'
                value={data.password}
                onChange={handleOnChange}
                placeholder='Enter password'
                required
                className='w-full border p-2.5 rounded-xl text-sm outline-none focus:border-red-600 pr-10'
              />
              <span onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 cursor-pointer text-slate-500'>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-1'>Confirm Password :</label>
            <div className='relative flex items-center'>
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                name='confirmPassword'
                value={data.confirmPassword}
                onChange={handleOnChange}
                placeholder='Confirm password'
                required
                className='w-full border p-2.5 rounded-xl text-sm outline-none focus:border-red-600 pr-10'
              />
              <span onClick={() => setShowConfirmPassword(prev => !prev)} className='absolute right-3 cursor-pointer text-slate-500'>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type='submit' className='bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md mt-2 cursor-pointer'>
            Sign Up
          </button>
        </form>

        <p className='text-center text-sm text-slate-600 mt-6'>
          Already have an account? <Link to={'/login'} className='text-red-600 font-semibold hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp