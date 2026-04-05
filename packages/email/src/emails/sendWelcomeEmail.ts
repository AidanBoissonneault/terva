import { resend } from '../client'

export async function sendWelcomeEmail(to: string) {
  try {
    const result = await resend.emails.send({
      from: 'noreply@tervabrewed.com',
      to,
      subject: 'Welcome to Terva!',
      text: 'Congrats on your first brew tracking experience!',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
    })
    console.log('Email sent:', result)
    return result
  } catch (err) {
    console.error('Failed to send welcome email', err)
    throw err
  }
}
