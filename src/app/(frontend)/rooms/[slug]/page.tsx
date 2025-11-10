import RoomDetail from '@/components/RoomsDetail'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function RoomPage({ params }: PageProps) {
  const { slug } = await params
  return <RoomDetail slug={slug} />
}
