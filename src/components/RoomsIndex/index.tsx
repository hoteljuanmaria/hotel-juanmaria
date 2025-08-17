'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation' 
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Users,
  Square,
  Bed,
  Star,
  ChevronDown,
  X,
  Check,
  ArrowRight,
  Eye,
  Heart,
  Share2,
  SlidersHorizontal,
  Wifi,
  Car,
  Coffee,
  Shield,
  Tv,
  Waves,
  Phone,
  Plane,
} from 'lucide-react'
import type { Room } from '@/payload-types'
import { getAllRooms } from '@/lib/actions/rooms'
import CustomSortSelect from '../ui/customSort'
import Image from 'next/image'
import { useDebouncedValue } from '@/hooks/useDebounce'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import MouseOrbs from '@/components/Effects/MouseOrbs'
import { t, tPlural, type Locale as LocaleType } from '@/lib/translations'
import { getBedTypeLabel, getImagePath, renderDescription, getAmenityText } from '@/lib/client-utils'

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}

type Locale = LocaleType | 'all'

// Helper functions are now imported from client-utils

const getAmenityIcon = (amenity: any) => {
  const amenityText = getAmenityText(amenity)
  const amenityLower = amenityText.toLowerCase()

  if (amenityLower.includes('wifi')) return <Wifi className='w-4 h-4' />
  if (amenityLower.includes('tv')) return <Tv className='w-4 h-4' />
  if (
    amenityLower.includes('aire') ||
    amenityLower.includes('air-conditioning')
  )
    return <Waves className='w-4 h-4' />
  if (amenityLower.includes('safe') || amenityLower.includes('seguridad'))
    return <Shield className='w-4 h-4' />
  if (amenityLower.includes('parking') || amenityLower.includes('parqueadero'))
    return <Car className='w-4 h-4' />
  if (amenityLower.includes('minibar') || amenityLower.includes('bar'))
    return <Coffee className='w-4 h-4' />
  if (
    amenityLower.includes('room-service') ||
    amenityLower.includes('servicio')
  )
    return <Phone className='w-4 h-4' />
  if (
    amenityLower.includes('airport-transfer') ||
    amenityLower.includes('transporte')
  )
    return <Plane className='w-4 h-4' />

  return <Check className='w-4 h-4' />
}

type ViewMode = 'grid' | 'list' | 'comparison'
type SortOption = 'price-asc' | 'price-desc' | 'capacity' | 'size' | 'name'

const RoomsPage = ({ locale }: { locale: Locale }) => {     // 👈 acepta solo locale
  // Helper function to get valid locale for translations
  const getValidLocale = (loc: Locale): LocaleType => {
    const result = loc === 'all' ? 'es' : loc
    
    // Debug logging - remove in production
    if (process.env.NODE_ENV === 'development') {
      console.log('getValidLocale debug:', { 
        original: loc, 
        result, 
        type: typeof result 
      })
    }
    
    return result
  }
  const sp = useSearchParams()                                 
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchTerm, 250)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('price-asc')
  const [isLoaded, setIsLoaded] = useState(false)
  // Mouse orbs handled in separate component to avoid re-renders
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [favoriteRooms, setFavoriteRooms] = useState<string[]>([])

  // Filtros
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    capacity: '',
    amenities: [] as string[],
    available: false,
    featured: false,
  })

  const [allAmenities, setAllAmenities] = useState<string[]>([])
  const { isLg } = useBreakpoint()

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/rooms?locale=${locale}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch rooms')
        const { rooms: roomsResult } = await res.json()
        setRooms(roomsResult)

        // amenities únicas (igual que ya hacías)
        const amenitiesSet = new Set<string>()
        roomsResult.forEach((room: Room) => {
          room.amenities?.forEach((amenity: any) => {
            if (amenity.amenity) amenitiesSet.add(amenity.amenity)
            if (amenity.customAmenity) amenitiesSet.add(amenity.customAmenity)
          })
        })
        setAllAmenities(Array.from(amenitiesSet))
        setLoading(false)
        setIsLoaded(true)
      } catch (error) {
        console.error('Error loading rooms:', error)
        setLoading(false)
      }
    }
    loadData()
  }, [locale])

  // Advanced filtering - memoized predicates and sorting
  const searchPredicate = useMemo(
    () => (r: Room) =>
      !debouncedSearch ||
      r.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (renderDescription(r.description)?.toString() || '')
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()),
    [debouncedSearch],
  )

  const pricePredicate = useMemo(
    () => (r: Room) =>
      (!filters.minPrice || r.price >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || r.price <= parseInt(filters.maxPrice)),
    [filters.minPrice, filters.maxPrice],
  )

  const capacityPredicate = useMemo(
    () => (r: Room) =>
      !filters.capacity || r.capacity >= parseInt(filters.capacity),
    [filters.capacity],
  )

  const roomsWithSets = useMemo(() => {
    return rooms.map((r) => ({
      ...r,
      amenitiesSet: new Set(
        (r.amenities || []).map((a) =>
          (a.customAmenity || a.amenity || '').toLowerCase(),
        ),
      ),
    }))
  }, [rooms])

  const amenitiesPredicate = useMemo(
    () => (r: Room & { amenitiesSet?: Set<string> }) =>
      filters.amenities.length === 0 ||
      filters.amenities.every((amenity) =>
        r.amenitiesSet
          ? r.amenitiesSet.has(amenity.toLowerCase())
          : (r.amenities || []).some((roomAmenity) => {
              const amenityText =
                roomAmenity.customAmenity || roomAmenity.amenity || ''
              return amenityText.toLowerCase().includes(amenity.toLowerCase())
            }),
      ),
    [filters.amenities],
  )

  const availablePredicate = useMemo(
    () => (r: Room) => !filters.available || Boolean(r.available),
    [filters.available],
  )

  const featuredPredicate = useMemo(
    () => (r: Room) => !filters.featured || Boolean(r.featured),
    [filters.featured],
  )

  const sortConfig = useMemo(() => {
    switch (sortBy) {
      case 'price-asc':
        return { by: 'price', direction: 'asc' } as const
      case 'price-desc':
        return { by: 'price', direction: 'desc' } as const
      case 'capacity':
        return { by: 'capacity', direction: 'desc' } as const
      case 'size':
        return { by: (r: Room) => parseInt(r.size), direction: 'desc' } as const
      case 'name':
        return {
          comparator: (a: Room, b: Room) => a.title.localeCompare(b.title),
          direction: 'asc',
        } as const
      default:
        return undefined
    }
  }, [sortBy])

  // Simple, stable, flicker-free filtering with useMemo
  const filteredRooms = useMemo(() => {
    // 1) Filter
    const base = roomsWithSets.filter(
      (r: any) =>
        searchPredicate(r) &&
        pricePredicate(r) &&
        capacityPredicate(r) &&
        amenitiesPredicate(r) &&
        availablePredicate(r) &&
        featuredPredicate(r),
    )
    // 2) Sort
    if (!sortConfig) return base
    const { by, direction = 'asc', comparator } = sortConfig as any
    const dir = direction === 'asc' ? 1 : -1
    const list = base.slice()
    if (comparator) return list.sort(comparator)
    if (!by) return list
    const accessor = typeof by === 'function' ? by : (i: any) => i[by]
    return list.sort((a, b) => {
      const va = accessor(a)
      const vb = accessor(b)
      if (va === vb) return 0
      return va > vb ? dir : -dir
    })
  }, [
    roomsWithSets,
    searchPredicate,
    pricePredicate,
    capacityPredicate,
    amenitiesPredicate,
    availablePredicate,
    featuredPredicate,
    sortConfig,
  ])

  const clearFilters = useCallback(() => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      capacity: '',
      amenities: [],
      available: false,
      featured: false,
    })
    setSearchTerm('')
  }, [])

  const toggleAmenityFilter = useCallback((amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }, [])

  const toggleRoomSelection = useCallback((roomId: string) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId],
    )
  }, [])

  const toggleFavorite = useCallback((roomId: string) => {
    setFavoriteRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId],
    )
  }, [])

  const RoomCard = React.memo(({ room }: { room: Room; index: number }) => {
    return (
      <div className='bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden'>
        {/* Image */}
        <div className='h-48 overflow-hidden relative'>
          <Image
            src={getImagePath(room.images?.[0])}
            alt={room.title}
            fill
            className='object-cover'
          />
        </div>

        {/* Content */}
        <div className='p-6'>
          <h3 className='font-serif text-xl font-bold text-gray-900 mb-3'>
            {room.title}
          </h3>

          <p className='font-sans font-light text-sm text-gray-600 leading-relaxed mb-4'>
            {renderDescription(room.description)}
          </p>

          <div className='mb-4'>
            <span className='font-sans text-2xl font-bold text-gray-900'>
              {formatPrice(room.price)}
            </span>
            <span className='font-sans text-sm text-gray-600 ml-1'>
              {t(getValidLocale(locale), 'rooms.room.perNight')}
            </span>
          </div>

          <div className='flex items-center gap-4 text-sm text-gray-600 mb-4'>
            <div className='flex items-center gap-1'>
              <Users className='w-4 h-4' />
              <span>{room.capacity} {t(getValidLocale(locale), 'rooms.room.guests')}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Square className='w-4 h-4' />
              <span>{room.size}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Bed className='w-4 h-4' />
              <span>
                {getBedTypeLabel(room.bedType, getValidLocale(locale))}
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <span className='text-xs text-gray-400 ml-1'>
                    ({room.bedType})
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Amenities */}
          <div className='flex flex-wrap gap-2 mb-6'>
            {(room.amenities || []).slice(0, 3).map((amenity, idx) => (
              <div
                key={idx}
                className='flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600'
              >
                {getAmenityIcon(amenity)}
                <span>{getAmenityText(amenity)}</span>
              </div>
            ))}
            {(room.amenities || []).length > 3 && (
              <div className='px-2 py-1 bg-gray-100 rounded text-xs text-gray-600'>
                +{(room.amenities || []).length - 3} {t(getValidLocale(locale), 'rooms.room.moreAmenities')}
              </div>
            )}
          </div>

          <div className='flex gap-3'>
            <a
              href={`/rooms/${room.slug || room.id}`}
              className='flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg py-3 px-4 text-center'
            >
              {t(getValidLocale(locale), 'rooms.room.viewDetails')}
            </a>

            <button
              onClick={() =>
                (window.location.href = `/booking?room=${room.id}`)
              }
              className='border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg font-semibold text-sm'
            >
              {t(getValidLocale(locale), 'rooms.room.book')}
            </button>
          </div>
        </div>
      </div>
    )
  })
  RoomCard.displayName = 'RoomCard'

  const RoomListItem = React.memo(
    ({ room, index }: { room: Room; index: number }) => {
      return (
        <div
          className='bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300'
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          {/* Mobile-first responsive layout */}
          <div className='flex flex-col sm:flex-row gap-0 sm:gap-6'>
            {/* Image - Full width on mobile, fixed width on desktop */}
            <div className='relative w-full h-48 sm:w-64 sm:h-40 sm:rounded-lg sm:m-6 sm:mt-6 sm:mb-6 flex-shrink-0 overflow-hidden'>
              <Image
                src={getImagePath(room.images?.[0])}
                alt={room.title}
                fill
                className='object-cover'
              />

              {/* Badges */}
              <div className='absolute top-3 left-3 flex flex-col gap-1'>
                {room.featured && (
                  <div className='bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium'>
                    <Star className='w-3 h-3 inline mr-1' />
                    {t(getValidLocale(locale), 'rooms.featured')}
                  </div>
                )}
              </div>

              {/* Favorite button - Always visible on mobile */}
              <div className='absolute top-3 right-3'>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(room.id)
                  }}
                  className={`p-2 rounded transition-colors duration-200 ${
                    favoriteRooms.includes(room.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart className='w-3 h-3 sm:w-4 sm:h-4' />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className='flex-1 p-4 sm:p-6 sm:pl-0'>
              <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3'>
                <div className='flex-1'>
                  <h3 className='font-serif text-lg sm:text-xl font-bold text-gray-900 mb-2'>
                    {room.title}
                  </h3>

                  {/* Price - Show prominently on mobile */}
                  <div className='sm:hidden mb-3'>
                    <div className='font-sans text-xl font-bold text-gray-900'>
                      {formatPrice(room.price)}
                    </div>
                    <div className='font-sans text-sm text-gray-600'>
                      por noche
                    </div>
                  </div>

                  {/* Room details */}
                  <div className='flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3'>
                    <div className='flex items-center gap-1'>
                      <Users className='w-3 h-3 sm:w-4 sm:h-4' />
                      <span>
                        {room.capacity} huésped{room.capacity > 1 ? 'es' : ''}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Square className='w-3 h-3 sm:w-4 sm:h-4' />
                      <span>{room.size}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Bed className='w-3 h-3 sm:w-4 sm:h-4' />
                      <span>
                        {getBedTypeLabel(room.bedType, getValidLocale(locale))}
                        {/* Debug info - remove in production */}
                        {process.env.NODE_ENV === 'development' && (
                          <span className='text-xs text-gray-400 ml-1'>
                            ({room.bedType})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price - Show on desktop */}
                <div className='hidden sm:block text-right ml-4'>
                  <div className='font-sans text-2xl font-bold text-gray-900'>
                    {formatPrice(room.price)}
                  </div>
                  <div className='font-sans text-sm text-gray-600'>
                    {t(getValidLocale(locale), 'rooms.room.perNight')}
                  </div>
                </div>
              </div>

              <p className='font-sans font-light text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2 sm:line-clamp-none'>
                {renderDescription(room.description)}
              </p>

              {/* Amenities - Fewer on mobile */}
              <div className='flex flex-wrap gap-2 mb-4'>
                {(room.amenities || [])
                  .slice(0, isLg ? 6 : 3)
                  .map((amenity, idx) => (
                    <div
                      key={idx}
                      className='flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600'
                    >
                      {getAmenityIcon(amenity)}
                      <span className='hidden sm:inline'>
                        {getAmenityText(amenity)}
                      </span>
                    </div>
                  ))}
                {(room.amenities || []).length > (isLg ? 6 : 3) && (
                  <div className='px-2 py-1 bg-gray-100 rounded text-xs text-gray-600'>
                    +{(room.amenities || []).length - (isLg ? 6 : 3)} {t(getValidLocale(locale), 'rooms.room.moreAmenities')}
                  </div>
                )}
              </div>

              {/* Action buttons - Stack on mobile */}
              <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
                <a
                  href={`/rooms/${room.slug || room.id}`}
                  className='bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg py-3 px-4 sm:px-6 transition-colors duration-200 text-center'
                >
                  <span className='flex items-center justify-center'>
                    {t(getValidLocale(locale), 'rooms.room.viewDetails')}
                    <ArrowRight className='w-4 h-4 ml-2' />
                  </span>
                </a>

                <button
                  onClick={() =>
                    (window.location.href = `/booking?room=${room.id}`)
                  }
                  className='border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors duration-200'
                >
                  {t(getValidLocale(locale), 'rooms.room.book')}
                </button>

                {viewMode === 'comparison' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleRoomSelection(room.id)
                    }}
                    className={`px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                      selectedRooms.includes(room.id)
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {selectedRooms.includes(room.id)
                      ? t(getValidLocale(locale), 'rooms.room.selected')
                      : t(getValidLocale(locale), 'rooms.room.compare')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    },
  )
  RoomListItem.displayName = 'RoomListItem'

  if (loading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center pt-20'>
        <div className='relative'>
          <div className='w-20 h-20 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-full animate-spin border-2 border-gray-200 border-t-gray-900' />
          <div className='absolute inset-0 bg-gray-300/20 rounded-full animate-pulse' />
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20'>
      {/* Floating background orbs */}
      <MouseOrbs />

      {/* Hero Section */}
      <div
        id='rooms-hero'
        className='relative max-w-7xl mx-auto px-6 py-12 z-10'
      >
        <div className='text-center mb-12'>
          <h1
            className={`font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {t(getValidLocale(locale), 'rooms.title')}
          </h1>
          <p
            className={`font-sans font-light text-xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            {t(getValidLocale(locale), 'rooms.subtitle')}
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div
          id='rooms-filters'
          className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-8 transform transition-all duration-700 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ animationDelay: '0.4s' }}
        >
          <div className='flex flex-col lg:flex-row gap-4 items-center'>
            {/* Search */}
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                placeholder={t(getValidLocale(locale), 'rooms.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-200'
              />
            </div>

            {/* View Mode Buttons - Only show list and comparison on desktop */}
            <div className='hidden lg:flex gap-2'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid3X3 className='w-5 h-5' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className='w-5 h-5' />
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  viewMode === 'comparison'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal className='w-5 h-5' />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200'
            >
              <Filter className='w-5 h-5' />
              <span className='font-sans font-medium'>{t(getValidLocale(locale), 'rooms.filters.title')}</span>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Sort */}
            <CustomSortSelect
            value={sortBy}
            onChange={(v) => setSortBy(v)}
            locale={getValidLocale(locale)}
          />
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
                <div>
                  <label className='block font-sans text-sm font-medium text-gray-700 mb-2'>
                    {t(getValidLocale(locale), 'rooms.filters.minPrice')}
                  </label>
                  <input
                    type='number'
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value,
                      }))
                    }
                    className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-gray-500 transition-colors duration-200'
                    placeholder='0'
                  />
                </div>
                <div>
                  <label className='block font-sans text-sm font-medium text-gray-700 mb-2'>
                    {t(getValidLocale(locale), 'rooms.filters.maxPrice')}
                  </label>
                  <input
                    type='number'
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value,
                      }))
                    }
                    className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-gray-500 transition-colors duration-200'
                    placeholder='999999'
                  />
                </div>
                <div>
                  <label className='block font-sans text-sm font-medium text-gray-700 mb-2'>
                    {t(getValidLocale(locale), 'rooms.filters.capacity')}
                  </label>
                  <input
                    type='number'
                    value={filters.capacity}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        capacity: e.target.value,
                      }))
                    }
                    className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-gray-500 transition-colors duration-200'
                    placeholder='1'
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='block font-sans text-sm font-medium text-gray-700'>
                    {t(getValidLocale(locale), 'rooms.filters.options')}
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={filters.available}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          available: e.target.checked,
                        }))
                      }
                      className='rounded border-gray-300'
                    />
                    <span className='font-sans text-sm text-gray-700'>
                      {t(getValidLocale(locale), 'rooms.filters.availableOnly')}
                    </span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={filters.featured}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          featured: e.target.checked,
                        }))
                      }
                      className='rounded border-gray-300'
                    />
                    <span className='font-sans text-sm text-gray-700'>
                      {t(getValidLocale(locale), 'rooms.filters.featuredOnly')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Amenities Filter */}
              <div className='mb-4'>
                <label className='block font-sans text-sm font-medium text-gray-700 mb-2'>
                  {t(getValidLocale(locale), 'rooms.filters.amenities')}
                </label>
                <div className='flex flex-wrap gap-2'>
                  {allAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenityFilter(amenity)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        filters.amenities.includes(amenity)
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className='flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200'
              >
                <X className='w-4 h-4' />
                <span className='font-sans text-sm'>{t(getValidLocale(locale), 'rooms.filters.clearFilters')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div
          className={`flex items-center justify-between mb-8 transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ animationDelay: '0.6s' }}
        >
          <div className='font-sans text-gray-600'>
            <span className='font-semibold text-gray-900'>
              {filteredRooms.length}
            </span>{' '}
            {tPlural(getValidLocale(locale), 'rooms.results.found', filteredRooms.length)}
          </div>

          {viewMode === 'comparison' && selectedRooms.length > 0 && (
            <div className='flex items-center gap-4'>
              <span className='font-sans text-sm text-gray-600'>
                {selectedRooms.length} {tPlural(getValidLocale(locale), 'rooms.results.selected', selectedRooms.length)}
              </span>
              <button
                onClick={() => setSelectedRooms([])}
                className='text-gray-600 hover:text-gray-800 transition-colors duration-200'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          )}
        </div>

        {/* Rooms Grid/List - Only grid on mobile */}
        <div
          id='rooms-list'
          className={`transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ animationDelay: '0.8s' }}
        >
          {viewMode === 'grid' || !isLg ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {filteredRooms.map((room, index) => (
                <RoomCard key={room.id} room={room} index={index} />
              ))}
            </div>
          ) : (
            <div className='space-y-6'>
              {filteredRooms.map((room, index) => (
                <RoomListItem key={room.id} room={room} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* No Results */}
        {filteredRooms.length === 0 && (
          <div className='text-center py-16'>
            <div className='font-sans text-xl text-gray-600 mb-4'>
              {t(getValidLocale(locale), 'rooms.noResults')}
            </div>
            <button
              onClick={clearFilters}
              className='bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg py-3 px-6 transition-colors duration-200'
            >
              {t(getValidLocale(locale), 'rooms.filters.clearFilters')}
            </button>
          </div>
        )}
      </div>

      {/* Comparison Panel - Only show on desktop */}
      {viewMode === 'comparison' && selectedRooms.length > 0 && (
        <div className='hidden lg:block fixed bottom-6 left-6 right-6 z-40'>
          <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-serif text-xl font-bold text-gray-900'>
                {t(getValidLocale(locale), 'rooms.comparison.title')} ({selectedRooms.length})
              </h3>
              <button
                onClick={() => setSelectedRooms([])}
                className='text-gray-600 hover:text-gray-800 transition-colors duration-200'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-40 overflow-y-auto'>
              {selectedRooms.map((roomId) => {
                const room = rooms.find((r) => r.id === roomId)
                if (!room) return null

                return (
                  <div
                    key={roomId}
                    className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'
                  >
                    <Image
                      src={getImagePath(room.images?.[0])}
                      alt={room.title}
                      width={48}
                      height={48}
                      className='object-cover rounded'
                    />
                    <div className='flex-1 min-w-0'>
                      <div className='font-sans font-medium text-gray-900 truncate'>
                        {room.title}
                      </div>
                      <div className='font-sans text-sm text-gray-600'>
                        {formatPrice(room.price)}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRoomSelection(roomId)}
                      className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                )
              })}
            </div>

            <div className='flex gap-3 mt-4'>
              <button className='flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg py-3 px-6 transition-colors duration-200'>
                <span className='flex items-center justify-center'>
                  {t(getValidLocale(locale), 'rooms.comparison.viewDetailed')}
                  <Eye className='w-4 h-4 ml-2' />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for bottom panel - Only on desktop */}
      {viewMode === 'comparison' && selectedRooms.length > 0 && (
        <div className='hidden lg:block h-40'></div>
      )}
    </div>
  )
}

export default RoomsPage
