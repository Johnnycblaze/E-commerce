import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return

    // Add your newsletter subscription backend API logic here
    console.log("Subscribed email:", email)
    
    setSubscribed(true)
    setEmail('')

    // Reset success message after 4 seconds
    setTimeout(() => {
      setSubscribed(false)
    }, 4000)
  }

  return (
    <footer className='bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800'>
      <div className='container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
        
        {/* Brand Info */}
        <div className='flex flex-col gap-3'>
          <h2 className='text-xl font-bold text-white tracking-tight'>
            Johnnyc'<span className='text-red-600'>Blaze</span>
          </h2>
          <p className='text-sm text-slate-400'>
            Your ultimate shopping hub for quality products, blazing-fast delivery, and unbeatable deals.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className='text-white font-semibold text-base mb-3'>Quick Links</h3>
          <ul className='space-y-2 text-sm'>
            <li><Link to={'/'} className='hover:text-red-500 transition-colors'>Home</Link></li>
            <li><Link to={'/login'} className='hover:text-red-500 transition-colors'>Login</Link></li>
            <li><Link to={'/sign-up'} className='hover:text-red-500 transition-colors'>Sign Up</Link></li>
            <li><Link to={'/cart'} className='hover:text-red-500 transition-colors'>Cart</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className='text-white font-semibold text-base mb-3'>Customer Care</h3>
          <ul className='space-y-2 text-sm'>
            <li><a href='#' className='hover:text-red-500 transition-colors'>Track Order</a></li>
            <li><a href='#' className='hover:text-red-500 transition-colors'>Shipping Policy</a></li>
            <li><a href='#' className='hover:text-red-500 transition-colors'>Returns & Refunds</a></li>
            <li><a href='#' className='hover:text-red-500 transition-colors'>Contact Us</a></li>
          </ul>
        </div>

        {/* Newsletter & Subscriptions */}
        <div>
          <h3 className='text-white font-semibold text-base mb-3'>Stay Connected</h3>
          <p className='text-sm text-slate-400 mb-3'>Subscribe to get special offers and updates.</p>
          
          <form onSubmit={handleSubscribe} className='flex items-center bg-slate-800 rounded-full p-1 border border-slate-700 max-w-xs'>
            <input 
              type='email' 
              placeholder='Enter your email' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full bg-transparent outline-none text-sm px-3 text-white placeholder-slate-500'
            />
            <button 
              type='submit'
              className='bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-full font-medium transition-colors'
            >
              Join
            </button>
          </form>

          {/* Subscription Success Feedback */}
          {subscribed && (
            <p className='text-xs text-green-400 mt-2 font-medium'>
              🎉 Thank you for subscribing!
            </p>
          )}
        </div>

      </div>

      {/* Copyright Bar */}
      <div className='container mx-auto px-4 border-t border-slate-800 pt-6 text-center text-xs text-slate-500'>
        <p>&copy; {new Date().getFullYear()} Johnnyc'Blaze Shopping HUB. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer