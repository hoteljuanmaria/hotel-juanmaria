'use client'

import HeroSection from '@/components/Hero'
import RoomCarousel from '@/components/RoomCarousel'
import TestimonialsShowcase from '@/components/Testimonials'

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className='py-16 bg-gray-50'>
        <RoomCarousel />
      </div>
      <TestimonialsShowcase />
    </>
  )
}
