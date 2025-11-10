import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import React from 'react'
import { AdminBookingTemplate } from '@/emails/templates/AdminBookingNotification'
import { calculateNights } from '@/lib/data'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { formData, rooms } = await request.json()

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

    // Email al administrador - usar el email de reservas del footer
    const adminEmail = 'reservas@hoteljuanmaria.com' 

    const data = await resend.emails.send({
      from: 'Sistema de Reservas <sistema@web.hoteljuanmaria.com>',
      to: [adminEmail, 'simoncalderonl2010@gmail.com', 'juanjo03212242004@gmail.com'],
      subject: `🔔 Nueva pre-reserva: ${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
      react: AdminBookingTemplate({
        customerName: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
        customerEmail: formData.personalInfo.email,
        customerPhone: formData.personalInfo.phone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        nights: nights,
        guests: formData.guests,
        rooms: selectedRoomsWithDetails,
        totalPrice: totalPrice,
        message: formData.personalInfo.message,
        timestamp: new Date().toISOString(),
      }) as React.ReactElement,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error sending admin notification email:', error)
    return NextResponse.json(
      { error: 'Failed to send admin notification email' },
      { status: 500 },
    )
  }
}
