import PageLayout from '../components/page-layout';
import ContactForm from '../components/contact-form';

const Contact = () => {
  return (
    <PageLayout title="Contact">
      <p className="prose md:prose-lg max-w-none mb-12">
        If you have a question about something I've built, have an issue with me at a deep, personal level, or are interested in hiring me for a project, get in touch!
      </p>

      <ContactForm />
    </PageLayout>
  )
}

export default Contact;
