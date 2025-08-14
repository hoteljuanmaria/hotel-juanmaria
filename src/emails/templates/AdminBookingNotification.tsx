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
} from '@react-email/components'

interface AdminBookingTemplateProps {
  customerName: string
  customerEmail: string
  customerPhone: string
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
  timestamp: string
}

export const AdminBookingTemplate: React.FC<AdminBookingTemplateProps> = ({
  customerName,
  customerEmail,
  customerPhone,
  checkIn,
  checkOut,
  nights,
  guests,
  rooms,
  totalPrice,
  message,
  timestamp,
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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Html>
      <Head />
      <Preview>
        Nueva pre-reserva: {customerName} - {formatDate(checkIn)}
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
            <Text style={headerSubtitle}>Panel de Administración</Text>
          </Section>

          {/* Contenido principal */}
          <Section style={content}>
            <Text style={title}>Nueva Pre-reserva Recibida</Text>

            <Section style={alertSection}>
              <Text style={alertText}>
                🔔 Se ha recibido una nueva solicitud de pre-reserva
              </Text>
              <Text style={timestampText}>
                Fecha/Hora: {formatTimestamp(timestamp)}
              </Text>
            </Section>

            {/* Información del cliente */}
            <Section style={customerSection}>
              <Text style={sectionTitle}>Información del Cliente</Text>

              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={detailLabelText}>Nombre completo:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={detailValueText}>{customerName}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={detailLabelText}>Email:</Text>
                </Column>
                <Column style={detailValue}>
                  <Link href={`mailto:${customerEmail}`} style={link}>
                    {customerEmail}
                  </Link>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={detailLabelText}>Teléfono:</Text>
                </Column>
                <Column style={detailValue}>
                  <Link href={`tel:${customerPhone}`} style={link}>
                    {customerPhone}
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Detalles de la reserva */}
            <Section style={bookingSection}>
              <Text style={sectionTitle}>Detalles de la Reserva</Text>

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

            {/* Habitaciones solicitadas */}
            <Section style={roomsSection}>
              <Text style={sectionTitle}>Habitaciones Solicitadas</Text>

              <div style={roomsTable}>
                <Row style={tableHeader}>
                  <Column style={tableHeaderCell}>
                    <Text style={tableHeaderText}>Habitación</Text>
                  </Column>
                  <Column style={tableHeaderCell}>
                    <Text style={tableHeaderText}>Cantidad</Text>
                  </Column>
                  <Column style={tableHeaderCell}>
                    <Text style={tableHeaderText}>Precio/noche</Text>
                  </Column>
                  <Column style={tableHeaderCell}>
                    <Text style={tableHeaderText}>Subtotal</Text>
                  </Column>
                </Row>

                {rooms.map((room, index) => (
                  <Row key={index} style={tableRow}>
                    <Column style={tableCell}>
                      <Text style={tableCellText}>{room.title}</Text>
                    </Column>
                    <Column style={tableCell}>
                      <Text style={tableCellText}>{room.quantity}</Text>
                    </Column>
                    <Column style={tableCell}>
                      <Text style={tableCellText}>
                        {formatPrice(room.price)}
                      </Text>
                    </Column>
                    <Column style={tableCell}>
                      <Text style={tableCellText}>
                        {formatPrice(room.price * room.quantity * nights)}
                      </Text>
                    </Column>
                  </Row>
                ))}

                <Hr style={hr} />

                <Row style={totalRow}>
                  <Column style={totalLabelCell}>
                    <Text style={totalLabelText}>TOTAL ESTIMADO:</Text>
                  </Column>
                  <Column style={totalValueCell}>
                    <Text style={totalValueText}>
                      {formatPrice(totalPrice)}
                    </Text>
                  </Column>
                </Row>
              </div>
            </Section>

            {message && (
              <Section style={messageSection}>
                <Text style={sectionTitle}>Mensaje del Cliente</Text>
                <Text style={messageText}>&ldquo;{message}&rdquo;</Text>
              </Section>
            )}

            {/* Acciones recomendadas */}
            <Section style={actionsSection}>
              <Text style={sectionTitle}>Acciones Recomendadas</Text>

              <Text style={actionItem}>
                ✅ Verificar disponibilidad para las fechas solicitadas
              </Text>
              <Text style={actionItem}>
                📞 Contactar al cliente dentro de las próximas 24 horas
              </Text>
              <Text style={actionItem}>
                💰 Confirmar precios y métodos de pago disponibles
              </Text>
              <Text style={actionItem}>
                📋 Generar cotización formal si es necesario
              </Text>
              <Text style={actionItem}>
                ✉️ Enviar confirmación final al cliente
              </Text>
            </Section>

            {/* Información de contacto rápido */}
            <Section style={quickContactSection}>
              <Text style={sectionTitle}>Contacto Rápido</Text>

              <Row style={contactRow}>
                <Column style={contactMethod}>
                  <Text style={contactMethodTitle}>Email</Text>
                  <Link
                    href={`mailto:${customerEmail}?subject=Confirmación de Reserva - Hotel Juan María&body=Estimado/a ${customerName},%0A%0AGracias por contactarnos...`}
                    style={contactLink}
                  >
                    Enviar Email
                  </Link>
                </Column>
                <Column style={contactMethod}>
                  <Text style={contactMethodTitle}>WhatsApp</Text>
                  <Link
                    href={`https://wa.me/${customerPhone.replace(/\D/g, '')}?text=Hola ${customerName}, nos comunicamos desde Hotel Juan María sobre tu solicitud de reserva...`}
                    style={contactLink}
                  >
                    Enviar WhatsApp
                  </Link>
                </Column>
                <Column style={contactMethod}>
                  <Text style={contactMethodTitle}>Llamada</Text>
                  <Link href={`tel:${customerPhone}`} style={contactLink}>
                    Llamar Ahora
                  </Link>
                </Column>
              </Row>
            </Section>

            <Text style={urgencyNote}>
              <strong>Nota:</strong> Esta pre-reserva requiere respuesta dentro
              de las próximas 24 horas para mantener la satisfacción del
              cliente.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Sistema de Pre-reservas Hotel Juan María
            </Text>
            <Text style={footerText}>
              Generado automáticamente el {formatTimestamp(timestamp)}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Estilos
const main = {
  backgroundColor: '#f3f4f6',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '600px',
}

const header = {
  backgroundColor: '#dc2626',
  borderRadius: '8px 8px 0 0',
  padding: '30px',
  textAlign: 'center' as const,
}

const logo = {
  margin: '0 auto',
}

const headerTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '12px 0 4px',
}

const headerSubtitle = {
  color: '#fecaca',
  fontSize: '14px',
  margin: '0',
}

const content = {
  backgroundColor: '#ffffff',
  padding: '30px',
}

const title = {
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const alertSection = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 0 24px',
}

const alertText = {
  color: '#dc2626',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 8px',
}

const timestampText = {
  color: '#991b1b',
  fontSize: '14px',
  margin: '0',
}

const sectionTitle = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '24px 0 12px',
  borderBottom: '2px solid #e5e7eb',
  paddingBottom: '8px',
}

const customerSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 0',
}

const bookingSection = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 0',
}

const roomsSection = {
  margin: '24px 0',
}

const roomsTable = {
  width: '100%',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  overflow: 'hidden',
}

const tableHeader = {
  backgroundColor: '#f3f4f6',
}

const tableHeaderCell = {
  padding: '12px',
  borderRight: '1px solid #e5e7eb',
}

const tableHeaderText = {
  color: '#374151',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
}

const tableRow = {
  borderTop: '1px solid #e5e7eb',
}

const tableCell = {
  padding: '12px',
  borderRight: '1px solid #e5e7eb',
}

const tableCellText = {
  color: '#374151',
  fontSize: '14px',
  margin: '0',
}

const detailRow = {
  margin: '8px 0',
}

const detailLabel = {
  width: '35%',
}

const detailLabelText = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
}

const detailValue = {
  width: '65%',
}

const detailValueText = {
  color: '#1f2937',
  fontSize: '14px',
  margin: '0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '8px 0',
}

const totalRow = {
  backgroundColor: '#f9fafb',
}

const totalLabelCell = {
  padding: '12px',
  width: '75%',
}

const totalLabelText = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
}

const totalValueCell = {
  padding: '12px',
  width: '25%',
  textAlign: 'right' as const,
}

const totalValueText = {
  color: '#dc2626',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
}

const messageSection = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fed7aa',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const messageText = {
  color: '#92400e',
  fontSize: '16px',
  fontStyle: 'italic',
  lineHeight: '24px',
  margin: '0',
}

const actionsSection = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const actionItem = {
  color: '#166534',
  fontSize: '14px',
  margin: '8px 0',
}

const quickContactSection = {
  backgroundColor: '#fafafa',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const contactRow = {
  margin: '16px 0',
}

const contactMethod = {
  textAlign: 'center' as const,
  padding: '0 8px',
}

const contactMethodTitle = {
  color: '#374151',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 8px',
}

const contactLink = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '500',
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  display: 'inline-block',
}

const link = {
  color: '#2563eb',
  textDecoration: 'none',
}

const urgencyNote = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fbbf24',
  borderRadius: '8px',
  padding: '16px',
  color: '#92400e',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '24px 0',
}

const footer = {
  backgroundColor: '#f9fafb',
  borderRadius: '0 0 8px 8px',
  padding: '20px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '4px 0',
}
