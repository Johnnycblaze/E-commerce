import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const VerifyEmail = () => {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: "include",
      });

      const result = await response.json();
      setLoading(false)

      if (response.ok && result.success) {
        toast.success(result.message || "Email verified successfully!")
        navigate('/login')
      } else {
        toast.error(result.message || "Verification failed.")
      }
    } catch (error) {
      setLoading(false)
      console.error("Verification error:", error);
      toast.error("Something went wrong connecting to the server.");
    }
  }

  return (
    <section className='mt-20'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-6 w-full max-w-sm mx-auto rounded-lg shadow-md text-center'>
          <h2 className='text-2xl font-bold text-slate-800 mb-2'>Verify Your Email</h2>
          <p className='text-sm text-slate-600 mb-6'>Enter the 6-digit verification code sent to your email.</p>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input 
              type='text' 
              maxLength={6}
              placeholder='123456'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className='w-full text-center tracking-widest text-xl font-bold bg-slate-100 p-3 rounded-md border border-slate-300 outline-none focus:border-red-600'
            />

            <button 
              type='submit' 
              disabled={loading}
              className='bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-full font-semibold transition-all shadow-md disabled:opacity-50 mt-2'
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default VerifyEmail