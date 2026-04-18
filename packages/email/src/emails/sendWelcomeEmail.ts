// Send Welcome Email
// used from the server to send a welcome email to a new user.

// CREATED ON: 05APR2026
// LAST EDITED: 17APR2026
// By: Aidan Boissonneault

import { resend } from '../client.js'

export async function sendWelcomeEmail(to: string) {
	try {
		const result = await resend.emails.send({
			from: 'Terva <noreply@tervabrewed.com>',
			to,
			subject: 'Welcome to Terva!',
			text: 'Congrats on your first brew tracking experience with Terva!',
			html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Welcome to Terva</title>
  <style>
    :root { color-scheme: light only; }
    body { margin: 0; padding: 0; background-color: #e9e4de !important; }
  </style>
</head>
<!--
  Force light mode across all clients. email clients that respect
  prefers-color-scheme will see the light palette; clients that apply
  dark mode automatically are overridden by color-scheme: light only.
  All colour values are hex fallbacks from colors.css compiled output.

  Token reference (light):
    neutral-100: #e9e4de   neutral-200: #ded6cd   neutral-300: #b6aca1
    neutral-500: #867867   neutral-700: #4b4034   neutral-800: #342c23
    brand-400:   #e7b369   brand-500:   #da9e3f   brand-600:   #ca8a10
    brand-700:   #a36e09   brand-900:   #442e09
-->
<body style="margin: 0; padding: 0; background-color: #e9e4de; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e9e4de; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 480px;">

          <!-- Wordmark card -->
          <tr>
            <td style="background-color: #ded6cd; border-radius: 20px; padding: 20px 24px; border: 1px solid #b6aca1;">
              <p style="margin: 0; font-size: 36px; font-weight: 600; color: #442e09; letter-spacing: -0.5px; line-height: 1;">Terva</p>
            </td>
          </tr>

          <tr><td style="height: 12px; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>

          <!-- Hero card — brand gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #a36e09 0%, #ca8a10 45%, #e7b369 100%); border-radius: 20px; padding: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; font-size: 26px; font-weight: 600; color: #ffffff; line-height: 1.2; letter-spacing: -0.3px;">Welcome to Terva.</p>
                    <p style="margin: 0 0 18px; font-size: 13px; color: rgba(255,255,255,0.8); letter-spacing: 0.01em;">Your brew tracking journey starts now.</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 14px;">
                          <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.9); line-height: 2;">
                            Log your beans<br/>
                            Track every brew<br/>
                            Dial in your craft
                          </p>
                        </td>
                      </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                      <tr>
                        <td style="border-radius: 999px; background-color: #ded6cd;">
                          <a href="https://tervabrewed.com" style="display: inline-block; background-color: #ded6cd; color: #442e09; font-size: 13px; font-weight: 600; text-decoration: none; padding: 10px 22px; border-radius: 999px; letter-spacing: 0.02em;">Start Brewing</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height: 12px; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>

          <!-- Feature meta card -->
          <tr>
            <td style="background-color: #ded6cd; border-radius: 20px; padding: 18px 24px; border: 1px solid #b6aca1;">
              <p style="margin: 0 0 6px; font-size: 11px; color: #867867; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500;">What's inside</p>
              <p style="margin: 0; font-size: 13px; color: #4b4034; line-height: 1.9;">
                Bean library &nbsp;&middot;&nbsp; Brew recipes &nbsp;&middot;&nbsp; Gear tracking<br/>
                Flavour notes &nbsp;&middot;&nbsp; Brew timelines
              </p>
            </td>
          </tr>

          <tr><td style="height: 28px; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>

          <!-- Footer -->
          <tr>
            <td style="font-size: 11px; color: #867867; text-align: center; line-height: 1.7;">
              You're receiving this because you signed up at tervabrewed.com<br/>
              <a href="https://tervabrewed.com/unsubscribe" style="color: #a36e09; text-decoration: underline;">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
		})
		console.log('Email sent:', result)
		return result
	} catch (err) {
		console.error('Failed to send welcome email', err)
		throw err
	}
}
