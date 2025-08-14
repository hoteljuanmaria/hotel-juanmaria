import { BookingEmailTemplate } from '@/emails/templates/BookingConfirmation'
import { AdminBookingTemplate } from '@/emails/templates/AdminBookingNotification'
import { Room } from '@/lib/data'

interface BookingFormData {
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
  selectedRooms: { roomId: number; quantity: number }[]
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    message: string
  }
}

export async function sendBookingEmails({
  formData,
  rooms,
}: {
  formData: BookingFormData
  rooms: Room[]
}) {
  try {
    // Enviar email al cliente
    await fetch('/api/send-booking-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formData.personalInfo.email,
        formData,
        rooms,
      }),
    })

    // Enviar email al administrador
    await fetch('/api/send-admin-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        rooms,
      }),
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending emails:', error)
    throw error
  }
}
