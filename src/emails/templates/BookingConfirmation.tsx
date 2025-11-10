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
        Confirmación de pre-reserva — Hotel Juan María — {customerName}
      </Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          {/* Header con gradiente signature (oscuro) */}
          <Section
            style={{
              ...styles.header,
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
            <Text style={styles.headerSubtitle}>Tuluá, Valle del Cauca</Text>
          </Section>

          {/* Contenido principal */}
          <Section style={styles.content}>
            <Text style={styles.title}>¡Gracias por tu pre-reserva!</Text>

            <Text style={styles.greeting}>Estimado/a {customerName},</Text>

            <Text style={styles.paragraph}>
              Hemos recibido tu solicitud de pre-reserva en Hotel Juan María. Nuestro
              equipo la revisará y se pondrá en contacto contigo pronto para
              confirmar la disponibilidad y finalizar tu reserva.
            </Text>

            {/* Detalles de la solicitud */}
            <Section style={{ ...styles.block, ...styles.blockMuted }}>
              <Text style={styles.sectionTitle}>Detalles de tu solicitud</Text>

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

            {/* Habitaciones */}
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
                    <Text style={styles.tableHeaderText}>Subtotal</Text>
                  </Column>
                </Row>

                {rooms.map((room, index) => (
                  <Row
                    key={`${room.title}-${index}`}
                    style={{
                      ...styles.tableRow,
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                    }}
                  >
                    <Column style={styles.tableCell}>
                      <Text style={styles.tableCellText}>{room.title}</Text>
                    </Column>
                    <Column style={styles.tableCell}>
                      <Text style={styles.tableCellText}>{room.quantity}</Text>
                    </Column>
                    <Column style={styles.tableCellRight}>
                      <Text style={styles.tableCellText}>
                        {formatPrice(room.price * room.quantity * nights)}
                      </Text>
                    </Column>
                  </Row>
                ))}

                <Hr style={styles.hr} />

                <Row style={styles.totalRow}>
                  <Column style={styles.totalLabelCell}>
                    <Text style={styles.totalLabelText}>Total estimado:</Text>
                  </Column>
                  <Column style={styles.totalValueCell}>
                    <Text style={styles.totalValueText}>
                      {formatPrice(totalPrice)}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            {/* Mensaje del cliente */}
            {message && (
              <Section style={{ ...styles.block, ...styles.blockNote }}>
                <Text style={styles.sectionTitle}>Tu mensaje</Text>
                <Text style={styles.messageText}>{message}</Text>
              </Section>
            )}

            {/* Próximos pasos */}
            <Section style={{ ...styles.block, ...styles.blockSoft }}>
              <Text style={styles.sectionTitle}>Próximos pasos</Text>
              <Text style={styles.paragraph}>
                • Revisaremos la disponibilidad para las fechas solicitadas
                <br />
                • Te contactaremos dentro de las próximas 24 horas
                <br />
                • Te enviaremos los detalles finales y métodos de pago
                <br />• Confirmaremos oficialmente tu reserva
              </Text>
            </Section>

            {/* CTA Primario */}
            <Section style={styles.ctaSection}>
              <Button style={styles.primaryButton} href="https://hotel-juan-maria.com">
                Visitar sitio web
              </Button>
            </Section>

            {/* Contacto */}
            <Section style={styles.block}>
              <Text style={styles.sectionTitle}>¿Necesitas ayuda?</Text>

              <Row style={styles.contactRow}>
                <Column style={styles.contactMethod}>
                  <Text style={styles.contactMethodTitle}>Teléfono</Text>
                  <Link href="tel:+5722244562" style={styles.link}>
                    +57 (2) 224-4562
                  </Link>
                </Column>

                <Column style={styles.contactMethod}>
                  <Text style={styles.contactMethodTitle}>Email</Text>
                  <Link href="mailto:reservas@hoteljuanmaria.com" style={styles.link}>
                    reservas@hoteljuanmaria.com
                  </Link>
                </Column>

                <Column style={styles.contactMethod}>
                  <Text style={styles.contactMethodTitle}>Dirección</Text>
                  <Text style={styles.smallText}>
                    Carrera 26 # 25-09, Tuluá, Valle del Cauca
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Nota */}
            <Section style={styles.noteOuter}>
              <Text style={styles.noteText}>
                Esta pre-reserva aún no es una confirmación final. Te
                contactaremos para completar el proceso.
              </Text>
            </Section>

            <Text style={styles.thankYou}>
              ¡Será un placer recibirte pronto!
            </Text>

            <Text style={styles.signature}>
              Cordialmente,
              <br />
              <strong>Equipo Hotel Juan María</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 Hotel Juan María. Todos los derechos reservados.
            </Text>
            <Text style={styles.footerText}>
              Carrera 26 # 25-09, Tuluá, Valle del Cauca, Colombia
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

/* ================================
 * Styles — Liquid Luxury (email-safe)
 * ================================ */
const styles = {
  main: {
    backgroundColor: '#f9fafb', // gray-50
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif",
    color: '#374151', // gray-700
    margin: 0,
    padding: 0,
  },
  container: {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '560px',
  },
  header: {
    borderRadius: '12px 12px 0 0', // rounded-xl
    padding: '36px 28px',
    textAlign: 'center' as const,
  },
  logo: {
    margin: '0 auto 8px',
    display: 'block',
  },
  headerTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 700,
    margin: '10px 0 2px',
    letterSpacing: '0.2px',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: '14px',
    margin: 0,
    fontWeight: 400,
  },
  content: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb', // gray-200
    borderTop: 'none',
    borderRadius: '0 0 12px 12px', // rounded-xl
    padding: '32px 28px',
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#111827', // gray-900
    fontSize: '24px',
    fontWeight: 700,
    textAlign: 'center' as const,
    margin: '0 0 20px',
  },
  greeting: {
    color: '#1f2937', // gray-800
    fontSize: '16px',
    margin: '0 0 12px',
  },
  paragraph: {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '22px',
    margin: '0 0 14px',
  },

  // Blocks (glassmorphism-inspired: soft bg, subtle border, rounded-xl)
  block: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '18px 20px',
    margin: '18px 0',
  },
  blockMuted: {
    backgroundColor: '#f8fafc', // slate/gray-50
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

  // Details
  detailRow: {
    margin: '8px 0',
  },
  detailLabel: {
    width: '40%',
    paddingRight: '8px',
  },
  detailLabelText: {
    color: '#6b7280',
    fontSize: '14px',
    margin: 0,
    fontWeight: 500,
  },
  detailValue: {
    width: '60%',
  },
  detailValueText: {
    color: '#1f2937',
    fontSize: '14px',
    fontWeight: 500,
    margin: 0,
  },

  // Rooms table
  roomsSection: {
    margin: '24px 0',
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
  tableCellRight: {
    padding: '12px',
    borderRight: '1px solid #e5e7eb',
    textAlign: 'right' as const,
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
    width: '70%',
  },
  totalLabelText: {
    color: '#1f2937',
    fontSize: '15px',
    fontWeight: 700,
    margin: 0,
  },
  totalValueCell: {
    padding: '12px',
    width: '30%',
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
    lineHeight: '22px',
    fontStyle: 'italic',
    margin: 0,
  },

  // CTA
  ctaSection: {
    textAlign: 'center' as const,
    margin: '8px 0 22px',
  },
  primaryButton: {
    backgroundColor: '#111827', // dark primary
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
    padding: '12px 18px',
    borderRadius: '8px', // rounded-lg
    border: '1px solid #111827',
    display: 'inline-block',
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
    margin: '0 0 6px',
  },
  smallText: {
    color: '#4b5563',
    fontSize: '13px',
    margin: 0,
  },
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
    margin: '10px 0 20px',
    textAlign: 'center' as const,
  },
  noteText: {
    color: '#374151',
    fontSize: '13px',
    margin: 0,
  },

  // Farewell
  thankYou: {
    color: '#1f2937',
    fontSize: '18px',
    fontWeight: 600,
    textAlign: 'center' as const,
    margin: '18px 0 10px',
  },
  signature: {
    color: '#374151',
    fontSize: '15px',
    margin: '14px 0',
  },

  // Footer
  footer: {
    backgroundColor: '#f3f4f6',
    borderRadius: '0 0 12px 12px',
    padding: '18px 28px',
    textAlign: 'center' as const,
  },
  footerText: {
    color: '#6b7280',
    fontSize: '12px',
    margin: '4px 0',
  },
} as const
