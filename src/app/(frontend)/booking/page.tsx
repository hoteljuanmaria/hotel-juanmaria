import { Suspense } from 'react'
import BookingPageComponent from '@/components/BookingPage'

type Locale = 'es' | 'en'

export default async function BookingPage({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: Locale }>
}) {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
        </div>
      }
    >
      <BookingPageComponent />
    </Suspense>
  )
}
