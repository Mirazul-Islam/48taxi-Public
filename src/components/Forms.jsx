import { Link } from 'react-router-dom';
import { useForm, Input, Textarea, Honeypot, FormStatus, SubmitButton } from './form-kit.jsx';

/* ---------------- Contact & affiliate ---------------- */
export function ContactForm() {
  const f = useForm('contact');
  if (f.status === 'done') return <FormStatus f={f} title="Message sent" done="Thanks for getting in touch. We usually reply within a few hours." />;
  return (
    <form name="contact" onSubmit={f.onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Honeypot f={f} />
      <Input f={f} name="name" label="Name" required autoComplete="name" />
      <Input f={f} name="email" type="email" label="Email" required autoComplete="email" />
      <Input f={f} name="phone" type="tel" label="Phone" autoComplete="tel" className="sm:col-span-2" />
      <Textarea f={f} name="message" label="Message" required rows={5} className="sm:col-span-2" />
      <div className="sm:col-span-2"><FormStatus f={f} /></div>
      <div className="sm:col-span-2"><SubmitButton f={f}>Send message</SubmitButton></div>
      <p className="text-sm text-ink-3 sm:col-span-2">Want to book a ride? Use the <Link to="/book-now/">booking form</Link> so we get all your trip details.</p>
    </form>
  );
}

export function AffiliateForm() {
  const f = useForm('affiliate');
  if (f.status === 'done') return <FormStatus f={f} title="Application received" done="Thanks for your interest in partnering with 48Taxi & Limo. We’ll review your details and get back to you." />;
  return (
    <form name="affiliate" onSubmit={f.onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Honeypot f={f} />
      <Input f={f} name="company" label="Name of company" required autoComplete="organization" className="sm:col-span-2" />
      <Input f={f} name="contactPerson" label="Contact person" required autoComplete="name" />
      <Input f={f} name="email" type="email" label="Email address" required autoComplete="email" />
      <Input f={f} name="phone" type="tel" label="Phone number" required autoComplete="tel" />
      <Input f={f} name="tollFree" type="tel" label="Toll free number" />
      <Input f={f} name="fax" type="tel" label="Fax number" />
      <Input f={f} name="website" type="url" label="Website" placeholder="https://" />
      <Input f={f} name="mailingAddress" label="Mailing address" autoComplete="street-address" className="sm:col-span-2" />
      <Input f={f} name="suite" label="Suite number" />
      <Input f={f} name="city" label="City" autoComplete="address-level2" />
      <Input f={f} name="province" label="Province / state" autoComplete="address-level1" />
      <Input f={f} name="postalCode" label="Postal / ZIP code" autoComplete="postal-code" />
      <Input f={f} name="yearsInBusiness" type="number" min="0" label="Years in business" />
      <div className="sm:col-span-2"><FormStatus f={f} /></div>
      <div className="sm:col-span-2"><SubmitButton f={f}>Submit application</SubmitButton></div>
    </form>
  );
}
