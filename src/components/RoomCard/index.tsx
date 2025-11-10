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
  Star,
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
  const featuredImage = room.images.find((img) => img.featured) || room.images[0]

  // Amenidades a mostrar
  const displayAmenities = room.amenities
    .slice(0, 6)
    .map((amenity) => amenity.amenity || amenity.customAmenity)
    .filter(Boolean)

  return (
    <div
      className="
        relative group
        bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden
        transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl
      "
    >
      {/* Shimmer & floating highlight (Card System obligatorio) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute top-4 right-6 w-1 h-6 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent rotate-45 animate-pulse" />
        <div className="absolute bottom-4 left-6 w-4 h-0.5 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Imagen Principal */}
      <div className="relative h-64 overflow-hidden">
        {featuredImage &&
        typeof featuredImage.image === 'object' &&
        (featuredImage.image as any)?.url ? (
          <Image
            src={(featuredImage.image as any).url}
            alt={featuredImage.alt || room.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={room.featured}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-lg">Sin imagen</span>
          </div>
        )}

        {/* Overlay sutil para contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent pointer-events-none" />

        {/* Badge de habitación destacada (Mejorado a Liquid Luxury) */}
        {room.featured && (
          <div className="absolute top-4 left-4">
            <div
              className="
                relative inline-flex items-center gap-2 px-3 py-1
                rounded-lg text-white text-xs font-medium tracking-wide
                bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl
                overflow-hidden transition-all duration-700 ease-out
                group/badge
              "
            >
              <Star className="w-4 h-4" />
              <span className="uppercase">Destacada</span>

              {/* Floating highlight */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-700" />

              {/* Shimmer lines */}
              <div className="pointer-events-none absolute -top-1 right-2 w-1.5 h-4 bg-gradient-to-b from-transparent via-white/40 to-transparent rotate-45 animate-pulse" />
              <div className="pointer-events-none absolute -bottom-1 left-2 w-3 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Orb decorativo (efecto líquido) */}
        <div className="pointer-events-none absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Título y tipo de cama */}
        <div className="mb-4">
          <h3 className="font-serif text-xl md:text-2xl font-bold text-gray-900 mb-1 transition-colors duration-500 ease-out group-hover:text-gray-800">
            {room.title}
          </h3>
          <p className="font-sans text-sm font-light text-gray-600">
            {getBedTypeLabel(room.bedType, locale)} • {room.size}
          </p>
        </div>

        {/* Descripción corta */}
        {room.shortDescription && (
          <p className="font-sans text-sm font-light text-gray-700 mb-4 line-clamp-2">
            {room.shortDescription}
          </p>
        )}

        {/* Capacidad */}
        <div className="flex items-center gap-4 mb-4 font-sans text-sm font-light text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Hasta {room.capacity} huéspedes</span>
          </div>
        </div>

        {/* Amenidades */}
        {displayAmenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {displayAmenities.slice(0, 4).map((amenity, index) => {
                const icon = getAmenityIcon(amenity!)
                const label = getAmenityLabel(amenity!, locale)

                return (
                  <div
                    key={`${amenity}-${index}`}
                    className="
                      flex items-center gap-1 px-2 py-1
                      bg-white/70 backdrop-blur-xl border border-white/30
                      rounded-lg text-xs text-gray-700
                      transition-all duration-300 hover:bg-white/90 hover:scale-105
                    "
                  >
                    {icon}
                    <span className="font-sans font-medium">{label}</span>
                  </div>
                )
              })}
              {displayAmenities.length > 4 && (
                <div
                  className="
                    flex items-center px-2 py-1
                    bg-white/70 backdrop-blur-xl border border-white/30
                    rounded-lg text-xs text-gray-700
                    transition-all duration-300 hover:bg-white/90 hover:scale-105
                  "
                >
                  +{displayAmenities.length - 4} más
                </div>
              )}
            </div>
          </div>
        )}

        {/* Precios y selección */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2">
              <span className="font-sans text-2xl font-bold text-gray-900">
                {formatPayloadPrice(room.price, room.currency)}
              </span>
              <span className="font-sans text-sm font-light text-gray-600 ml-1">
                por noche
              </span>
            </div>

            {selectedQuantity > 0 && (
              <div className="font-sans text-sm">
                <p className="text-gray-600 font-light">
                  {nights} noche{nights !== 1 ? 's' : ''} × {selectedQuantity}{' '}
                  habitación{selectedQuantity !== 1 ? 'es' : ''}
                </p>
                <p className="font-semibold text-gray-900">
                  Total: {formatPayloadPrice(totalPrice, room.currency)}
                </p>
              </div>
            )}
          </div>

          {/* Selector de cantidad (Botones -> Secondary / Glass) */}
          <div className="flex flex-col items-end gap-2">
            <div
              className="
                flex items-center
                bg-white/70 backdrop-blur-xl border border-gray-200/60
                rounded-lg overflow-hidden
              "
            >
              <button
                type="button"
                aria-label="Disminuir"
                onClick={() =>
                  onQuantityChange(room.id, Math.max(0, selectedQuantity - 1))
                }
                className="
                  relative font-semibold rounded-lg overflow-hidden transition-all duration-700 ease-out group
                  px-3 py-2 text-gray-700 hover:border-gray-300
                "
                disabled={selectedQuantity === 0}
              >
                <span className="relative z-10 flex items-center justify-center">−</span>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white/50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-1 right-2 w-1 h-3 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent rotate-45 animate-pulse" />
                </div>
              </button>

              <span className="px-4 py-2 min-w-[50px] text-center font-medium text-gray-900">
                {selectedQuantity}
              </span>

              <button
                type="button"
                aria-label="Aumentar"
                onClick={() => onQuantityChange(room.id, selectedQuantity + 1)}
                className="
                  relative font-semibold rounded-lg overflow-hidden transition-all duration-700 ease-out group
                  px-3 py-2 text-gray-700 hover:border-gray-300
                "
              >
                <span className="relative z-10 flex items-center justify-center">+</span>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white/50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute bottom-1 left-2 w-2 h-0.5 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
              </button>
            </div>

            {selectedQuantity > 0 && (
              <button
                type="button"
                onClick={() => onQuantityChange(room.id, 0)}
                className="
                  font-sans text-xs text-gray-500 hover:text-gray-700
                  transition-colors duration-300 ease-out
                "
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
