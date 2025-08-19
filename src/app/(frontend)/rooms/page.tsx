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

  const rooms = await getPayloadRooms({ locale })

  return <RoomsPage locale={locale} />
}
