import { useId, useState } from 'react';
import { submitForm } from '../lib/forms.js';
import { business, telHref, whatsappHref } from '../data/site.js';

export function useForm(formName, initial = {}) {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const set = (k) => (e) => {
    const t = e?.target;
    const v = t ? (t.type === 'checkbox' ? t.checked : t.value) : e;
    setValues((s) => ({ ...s, [k]: v }));
  };
  const put = (k, v) => setValues((s) => ({ ...s, [k]: v }));
  const onSubmit = async (e, extra = {}) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setStatus('sending');
    try {
      await submitForm(formName, { ...values, ...extra });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };
  return { values, set, put, status, setStatus, onSubmit };
}

export function Field({ label, hint, required, children, className = '' }) {
  const id = useId();
  const child = typeof children === 'function' ? children(id) : children;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label} {required && <span className="text-brand-700" aria-hidden="true">*</span>}
      </label>
      {child}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function Input({ label, hint, name, f, required, type = 'text', className = '', ...rest }) {
  return (
    <Field label={label} hint={hint} required={required} className={className}>
      {(id) => <input id={id} name={name} type={type} required={required} value={f.values[name] ?? ''} onChange={f.set(name)} className="field" {...rest} />}
    </Field>
  );
}

export function Select({ label, hint, name, f, required, options, placeholder = 'Select…', className = '' }) {
  return (
    <Field label={label} hint={hint} required={required} className={className}>
      {(id) => (
        <select id={id} name={name} required={required} value={f.values[name] ?? ''} onChange={f.set(name)} className="field">
          <option value="">{placeholder}</option>
          {options.map((o) => {
            const [v, l] = Array.isArray(o) ? o : [o, o];
            return <option key={v} value={v}>{l}</option>;
          })}
        </select>
      )}
    </Field>
  );
}

export function Textarea({ label, hint, name, f, required, rows = 4, className = '', ...rest }) {
  return (
    <Field label={label} hint={hint} required={required} className={className}>
      {(id) => <textarea id={id} name={name} rows={rows} required={required} value={f.values[name] ?? ''} onChange={f.set(name)} className="field" {...rest} />}
    </Field>
  );
}

export function Check({ name, f, required, children }) {
  return (
    <label className="flex items-start gap-3 text-[15px]">
      <input type="checkbox" name={name} required={required} checked={!!f.values[name]} onChange={f.set(name)} className="mt-1 h-4 w-4 flex-none accent-brand-700" />
      <span>{children}</span>
    </label>
  );
}

/** Spam trap: hidden from people, filled in by bots; Netlify drops submissions that fill it. */
export function Honeypot({ f }) {
  return (
    <p className="hidden" aria-hidden="true">
      <label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" value={f.values['bot-field'] ?? ''} onChange={f.set('bot-field')} /></label>
    </p>
  );
}

export function FormStatus({ f, done = 'We received your request and will contact you shortly.', title = 'Request sent' }) {
  if (f.status === 'done')
    return (
      <div role="status" className="rounded-xl border border-green-700/50 bg-green-950/60 p-5">
        <p className="font-semibold text-green-100">{title}</p>
        <p className="mt-1 text-green-100">{done}</p>
        <p className="mt-2 text-sm text-green-100">Travelling within the next few hours? Call <a href={telHref} className="font-semibold text-green-100">{business.phone.display}</a> or <a href={whatsappHref('Hi 48 Taxi, I just sent a booking request on your website.')} target="_blank" rel="noopener" className="font-semibold text-green-100">message us on WhatsApp</a>.</p>
      </div>
    );
  if (f.status === 'error')
    return (
      <div role="alert" className="rounded-xl border border-red-700/50 bg-red-950/60 p-5 text-red-100">
        <p className="font-semibold">We couldn’t send that request.</p>
        <p className="mt-1">Please call <a href={telHref} className="font-semibold text-red-100">{business.phone.display}</a> and we’ll book you in directly.</p>
      </div>
    );
  return null;
}

export function SubmitButton({ f, children = 'Send request' }) {
  return (
    <button type="submit" disabled={f.status === 'sending'} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
      {f.status === 'sending' ? 'Sending…' : children}
    </button>
  );
}
