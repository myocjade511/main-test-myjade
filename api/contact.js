module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};

  if (!email) {
    return res.status(400).json({ ok: false, message: 'Email is required' });
  }

  const AGENTMAIL_API_KEY = process.env.AGENTMAIL_API_KEY;
  const INBOX_ID = process.env.CONTACT_INBOX || 'carefulworld700@agentmail.to';

  if (!AGENTMAIL_API_KEY) {
    console.error('AGENTMAIL_API_KEY not set');
    return res.status(500).json({ ok: false, message: 'Server config error' });
  }

  try {
    const response = await fetch('https://api.agentmail.to/v0/inboxes/' + encodeURIComponent(INBOX_ID) + '/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + AGENTMAIL_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: ['getclients4u@gmail.com'],
        subject: 'New contact from main-test-myjade.vercel.app',
        text: `New contact form submission:\n\nName: ${name || 'Not provided'}\nEmail: ${email}\nMessage: ${message || 'No message'}\n\nSubmitted from: main-test-myjade.vercel.app`,
      }),
    });

    const data = await response.text();

    if (!response.ok) {
      console.error('AgentMail error:', data);
      return res.status(500).json({ ok: false, message: 'Failed to send notification' });
    }

    return res.status(200).json({ ok: true, message: 'Thanks! Your message was sent.' });
  } catch (err) {
    console.error('Contact handler error:', err.message);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
};
