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

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString('es-ES', {
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
        Nueva pre-reserva: {customerName} — {formatDate(checkIn)}
      </Preview>

      <Body style={styles.main}>
        <Container style={styles.card}>
          {/* Header */}
          <Section
            style={{
              ...styles.header,
              // Fallback solid color + gradient for compatible clients
              backgroundColor: '#111827',
              backgroundImage:
                'linear-gradient(135deg, #111827 0%, #1f2937 50%, #0b0b0b 100%)',
            }}
          >
            <Img
              src="https://hoteljuanmaria.com/GrayIcon.png"
              width="60"
              height="60"
              alt="Hotel Juan María"
              style={styles.logo}
            />
            <Text style={styles.headerTitle}>Hotel Juan María</Text>
            <Text style={styles.headerSubtitle}>Panel de administración</Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.title}>Nueva pre-reserva recibida</Text>

            {/* Gentle alert (no red) */}
            <Section style={styles.alertSection}>
              <Text style={styles.alertText}>🔔 Se recibió una nueva solicitud</Text>
              <Text style={styles.timestampText}>
                Fecha/Hora: {formatTimestamp(timestamp)}
              </Text>
            </Section>

            {/* Customer info */}
            <Section style={styles.block}>
              <Text style={styles.sectionTitle}>Información del cliente</Text>

              <Row style={styles.detailRow}>
                <Column style={styles.detailLabel}>
                  <Text style={styles.detailLabelText}>Nombre completo:</Text>
                </Column>
                <Column style={styles.detailValue}>
                  <Text style={styles.detailValueText}>{customerName}</Text>
                </Column>
              </Row>

              <Row style={styles.detailRow}>
                <Column style={styles.detailLabel}>
                  <Text style={styles.detailLabelText}>Email:</Text>
                </Column>
                <Column style={styles.detailValue}>
                  <Link href={`mailto:${customerEmail}`} style={styles.link}>
                    {customerEmail}
                  </Link>
                </Column>
              </Row>

              <Row style={styles.detailRow}>
                <Column style={styles.detailLabel}>
                  <Text style={styles.detailLabelText}>Teléfono:</Text>
                </Column>
                <Column style={styles.detailValue}>
                  <Link href={`tel:${customerPhone}`} style={styles.link}>
                    {customerPhone}
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Booking details */}
            <Section style={{ ...styles.block, ...styles.blockMuted }}>
              <Text style={styles.sectionTitle}>Detalles de la reserva</Text>

              <Row style={styles.detailRow}>
                <Column style={styles.detailLabel}>
                  <Text style={styles.detailLabelText}>Fecha de entrada:</Text>
                </Column>
                <Column style={styles.detailValue}>
                  <Text style={styles.detailValueText}>{formatDate(checkIn)}</Text>
                </Column>
              </Row>

              <Row style={styles.detailRow}>
                <Column style={styles.detailLabel}>
                  <Text style={styles.detailLabelText}>Fecha de salida:</Text>
                </Column>
                <Column style={styles.detailValue}>
                  <Text style={styles.detailValueText}>{formatDate(checkOut)}</Text>
                </Column>
              </Row>

              <Row style={styles.detailRow}>
                <Column style={styles.detailLabel}>
                  <Text style={styles.detailLabelText}>Noches:</Text>
                </Column>
                <Column style={styles.detailValue}>
                  <Text style={styles.detailValueText}>{nights}</Text>
                </Column>
              </Row>

              <Row style={styles.detailRow}>
                <Column style={styles.detailLabel}>
                  <Text style={styles.detailLabelText}>Huéspedes:</Text>
                </Column>
                <Column style={styles.detailValue}>
                  <Text style={styles.detailValueText}>{guests}</Text>
                </Column>
              </Row>
            </Section>

            {/* Rooms */}
            <Section style={styles.roomsSection}>
              <Text style={styles.sectionTitle}>Habitaciones solicitadas</Text>

              <Section style={styles.tableOuter}>
                <Row style={styles.tableHeader}>
                  <Column style={styles.tableHeaderCell}>
                    <Text style={styles.tableHeaderText}>Habitación</Text>
                  </Column>
                  <Column style={styles.tableHeaderCell}>
                    <Text style={styles.tableHeaderText}>Cantidad</Text>
                  </Column>
                  <Column style={styles.tableHeaderCell}>
                    <Text style={styles.tableHeaderText}>Precio/noche</Text>
                  </Column>
                  <Column style={styles.tableHeaderCell}>
                    <Text style={styles.tableHeaderText}>Subtotal</Text>
                  </Column>
                </Row>

                {rooms.map((room, idx) => (
                  <Row
                    key={`${room.title}-${idx}`}
                    style={{
                      ...styles.tableRow,
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                    }}
                  >
                    <Column style={styles.tableCell}>
                      <Text style={styles.tableCellText}>{room.title}</Text>
                    </Column>
                    <Column style={styles.tableCell}>
                      <Text style={styles.tableCellText}>{room.quantity}</Text>
                    </Column>
                    <Column style={styles.tableCell}>
                      <Text style={styles.tableCellText}>
                        {formatPrice(room.price)}
                      </Text>
                    </Column>
                    <Column style={styles.tableCell}>
                      <Text style={styles.tableCellText}>
                        {formatPrice(room.price * room.quantity * nights)}
                      </Text>
                    </Column>
                  </Row>
                ))}

                <Hr style={styles.hr} />

                <Row style={styles.totalRow}>
                  <Column style={styles.totalLabelCell}>
                    <Text style={styles.totalLabelText}>TOTAL ESTIMADO:</Text>
                  </Column>
                  <Column style={styles.totalValueCell}>
                    <Text style={styles.totalValueText}>
                      {formatPrice(totalPrice)}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            {/* Optional message */}
            {message && (
              <Section style={{ ...styles.block, ...styles.blockNote }}>
                <Text style={styles.sectionTitle}>Mensaje del cliente</Text>
                <Text style={styles.messageText}>&ldquo;{message}&rdquo;</Text>
              </Section>
            )}

            {/* Recommended actions */}
            <Section style={{ ...styles.block, ...styles.blockSoft }}>
              <Text style={styles.sectionTitle}>Acciones recomendadas</Text>

              <Text style={styles.actionItem}>✅ Verificar disponibilidad</Text>
              <Text style={styles.actionItem}>
                ✅ Contactar al cliente dentro de 24 horas
              </Text>
              <Text style={styles.actionItem}>✅ Confirmar precios y métodos de pago</Text>
              <Text style={styles.actionItem}>✅ Generar cotización formal (si aplica)</Text>
              <Text style={styles.actionItem}>✅ Enviar confirmación final</Text>
            </Section>

            {/* Quick contact */}
            <Section style={styles.block}>
              <Text style={styles.sectionTitle}>Contacto rápido</Text>
              <Row style={styles.contactRow}>
                <Column style={styles.contactMethod}>
                  <Text style={styles.contactMethodTitle}>Email</Text>
                  <Link
                    href={`mailto:${customerEmail}?subject=Confirmación de Reserva - Hotel Juan María&body=Estimado/a ${customerName},%0A%0AGracias por tu solicitud. A continuación te compartimos detalles y próximos pasos...`}
                    style={styles.primaryButton}
                  >
                    Enviar email
                  </Link>
                </Column>
                <Column style={styles.contactMethod}>
                  <Text style={styles.contactMethodTitle}>WhatsApp</Text>
                  <Link
                    href={`https://wa.me/${customerPhone.replace(/\D/g, '')}?text=Hola ${encodeURIComponent(
                      customerName
                    )}, te saludamos de Hotel Juan María respecto a tu solicitud de reserva.`}
                    style={styles.primaryButton}
                  >
                    Enviar WhatsApp
                  </Link>
                </Column>
                <Column style={styles.contactMethod}>
                  <Text style={styles.contactMethodTitle}>Llamada</Text>
                  <Link href={`tel:${customerPhone}`} style={styles.primaryButton}>
                    Llamar ahora
                  </Link>
                </Column>
              </Row>
            </Section>

            <Section style={styles.noteOuter}>
              <Text style={styles.noteText}>
                <strong>Nota:</strong> Responder dentro de 24 horas mantiene la
                experiencia premium y la tasa de conversión.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Sistema de pre-reservas • Hotel Juan María
            </Text>
            <Text style={styles.footerText}>
              Generado automáticamente el {formatTimestamp(timestamp)}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

/** ================================
 *  Styles — "Liquid Luxury" (email-safe)
 *  ================================ */
const styles = {
  // Page
  main: {
    backgroundColor: '#f3f4f6', // gray-100
    margin: 0,
    padding: 0,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif",
    color: '#374151', // gray-700 body
  },

  // Card container
  card: {
    width: '600px',
    margin: '0 auto',
    padding: '20px 0 48px',
  },

  // Header (dark, subdued gradient)
  header: {
    borderRadius: '12px 12px 0 0', // rounded-xl top
    padding: '28px',
    textAlign: 'center' as const,
  },
  logo: {
    display: 'block',
    margin: '0 auto 8px',
  },
  headerTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#ffffff',
    fontSize: '26px',
    fontWeight: 700,
    margin: '8px 0 2px',
    letterSpacing: '0.2px',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '14px',
    margin: 0,
    fontWeight: 400,
  },

  // Content card
  content: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb', // gray-200
    borderTop: 'none',
    borderRadius: '0 0 12px 12px', // rounded-xl bottom
    padding: '28px 28px 8px',
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#111827', // gray-900
    fontSize: '22px',
    fontWeight: 700,
    textAlign: 'center' as const,
    margin: '0 0 20px',
  },

  // Subtle alert (no red)
  alertSection: {
    backgroundColor: '#f9fafb', // gray-50
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px 18px',
    margin: '0 0 20px',
  },
  alertText: {
    color: '#1f2937', // gray-800
    fontSize: '15px',
    fontWeight: 600,
    margin: '0 0 6px',
  },
  timestampText: {
    color: '#6b7280', // gray-500/600
    fontSize: '13px',
    margin: 0,
  },

  // Blocks
  block: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '18px 20px',
    margin: '16px 0',
  },
  blockMuted: {
    backgroundColor: '#f8fafc', // slate-50-ish
  },
  blockSoft: {
    backgroundColor: '#f9fafb', // gray-50
  },
  blockNote: {
    backgroundColor: '#f9fafb',
  },

  sectionTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#111827',
    fontSize: '18px',
    fontWeight: 700,
    margin: '6px 0 12px',
    paddingBottom: '8px',
    borderBottom: '2px solid #e5e7eb',
  },

  // Details grid
  detailRow: {
    margin: '8px 0',
  },
  detailLabel: {
    width: '35%',
    paddingRight: '8px',
  },
  detailLabelText: {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: 500,
    margin: 0,
  },
  detailValue: {
    width: '65%',
  },
  detailValueText: {
    color: '#1f2937',
    fontSize: '14px',
    margin: 0,
  },

  // Rooms table
  roomsSection: {
    margin: '20px 0',
  },
  tableOuter: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    borderBottom: '1px solid #e5e7eb',
  },
  tableHeaderCell: {
    padding: '12px',
    borderRight: '1px solid #e5e7eb',
  },
  tableHeaderText: {
    color: '#374151',
    fontSize: '13px',
    fontWeight: 700,
    margin: 0,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
  tableRow: {
    borderTop: '1px solid #e5e7eb',
  },
  tableCell: {
    padding: '12px',
    borderRight: '1px solid #e5e7eb',
    verticalAlign: 'top' as const,
  },
  tableCellText: {
    color: '#374151',
    fontSize: '14px',
    margin: 0,
  },
  hr: {
    borderColor: '#e5e7eb',
    margin: '8px 0',
  },
  totalRow: {
    backgroundColor: '#f9fafb',
  },
  totalLabelCell: {
    padding: '12px',
    width: '75%',
  },
  totalLabelText: {
    color: '#1f2937',
    fontSize: '15px',
    fontWeight: 700,
    margin: 0,
  },
  totalValueCell: {
    padding: '12px',
    width: '25%',
    textAlign: 'right' as const,
  },
  totalValueText: {
    color: '#111827',
    fontSize: '18px',
    fontWeight: 800,
    margin: 0,
  },

  // Message
  messageText: {
    color: '#374151',
    fontSize: '15px',
    fontStyle: 'italic',
    lineHeight: '22px',
    margin: 0,
  },

  // Actions
  actionItem: {
    color: '#374151',
    fontSize: '14px',
    margin: '6px 0',
  },

  // Contact
  contactRow: {
    margin: '12px 0',
  },
  contactMethod: {
    textAlign: 'center' as const,
    padding: '0 8px',
  },
  contactMethodTitle: {
    color: '#374151',
    fontSize: '14px',
    fontWeight: 600,
    margin: '0 0 8px',
  },

  // Buttons — primary dark (no red)
  primaryButton: {
    backgroundColor: '#111827',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 600,
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '8px', // rounded-lg
    display: 'inline-block',
    border: '1px solid #111827',
  },

  // Links
  link: {
    color: '#1f2937',
    textDecoration: 'underline',
  },

  // Note
  noteOuter: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '14px 16px',
    margin: '10px 0 28px',
    textAlign: 'center' as const,
  },
  noteText: {
    color: '#374151',
    fontSize: '13px',
    margin: 0,
  },

  // Footer
  footer: {
    backgroundColor: '#f9fafb',
    borderRadius: '0 0 12px 12px',
    padding: '18px',
    textAlign: 'center' as const,
  },
  footerText: {
    color: '#6b7280',
    fontSize: '12px',
    margin: '4px 0',
  },
} as const
