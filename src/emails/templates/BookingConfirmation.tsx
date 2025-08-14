import * as React from 'react'
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Img,
  Text,
  Link,
  Hr,
  Button,
} from '@react-email/components'

interface BookingEmailTemplateProps {
  customerName: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  rooms: Array<{
    title: string
    quantity: number
    price: number
  }>
  totalPrice: number
  message?: string
}

export const BookingEmailTemplate: React.FC<BookingEmailTemplateProps> = ({
  customerName,
  checkIn,
  checkOut,
  nights,
  guests,
  rooms,
  totalPrice,
  message,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Html>
      <Head />
      <Preview>
        Confirmación de pre-reserva en Hotel Juan María - {customerName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header con logo */}
          <Section style={header}>
            <Img
              src='https://hotel-juan-maria.com/WhiteIcon.svg'
              width='60'
              height='60'
              alt='Hotel Juan María'
              style={logo}
            />
            <Text style={headerTitle}>Hotel Juan María</Text>
            <Text style={headerSubtitle}>Tuluá, Valle del Cauca</Text>
          </Section>

          {/* Contenido principal */}
          <Section style={content}>
            <Text style={title}>¡Gracias por tu pre-reserva!</Text>

            <Text style={greeting}>Estimado/a {customerName},</Text>

            <Text style={paragraph}>
              Hemos recibido tu solicitud de pre-reserva para Hotel Juan María.
              Nuestro equipo la revisará y se pondrá en contacto contigo pronto
              para confirmar la disponibilidad y finalizar tu reserva.
            </Text>

            {/* Detalles de la reserva */}
            <Section style={detailsSection}>
              <Text style={sectionTitle}>Detalles de tu solicitud</Text>

              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={detailLabelText}>Fecha de entrada:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={detailValueText}>{formatDate(checkIn)}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={detailLabelText}>Fecha de salida:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={detailValueText}>{formatDate(checkOut)}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={detailLabelText}>Noches:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={detailValueText}>{nights}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={detailLabelText}>Huéspedes:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={detailValueText}>{guests}</Text>
                </Column>
              </Row>
            </Section>

            {/* Habitaciones seleccionadas */}
            <Section style={roomsSection}>
              <Text style={sectionTitle}>Habitaciones solicitadas</Text>
              {rooms.map((room, index) => (
                <Row key={index} style={roomRow}>
                  <Column style={roomInfo}>
                    <Text style={roomTitle}>{room.title}</Text>
                    <Text style={roomQuantity}>Cantidad: {room.quantity}</Text>
                  </Column>
                  <Column style={roomPrice}>
                    <Text style={roomPriceText}>
                      {formatPrice(room.price * room.quantity * nights)}
                    </Text>
                  </Column>
                </Row>
              ))}

              <Hr style={hr} />

              <Row style={totalRow}>
                <Column style={totalLabel}>
                  <Text style={totalLabelText}>Total estimado:</Text>
                </Column>
                <Column style={totalValue}>
                  <Text style={totalValueText}>{formatPrice(totalPrice)}</Text>
                </Column>
              </Row>
            </Section>

            {message && (
              <Section style={messageSection}>
                <Text style={sectionTitle}>Tu mensaje</Text>
                <Text style={messageText}>{message}</Text>
              </Section>
            )}

            <Text style={paragraph}>
              <strong>Próximos pasos:</strong>
            </Text>
            <Text style={paragraph}>
              • Revisaremos la disponibilidad para las fechas solicitadas
              <br />
              • Te contactaremos dentro de las próximas 24 horas
              <br />
              • Te enviaremos los detalles finales y métodos de pago
              <br />• Confirmaremos oficialmente tu reserva
            </Text>

            <Text style={paragraph}>
              Si tienes alguna pregunta, no dudes en contactarnos:
            </Text>

            <Section style={contactSection}>
              <Text style={contactItem}>
                📞 Teléfono:{' '}
                <Link href='tel:+5722244562' style={link}>
                  +57 (2) 224-4562
                </Link>
              </Text>
              <Text style={contactItem}>
                ✉️ Email:{' '}
                <Link href='mailto:reservas@hoteljuanmaria.com' style={link}>
                  reservas@hoteljuanmaria.com
                </Link>
              </Text>
              <Text style={contactItem}>
                📍 Dirección: Carrera 26 # 25-09, Tuluá, Valle del Cauca
              </Text>
            </Section>

            <Text style={thankYou}>
              ¡Esperamos tenerte pronto como nuestro huésped!
            </Text>

            <Text style={signature}>
              Cordialmente,
              <br />
              <strong>Equipo Hotel Juan María</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2025 Hotel Juan María. Todos los derechos reservados.
            </Text>
            <Text style={footerText}>
              Carrera 26 # 25-09, Tuluá, Valle del Cauca, Colombia
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Estilos
const main = {
  backgroundColor: '#f8fafc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
}

const header = {
  backgroundColor: '#1f2937',
  borderRadius: '8px 8px 0 0',
  padding: '40px 30px',
  textAlign: 'center' as const,
}

const logo = {
  margin: '0 auto',
}

const headerTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '16px 0 8px',
}

const headerSubtitle = {
  color: '#d1d5db',
  fontSize: '16px',
  margin: '0',
}

const content = {
  backgroundColor: '#ffffff',
  padding: '40px 30px',
}

const title = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 32px',
}

const greeting = {
  color: '#374151',
  fontSize: '16px',
  margin: '0 0 16px',
}

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const sectionTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '32px 0 16px',
}

const detailsSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const detailRow = {
  margin: '8px 0',
}

const detailLabel = {
  width: '40%',
}

const detailLabelText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
}

const detailValue = {
  width: '60%',
}

const detailValueText = {
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
}

const roomsSection = {
  margin: '32px 0',
}

const roomRow = {
  margin: '12px 0',
  padding: '12px 0',
  borderBottom: '1px solid #e5e7eb',
}

const roomInfo = {
  width: '70%',
}

const roomTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 4px',
}

const roomQuantity = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
}

const roomPrice = {
  width: '30%',
  textAlign: 'right' as const,
}

const roomPriceText = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
}

const totalRow = {
  margin: '16px 0',
}

const totalLabel = {
  width: '70%',
}

const totalLabelText = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
}

const totalValue = {
  width: '30%',
  textAlign: 'right' as const,
}

const totalValueText = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
}

const messageSection = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const messageText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  fontStyle: 'italic',
  margin: '0',
}

const contactSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const contactItem = {
  color: '#374151',
  fontSize: '14px',
  margin: '8px 0',
}

const link = {
  color: '#2563eb',
  textDecoration: 'none',
}

const thankYou = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '500',
  textAlign: 'center' as const,
  margin: '32px 0 24px',
}

const signature = {
  color: '#374151',
  fontSize: '16px',
  margin: '24px 0',
}

const footer = {
  backgroundColor: '#f9fafb',
  borderRadius: '0 0 8px 8px',
  padding: '20px 30px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '4px 0',
}
