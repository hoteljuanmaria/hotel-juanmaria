import { Suspense } from 'react'
import BookingPage from '@/components/BookingPage'

function BookingPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
        </div>
      }
    >
      <BookingPage />
    </Suspense>
  )
}

export default BookingPageWrapper
