import React from 'react'
import Image from 'next/image'
import {
  Users,
  Wifi,
  Coffee,
  Car,
  Tv,
  Shield,
  Wind,
  MapPin,
} from 'lucide-react'
import { BookingRoom } from '@/lib/payload-utils'
import {
  formatPayloadPrice,
  getBedTypeLabel,
  getAmenityLabel,
} from '@/lib/payload-utils'

interface RoomCardProps {
  room: BookingRoom
  nights: number
  selectedQuantity: number
  onQuantityChange: (roomId: string, quantity: number) => void
  locale?: string
}

const getAmenityIcon = (amenityKey: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    wifi: <Wifi className='w-4 h-4' />,
    'air-conditioning': <Wind className='w-4 h-4' />,
    tv: <Tv className='w-4 h-4' />,
    safe: <Shield className='w-4 h-4' />,
    breakfast: <Coffee className='w-4 h-4' />,
    parking: <Car className='w-4 h-4' />,
    'ocean-view': <MapPin className='w-4 h-4' />,
    'city-view': <MapPin className='w-4 h-4' />,
  }
  return iconMap[amenityKey] || null
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  nights,
  selectedQuantity,
  onQuantityChange,
  locale = 'es',
}) => {
  const totalPrice = room.price * selectedQuantity * nights
  const featuredImage =
    room.images.find((img) => img.featured) || room.images[0]

  // Obtener las amenidades más importantes para mostrar
  const displayAmenities = room.amenities
    .slice(0, 6)
    .map((amenity) => amenity.amenity || amenity.customAmenity)
    .filter(Boolean)

  return (
    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group'>
      {/* Imagen Principal */}
      <div className='relative h-64 overflow-hidden'>
        {featuredImage &&
        typeof featuredImage.image === 'object' &&
        featuredImage.image.url ? (
          <Image
            src={featuredImage.image.url}
            alt={featuredImage.alt}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
            <span className='text-gray-500 text-lg'>Sin imagen</span>
          </div>
        )}

        {/* Badge de habitación destacada */}
        {room.featured && (
          <div className='absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
            Destacada
          </div>
        )}
      </div>

      <div className='p-6'>
        {/* Título y tipo de cama */}
        <div className='mb-4'>
          <h3 className='text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors'>
            {room.title}
          </h3>
          <p className='text-gray-600 text-sm'>
            {getBedTypeLabel(room.bedType, locale)} • {room.size}
          </p>
        </div>

        {/* Descripción corta */}
        {room.shortDescription && (
          <p className='text-gray-700 text-sm mb-4 line-clamp-2'>
            {room.shortDescription}
          </p>
        )}

        {/* Información de capacidad */}
        <div className='flex items-center gap-4 mb-4 text-sm text-gray-600'>
          <div className='flex items-center gap-1'>
            <Users className='w-4 h-4' />
            <span>Hasta {room.capacity} huéspedes</span>
          </div>
        </div>

        {/* Amenidades */}
        {displayAmenities.length > 0 && (
          <div className='mb-4'>
            <div className='flex flex-wrap gap-2'>
              {displayAmenities.slice(0, 4).map((amenity, index) => {
                const icon = getAmenityIcon(amenity!)
                const label = getAmenityLabel(amenity!, locale)

                return (
                  <div
                    key={index}
                    className='flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-700'
                  >
                    {icon}
                    <span>{label}</span>
                  </div>
                )
              })}
              {displayAmenities.length > 4 && (
                <div className='flex items-center px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-700'>
                  +{displayAmenities.length - 4} más
                </div>
              )}
            </div>
          </div>
        )}

        {/* Precios y selección */}
        <div className='flex items-end justify-between'>
          <div className='flex-1'>
            <div className='mb-2'>
              <span className='text-2xl font-bold text-gray-900'>
                {formatPayloadPrice(room.price, room.currency)}
              </span>
              <span className='text-gray-600 text-sm ml-1'>por noche</span>
            </div>

            {selectedQuantity > 0 && (
              <div className='text-sm'>
                <p className='text-gray-600'>
                  {nights} noche{nights !== 1 ? 's' : ''} × {selectedQuantity}{' '}
                  habitación{selectedQuantity !== 1 ? 'es' : ''}
                </p>
                <p className='font-semibold text-green-600'>
                  Total: {formatPayloadPrice(totalPrice, room.currency)}
                </p>
              </div>
            )}
          </div>

          {/* Selector de cantidad */}
          <div className='flex flex-col items-end gap-2'>
            <div className='flex items-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200'>
              <button
                type='button'
                onClick={() =>
                  onQuantityChange(room.id, Math.max(0, selectedQuantity - 1))
                }
                className='px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-medium'
                disabled={selectedQuantity === 0}
              >
                −
              </button>
              <span className='px-4 py-2 min-w-[50px] text-center font-medium text-gray-900'>
                {selectedQuantity}
              </span>
              <button
                type='button'
                onClick={() => onQuantityChange(room.id, selectedQuantity + 1)}
                className='px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-medium'
              >
                +
              </button>
            </div>

            {selectedQuantity > 0 && (
              <button
                type='button'
                onClick={() => onQuantityChange(room.id, 0)}
                className='text-xs text-gray-500 hover:text-red-500 transition-colors'
              >
                Quitar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomCard
