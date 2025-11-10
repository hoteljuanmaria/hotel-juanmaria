import ContactForm from '@/components/ContactForm'

type Locale = 'es' | 'en'

const ContactPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: Locale }>
}) => {
  return (
    <div className='py-8'>
      <ContactForm />
    </div>
  )
}

export default ContactPage
