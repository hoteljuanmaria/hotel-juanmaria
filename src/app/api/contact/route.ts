import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import ContactFormEmail from '@/emails/templates/ContactFormEmail'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

// Schema de validación con Zod
const contactFormSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Debe ser un email válido'),
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  tipoConsulta: z.enum([
    'Reservas',
    'Información General',
    'Eventos',
    'Servicios',
    'Quejas y Sugerencias',
    'Otro',
    'General Information',
    'Reservations',
    'Future Reservations',
    'Opening Dates',
    'Events',
    'Services',
    'Complaints and Suggestions',
    'Other',
  ]),
  mensaje: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar los datos del formulario
    const validationResult = contactFormSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validationResult.error.issues,
        },
        { status: 400 },
      )
    }

    const { nombre, apellido, email, telefono, tipoConsulta, mensaje } =
      validationResult.data

    // Renderizar el email
    const emailHtml = await render(
      ContactFormEmail({
        nombre,
        apellido,
        email,
        telefono,
        tipoConsulta,
        mensaje,
      }) as React.ReactElement,
    )

    // Enviar el email
    const { data, error } = await resend.emails.send({
      from: 'Hotel Juan Maria <contactoweb@web.hoteljuanmaria.com>',
      to: ['simoncalderonl2010@gmail.com',  'juanjo03212242004@gmail.com', 'reservas@hoteljuanmaria.com'],
      subject: `Nueva consulta: ${tipoConsulta} - ${nombre} ${apellido}`,
      html: emailHtml,
      replyTo: email, // Permitir responder directamente al cliente
    })

    if (error) {
      console.error('Error enviando email:', error)
      return NextResponse.json(
        { error: 'Error al enviar el mensaje' },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        message: 'Mensaje enviado exitosamente',
        id: data?.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error en la API de contacto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
