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
  Row,
  Column,
  Link,
  Button,
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
  const safePhone = (telefono || '').replace(/\D/g, '')

  return (
    <Html>
      <Head />
      <Preview>
        Nueva consulta de {nombre} {apellido} — {tipoConsulta}
      </Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          {/* Header — gradiente signature oscuro */}
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
              width="56"
              height="56"
              alt="Hotel Juan María"
              style={styles.logo}
            />
            <Text style={styles.hotelName}>Hotel Juan María</Text>
            <Text style={styles.headerSubtitle}>Consulta desde el sitio web</Text>
          </Section>

          {/* Contenido */}
          <Section style={styles.content}>
            <Heading style={styles.title}>Nueva consulta recibida</Heading>

            {/* Datos del contacto (layout con filas para compatibilidad) */}
            <Section style={{ ...styles.block, ...styles.blockMuted }}>
              <Row style={styles.detailRow}>
                <Column style={styles.detailLabel}>
                  <Text style={styles.label}>Nombre</Text>
                </Column>
                <Column style={styles.detailValue}>
                  <Text style={styles.value}>
                    {nombre} {apellido}
                  </Text>
                </Column>
              </Row>

              <Row style={styles.detailRow}>
                <Column style={styles.detailLabel}>
                  <Text style={styles.label}>Email</Text>
                </Column>
                <Column style={styles.detailValue}>
                  <Link href={`mailto:${email}`} style={styles.link}>
                    {email}
                  </Link>
                </Column>
              </Row>

              <Row style={styles.detailRow}>
                <Column style={styles.detailLabel}>
                  <Text style={styles.label}>Teléfono</Text>
                </Column>
                <Column style={styles.detailValue}>
                  <Link href={`tel:${safePhone}`} style={styles.link}>
                    {telefono}
                  </Link>
                </Column>
              </Row>

              <Row style={styles.detailRow}>
                <Column style={styles.detailLabel}>
                  <Text style={styles.label}>Tipo de consulta</Text>
                </Column>
                <Column style={styles.detailValue}>
                  <Text style={styles.consultaPill}>{tipoConsulta}</Text>
                </Column>
              </Row>
            </Section>

            {/* Mensaje */}
            {mensaje && (
              <Section style={{ ...styles.block, ...styles.blockNote }}>
                <Text style={styles.subTitle}>Mensaje</Text>
                <Section style={styles.messageBox}>
                  <Text style={styles.messageText}>{mensaje}</Text>
                </Section>
              </Section>
            )}

            {/* Acciones rápidas */}
            <Section style={{ ...styles.block, ...styles.blockSoft }}>
              <Text style={styles.subTitle}>Acciones rápidas</Text>
              <Row style={styles.actionsRow}>
                <Column style={styles.actionCol}>
                  <Button
                    style={styles.primaryButton}
                    href={`mailto:${email}?subject=Re:%20Consulta%20Hotel%20Juan%20Mar%C3%ADa`}
                  >
                    Responder por Email
                  </Button>
                </Column>
                <Column style={styles.actionCol}>
                  <Button style={styles.secondaryButton} href={`tel:${safePhone}`}>
                    Llamar al Contacto
                  </Button>
                </Column>
              </Row>
            </Section>

            <Hr style={styles.hr} />

            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                Esta consulta fue enviada desde el formulario de contacto del sitio
                web de Hotel Juan María.
              </Text>
              <Text style={styles.footerText}>
                Carrera 28 No. 27-10, Barrio Centro, Tuluá, Valle del Cauca
              </Text>
              <Text style={styles.footerText}>
                Teléfono: <Link href="tel:+573154902333" style={styles.linkDark}>+57 315 490-2333</Link> ·
                WhatsApp: <Link href="tel:+573006078808" style={styles.linkDark}>+57 300 607-8808</Link>
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

/* ================================
 *  Styles — "Liquid Luxury" (email-safe)
 * ================================ */
const styles = {
  main: {
    backgroundColor: '#f6f9fc',
    margin: 0,
    padding: 0,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif",
    color: '#374151', // gray-700
  },

  container: {
    margin: '0 auto',
    marginBottom: '64px',
    padding: '20px 0 48px',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '12px', // rounded-xl
    boxShadow:
      '0 10px 25px -5px rgba(0,0,0,0.10), 0 10px 10px -5px rgba(0,0,0,0.04)',
    border: '1px solid #e5e7eb', // subtle glass border
  },

  // Header (signature gradient)
  header: {
    padding: '28px 24px 18px',
    textAlign: 'center' as const,
    borderRadius: '12px 12px 0 0',
  },
  logo: {
    display: 'block',
    margin: '0 auto 8px',
  },
  hotelName: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '28px',
    lineHeight: '1.3',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 4px 0',
    letterSpacing: '0.2px',
    textShadow: '0 2px 4px rgba(0,0,0,0.12)',
  },
  headerSubtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
    fontWeight: 400,
  },

  // Content wrapper
  content: {
    backgroundColor: '#ffffff',
    borderRadius: '0 0 12px 12px',
    padding: '18px 24px 24px',
  },

  // Titles
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '24px',
    lineHeight: '1.3',
    fontWeight: 700,
    color: '#111827',
    margin: '6px 0 18px 0',
    textAlign: 'left' as const,
  },
  subTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '18px',
    lineHeight: '1.3',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 10px 0',
  },

  // Blocks (glass-inspired)
  block: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '16px 18px',
    margin: '14px 0',
  },
  blockMuted: {
    backgroundColor: '#f9fafb',
  },
  blockSoft: {
    backgroundColor: '#f8fafc',
  },
  blockNote: {
    backgroundColor: '#f9fafb',
  },

  // Detail rows
  detailRow: {
    margin: '8px 0',
  },
  detailLabel: {
    width: '40%',
    paddingRight: '8px',
  },
  detailValue: {
    width: '60%',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#6b7280',
    margin: 0,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  },
  value: {
    fontSize: '15px',
    color: '#1f2937',
    margin: 0,
    fontWeight: 500,
  },
  consultaPill: {
    fontSize: '14px',
    color: '#1f2937',
    fontWeight: 600,
    backgroundColor: '#e5e7eb', // neutral pill (no rojo)
    padding: '6px 12px',
    borderRadius: '9999px',
    display: 'inline-block',
  },

  // Message
  messageBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px', // rounded-lg for inner box
    padding: '14px',
    margin: '6px 0 0 0',
  },
  messageText: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#374151',
    margin: 0,
    whiteSpace: 'pre-wrap' as const,
  },

  // Actions
  actionsRow: {
    marginTop: '8px',
  },
  actionCol: {
    textAlign: 'center' as const,
    padding: '4px 6px',
  },
  primaryButton: {
    backgroundColor: '#111827', // dark primary
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 600,
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '8px', // rounded-lg
    border: '1px solid #111827',
    display: 'inline-block',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    color: '#1f2937',
    fontSize: '13px',
    fontWeight: 600,
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    display: 'inline-block',
  },

  // Links
  link: {
    color: '#1f2937',
    textDecoration: 'underline',
  },
  linkDark: {
    color: '#111827',
    textDecoration: 'underline',
  },

  // Rule
  hr: {
    borderColor: '#e6e6e6',
    margin: '18px 0',
  },

  // Footer
  footer: {
    textAlign: 'center' as const,
    padding: '0 6px',
  },
  footerText: {
    fontSize: '12px',
    lineHeight: '1.5',
    color: '#6b7280',
    margin: '4px 0',
  },
} as const

export default ContactFormEmail
