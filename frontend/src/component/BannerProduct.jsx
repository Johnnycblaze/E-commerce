import React, { useState, useEffect } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'

// Importing your banner images (ensure these files match your assets folder paths)
import image1 from '../asset/banner/img1.webp'
import image1Mobile from '../asset/banner/img1_mobile.jpg'
import image2 from '../asset/banner/img2.webp'
import image2Mobile from '../asset/banner/img2_mobile.webp'
import image3 from '../asset/banner/img3.jpg'
import image3Mobile from '../asset/banner/img3_mobile.jpg'
import image4 from '../asset/banner/img4.jpg'
import image4Mobile from '../asset/banner/img4_mobile.jpg'
import image5 from '../asset/banner/img5.webp'
import image5Mobile from '../asset/banner/img5_mobile.png'

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0)

  const desktopImages = [image1, image2, image3, image4, image5]
  const mobileImages = [image1Mobile, image2Mobile, image3Mobile, image4Mobile, image5Mobile]

  const nextImage = () => {
    setCurrentImage((prev) => (prev < desktopImages.length - 1 ? prev + 1 : 0))
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : desktopImages.length - 1))
  }

  useEffect(() => {
    const interval = setInterval(nextImage, 5000)
    return () => clearInterval(interval)
  }, [currentImage])

  return (
    <div className='container mx-auto px-4 rounded-2xl overflow-hidden my-4'>
      <div className='relative h-48 md:h-72 w-full bg-slate-200 rounded-2xl overflow-hidden shadow-sm group'>
        
        {/* Navigation Buttons */}
        <button 
          onClick={prevImage} 
          className='absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-slate-700 p-2.5 rounded-full shadow-md transition-all cursor-pointer'
          aria-label="Previous Slide"
        >
          <FaAngleLeft size={20} />
        </button>
        <button 
          onClick={nextImage} 
          className='absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-slate-700 p-2.5 rounded-full shadow-md transition-all cursor-pointer'
          aria-label="Next Slide"
        >
          <FaAngleRight size={20} />
        </button>

        {/* Desktop View */}
        <div className='hidden md:flex h-full w-full transition-transform duration-500 ease-in-out' style={{ transform: `translateX(-${currentImage * 100}%)` }}>
          {desktopImages.map((image, index) => (
            <div key={index} className='min-w-full h-full flex-shrink-0'>
              <img src={image} alt={`banner-${index + 1}`} className='w-full h-full object-cover' />
            </div>
          ))}
        </div>

        {/* Mobile View */}
        <div className='flex md:hidden h-full w-full transition-transform duration-500 ease-in-out' style={{ transform: `translateX(-${currentImage * 100}%)` }}>
          {mobileImages.map((image, index) => (
            <div key={index} className='min-w-full h-full flex-shrink-0'>
              <img src={image} alt={`banner-mobile-${index + 1}`} className='w-full h-full object-cover' />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default BannerProduct