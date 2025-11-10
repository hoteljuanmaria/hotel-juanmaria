'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react'
import ElegantDropdown from '../ui/elegantDropbown'


// Schema de validación
const contactFormSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Debe ser un email válido'),
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  tipoConsulta: z.enum(
    [
      'Reservas',
      'Información General',
      'Eventos',
      'Servicios',
      'Quejas y Sugerencias',
      'Otro',
    ],
    { message: 'Por favor selecciona un tipo de consulta' }
  ),
  mensaje: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactFormSchema>

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control, // ← necesario para Controller
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.')
        reset()
      } else {
        setSubmitStatus('error')
        setSubmitMessage(result.error || 'Error al enviar el mensaje. Intenta nuevamente.')
      }
    } catch {
      setSubmitStatus('error')
      setSubmitMessage('Error de conexión. Verifica tu internet e intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const tiposConsulta = [
    'Reservas',
    'Información General',
    'Eventos',
    'Servicios',
    'Quejas y Sugerencias',
    'Otro',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contacta con
            <span className="block bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-clip-text text-transparent">
              Hotel Juan María
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Envíanos tu consulta y nos pondremos en contacto contigo lo antes posible.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Información de contacto */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6 h-fit w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                    <p className="text-gray-900 text-sm whitespace-nowrap">reservas@hoteljuanmaria.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Teléfono</p>
                    <p className="text-gray-900 text-sm">+57 315 490-2333</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Dirección</p>
                    <p className="text-gray-900 text-sm leading-relaxed">
                      Carrera 28 No. 27-10
                      <br />
                      Barrio Centro, Tuluá
                      <br />
                      Valle del Cauca, Colombia
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Horarios de Atención</h4>
                <p className="text-sm text-gray-600">
                  Recepción: 24 horas
                  <br />
                  Restaurante: 6:30 AM - 10:00 AM
                </p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Envíanos tu Consulta</h3>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <p className="text-green-700">{submitMessage}</p>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <p className="text-red-700">{submitMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Nombre y Apellido */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('nombre')}
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 hover:border-gray-400"
                      placeholder="Tu nombre"
                    />
                    {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('apellido')}
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 hover:border-gray-400"
                      placeholder="Tu apellido"
                    />
                    {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>}
                  </div>
                </div>

                {/* Email y Teléfono */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 hover:border-gray-400"
                      placeholder="tu@email.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('telefono')}
                      type="tel"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 hover:border-gray-400"
                      placeholder="+57 315 4902239"
                    />
                    {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>}
                  </div>
                </div>

       {/* Tipo de Consulta */}
<div className="relative isolate z-[100]">
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-700">
      Tipo de Consulta <span className="text-red-500">*</span>
    </label>
  </div>
<Controller
  name="tipoConsulta"
  control={control}
  rules={{ required: 'Por favor selecciona un tipo de consulta' }}
  render={({ field }) => (
    <ElegantDropdown
      showLabel={false}
      variant="light"
      size="md"
      value={field.value ?? ''}
      onChange={field.onChange}
      options={tiposConsulta.map((t) => ({ value: t, label: t }))}
      icon={<MessageSquare className="w-5 h-5" />}
      placeholder="Selecciona el tipo de consulta"
      className="w-full"
    />
  )}
/>



  {errors.tipoConsulta && (
    <p className="mt-2 text-sm text-red-600">{errors.tipoConsulta.message}</p>
  )}
</div>


                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje (Opcional)</label>
                  <textarea
                    {...register('mensaje')}
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 hover:border-gray-400 resize-none"
                    placeholder="Cuéntanos más detalles sobre tu consulta..."
                  />
                  {errors.mensaje && <p className="mt-1 text-sm text-red-600">{errors.mensaje.message}</p>}
                </div>

                {/* Botón de envío */}
                <div className="pt-4 relative z-10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 relative font-semibold rounded-lg overflow-hidden transition-all duration-700 group disabled:opacity-50 disabled:cursor-not-allowed text-white hover:scale-105 hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-900 before:via-gray-800 before:to-black after:absolute after:inset-0 after:bg-gradient-to-tr after:from-transparent after:via-white/10 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-700"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Enviando...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Consulta
                        </div>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform scale-0 group-hover:scale-100 transition-transform duration-700 rounded-lg"></div>
                    <div className="absolute inset-0 border border-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
