import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { token } = useParams()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`http://localhost:8000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      const result = await response.json();
      setLoading(false)

      if (response.ok && result.success) {
        toast.success(result.message || "Password successfully reset!")
        navigate('/login')
      } else {
        toast.error(result.message || "Reset failed or link expired.")
      }
    } catch (error) {
      setLoading(false)
      console.error("Reset password error:", error);
      toast.error("Something went wrong connecting to the server.");
    }
  }

  return (
    <section className='mt-20'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-6 w-full max-w-sm mx-auto rounded-lg shadow-md'>
          <h2 className='text-2xl font-bold text-center text-slate-800 mb-2'>Reset Password</h2>
          <p className='text-sm text-slate-600 mb-6 text-center'>Enter your new password below.</p>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='grid'>
              <label className='text-sm font-medium text-slate-700 mb-1'>New Password :</label>
              <div className='bg-slate-100 p-2 rounded-full flex items-center border focus-within:border-red-600'>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder='enter new password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='w-full outline-none bg-transparent text-sm px-2'
                />
                <div 
                  className='cursor-pointer text-slate-600 px-2' 
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <button 
              type='submit' 
              disabled={loading}
              className='bg-red-600 hover:bg-red-700 text-white py-2 rounded-full font-semibold transition-all shadow-md disabled:opacity-50 mt-2'
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ResetPassword