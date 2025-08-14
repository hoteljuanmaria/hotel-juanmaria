import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import React from 'react'
import { BookingEmailTemplate } from '@/emails/templates/BookingConfirmation'
import { calculateNights, formatPrice } from '@/lib/data'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { to, formData, rooms } = await request.json()

    const nights = calculateNights(formData.checkIn, formData.checkOut)
    const totalPrice = formData.selectedRooms.reduce(
      (total: number, selectedRoom: any) => {
        const room = rooms.find((r: any) => r.id === selectedRoom.roomId)
        return total + (room ? room.price * selectedRoom.quantity * nights : 0)
      },
      0,
    )

    const selectedRoomsWithDetails = formData.selectedRooms.map(
      (selectedRoom: any) => {
        const room = rooms.find((r: any) => r.id === selectedRoom.roomId)
        return {
          title: room?.title || 'Habitación no encontrada',
          quantity: selectedRoom.quantity,
          price: room?.price || 0,
        }
      },
    )

    const data = await resend.emails.send({
      from: 'Hotel Juan María <noreply@web.hoteljuanmaria.com>',
      to: [to],
      subject: `Confirmación de pre-reserva - Hotel Juan María`,
      react: BookingEmailTemplate({
        customerName: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        nights: nights,
        guests: formData.guests,
        rooms: selectedRoomsWithDetails,
        totalPrice: totalPrice,
        message: formData.personalInfo.message,
      }) as React.ReactElement,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error sending booking confirmation email:', error)
    return NextResponse.json(
      { error: 'Failed to send booking confirmation email' },
      { status: 500 },
    )
  }
}
