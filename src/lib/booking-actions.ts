'use server'

import { calculateNights } from '@/lib/clientRooms'

interface BookingFormData {
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
  selectedRooms: { roomId: string; quantity: number }[]
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    message: string
  }
}

interface Room {
  id: string
  title: string
  price: number
}

export async function sendBookingEmails({
  formData,
  rooms,
}: {
  formData: BookingFormData
  rooms: Room[]
}) {
  try {
    const nights = calculateNights(formData.checkIn, formData.checkOut)
    const totalPrice = formData.selectedRooms.reduce((total, selectedRoom) => {
      const room = rooms.find((r) => r.id === selectedRoom.roomId)
      return total + (room ? room.price * selectedRoom.quantity * nights : 0)
    }, 0)

    const selectedRoomsWithDetails = formData.selectedRooms.map(
      (selectedRoom) => {
        const room = rooms.find((r) => r.id === selectedRoom.roomId)
        return {
          title: room?.title || 'Habitación no encontrada',
          quantity: selectedRoom.quantity,
          price: room?.price || 0,
        }
      },
    )

    // Enviar email al cliente
    await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-booking-confirmation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.personalInfo.email,
          formData,
          rooms,
        }),
      },
    )

    // Enviar email al administrador
    await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-admin-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          rooms,
        }),
      },
    )

    return { success: true }
  } catch (error) {
    console.error('Error sending emails:', error)
    throw new Error('Error enviando emails de reserva')
  }
}
