// Server Component
import RoomsPage from '@/components/RoomsIndex'
import { getPayloadRooms } from '@/utilities/getRooms'

type Locale = 'es' | 'en' | 'all'

export default async function HabitacionesPage({
  searchParams,
}: {
  searchParams?: { locale?: Locale }
}) {
  const locale: Locale = searchParams?.locale ?? 'es'

  // 1) O llamas directo a Payload (más eficiente):
  const rooms = await getPayloadRooms({ locale })

  // 2) (alternativa) fetch a tu API:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rooms?locale=${locale}`, { cache: 'no-store' })
  // const { rooms } = await res.json()

  return <RoomsPage locale={locale} />
}
