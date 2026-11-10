import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './component/Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Header />
      <main className='pt-16'> {/* Adds top padding so content doesn't hide behind fixed header */}
        <Outlet />
      </main>
    </>
  )
}

export default App