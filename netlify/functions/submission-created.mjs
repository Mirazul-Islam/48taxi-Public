// Runs automatically after every verified Netlify Forms submission (event-triggered function).
// Optional: sends the submission by email through Resend (https://resend.com).
// Env vars (Netlify → Site configuration → Environment variables):
//   RESEND_API_KEY    – Resend API key (required to send anything)
//   NOTIFY_EMAIL      – where requests go, e.g. info@48taxi.co (comma-separate several)
//   FROM_EMAIL        – a sender on a domain verified in Resend, e.g. "48Taxi & Limo <bookings@48taxi.co>"
//   SEND_CONFIRMATION – "true" to also email the customer a copy
// Without these, submissions are still stored in Netlify (Forms tab), and Netlify's own
// email notifications can be switched on in the dashboard.

const LABELS = {
  'park-fly': 'Park & Fly request',
  booking: 'Booking request',
  'truck-parking-quote': 'Truck parking quote',
  'truck-parking-agreement': 'Signed truck parking agreement',
  lockout: 'Lockout / battery request',
  contact: 'Contact message',
  affiliate: 'Affiliate application',
};

async function send({ to, subject, text, replyTo }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL,
      to: to.split(',').map((s) => s.trim()),
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) console.error('Resend error', res.status, await res.text());
}

export const handler = async (event) => {
  const { RESEND_API_KEY, NOTIFY_EMAIL, FROM_EMAIL, SEND_CONFIRMATION } = process.env;
  if (!RESEND_API_KEY || !NOTIFY_EMAIL || !FROM_EMAIL) {
    return { statusCode: 200, body: 'Email not configured; submission kept in Netlify Forms.' };
  }
  let payload;
  try {
    payload = JSON.parse(event.body).payload;
  } catch {
    return { statusCode: 400, body: 'Bad payload' };
  }
  const form = payload.form_name;
  const data = payload.data || {};
  const skip = new Set(['ip', 'user_agent', 'referrer', 'bot-field', 'form-name']);
  const lines = Object.entries(data)
    .filter(([k, v]) => !skip.has(k) && v !== '' && v != null)
    .map(([k, v]) => `${k}: ${v}`);
  const who = data.name || data.clientName || [data.firstName, data.lastName].filter(Boolean).join(' ') || data.company || 'Website visitor';
  const label = LABELS[form] || form;

  await send({ to: NOTIFY_EMAIL, subject: `${label}: ${who}${data.pickupDate ? ` · ${data.pickupDate}` : ''}`, text: lines.join('\n'), replyTo: data.email });

  if (SEND_CONFIRMATION === 'true' && data.email) {
    await send({
      to: data.email,
      subject: `We received your ${label.toLowerCase()} – 48Taxi & Limo`,
      text: `Hi ${who},\n\nThanks for contacting 48Taxi & Limo. We received your ${label.toLowerCase()} and will confirm shortly. Nothing has been charged.\n\nNeed us sooner? Call (902) 789-7777, 24/7.\n\nYour details:\n${lines.join('\n')}\n\n48Taxi & Limo · https://48taxi.co`,
    });
  }
  return { statusCode: 200, body: 'ok' };
};
