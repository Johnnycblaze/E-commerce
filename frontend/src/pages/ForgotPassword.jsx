import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const result = await response.json();
      setLoading(false)

      if (response.ok && result.success) {
        toast.success(result.message || "Password reset link sent to email.")
      } else {
        toast.error(result.message || "Something went wrong.")
      }
    } catch (error) {
      setLoading(false)
      console.error("Forgot password error:", error);
      toast.error("Network error. Make sure backend is running.");
    }
  }

  return (
    <section className='mt-20'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-6 w-full max-w-sm mx-auto rounded-lg shadow-md'>
          <h2 className='text-2xl font-bold text-center text-slate-800 mb-2'>Forgot Password</h2>
          <p className='text-sm text-slate-600 mb-6 text-center'>Enter your email and we'll send you a reset link.</p>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='grid'>
              <label className='text-sm font-medium text-slate-700 mb-1'>Email :</label>
              <input 
                type='email' 
                placeholder='enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='bg-slate-100 p-2 rounded-full outline-none border focus:border-red-600 text-sm px-3'
              />
            </div>

            <button 
              type='submit' 
              disabled={loading}
              className='bg-red-600 hover:bg-red-700 text-white py-2 rounded-full font-semibold transition-all shadow-md disabled:opacity-50 mt-2'
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>

          <p className='mt-5 text-center text-sm text-slate-600'>
            Remembered your password? <Link to={'/login'} className='text-red-600 font-semibold hover:underline'>Login</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword