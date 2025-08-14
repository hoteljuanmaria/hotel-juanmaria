import React from 'react'
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Img,
} from '@react-email/components'

interface ContactFormEmailProps {
  nombre: string
  apellido: string
  email: string
  telefono: string
  tipoConsulta: string
  mensaje?: string
}

export const ContactFormEmail: React.FC<ContactFormEmailProps> = ({
  nombre,
  apellido,
  email,
  telefono,
  tipoConsulta,
  mensaje,
}) => {
  return (
    <Html>
      <Head />
      <Preview>
        Nueva consulta de {nombre} {apellido} - {tipoConsulta}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header con branding del hotel */}
          <Section style={headerSection}>
            <Heading style={hotelName}>Hotel Juan María</Heading>
            <Text style={headerSubtitle}>Consulta desde el sitio web</Text>
          </Section>

          <Hr style={hr} />

          {/* Información del contacto */}
          <Section style={section}>
            <Heading style={h2}>Nueva Consulta Recibida</Heading>

            <div style={infoGrid}>
              <div style={infoItem}>
                <Text style={label}>Nombre:</Text>
                <Text style={value}>
                  {nombre} {apellido}
                </Text>
              </div>

              <div style={infoItem}>
                <Text style={label}>Email:</Text>
                <Text style={value}>{email}</Text>
              </div>

              <div style={infoItem}>
                <Text style={label}>Teléfono:</Text>
                <Text style={value}>{telefono}</Text>
              </div>

              <div style={infoItem}>
                <Text style={label}>Tipo de Consulta:</Text>
                <Text style={consultaType}>{tipoConsulta}</Text>
              </div>
            </div>

            {mensaje && (
              <>
                <Text style={label}>Mensaje:</Text>
                <div style={messageBox}>
                  <Text style={messageText}>{mensaje}</Text>
                </div>
              </>
            )}
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Esta consulta fue enviada desde el formulario de contacto del
              sitio web de Hotel Juan María.
            </Text>
            <Text style={footerText}>
              Carrera 28 No. 27-10, Barrio Centro, Tuluá, Valle del Cauca
            </Text>
            <Text style={footerText}>
              Teléfono: +57 315 490-2333 | WhatsApp: +57 300 607-8808
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Estilos inline para mejor compatibilidad con clientes de email
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '12px',
  boxShadow:
    '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
}

const headerSection = {
  padding: '32px 24px 0',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
  margin: '0 0 32px 0',
  borderRadius: '12px 12px 0 0',
}

const hotelName = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0 0 8px 0',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}

const headerSubtitle = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#e5e7eb',
  margin: '0 0 24px 0',
  fontWeight: '400',
}

const section = {
  padding: '0 24px',
}

const h2 = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 24px 0',
}

const infoGrid = {
  display: 'grid',
  gap: '16px',
  marginBottom: '24px',
}

const infoItem = {
  borderLeft: '4px solid #374151',
  paddingLeft: '16px',
  backgroundColor: '#f9fafb',
  padding: '12px 16px',
  borderRadius: '0 8px 8px 0',
}

const label = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#6b7280',
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}

const value = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#1f2937',
  margin: '0',
  fontWeight: '500',
}

const consultaType = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#1f2937',
  margin: '0',
  fontWeight: '600',
  backgroundColor: '#dbeafe',
  padding: '6px 12px',
  borderRadius: '20px',
  display: 'inline-block',
}

const messageBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px',
  margin: '8px 0 0 0',
}

const messageText = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const hr = {
  borderColor: '#e6e6e6',
  margin: '20px 0',
}

const footer = {
  padding: '0 24px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '12px',
  lineHeight: '1.4',
  color: '#6b7280',
  margin: '4px 0',
}

export default ContactFormEmail
