// Send Welcome Email
// used from the server to send a welcome email to a new user.
// currently uses a temp HTML page made by Claude, will change later.

// CREATED ON: 05APR2026
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
  <title>Welcome to Terva</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #1e1508;
  font-family: 'Courier New', Courier, monospace;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e1508; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px;">

          <!-- Header / Wordmark -->
          <tr>
            <td style="
              background-color: #2e1f0e;
              border-radius: 16px;
              padding: 24px 32px;
              margin-bottom: 16px;
              border: 1px solid #4a3520;
            ">
              <p style="
                margin: 0;
                font-family: Georgia, 'Times New Roman', serif;
                font-size: 42px;
                font-weight: 400;
                color: #c8943a;
                letter-spacing: -0.5px;
              ">Terva</p>
            </td>
          </tr>

          <tr><td style="height: 12px;"></td></tr>

          <!-- Hero Card - gradient like the Ethiopian card -->
          <tr>
            <td style="
              background: linear-gradient(135deg, #7c6cd4 0%, #a78be0 40%, #6ab4e8 100%);
              border-radius: 16px;
              padding: 28px 28px 24px;
            ">
              <p style="
                margin: 0 0 6px;
                font-family: Georgia, 'Times New Roman', serif;
                font-size: 30px;
                font-weight: 400;
                color: #ffffff;
                line-height: 1.15;
              ">Welcome to Terva.</p>

              <p style="
                margin: 0 0 16px;
                font-family: 'Courier New', Courier, monospace;
                font-size: 13px;
                color: rgba(255,255,255,0.75);
                letter-spacing: 0.02em;
              ">Your brew tracking journey starts now.</p>

              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border-top: 1px solid rgba(255,255,255,0.25); padding-top: 14px; margin-top: 4px;">
                <tr>
                  <td style="
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 12px;
                    color: rgba(255,255,255,0.85);
                    line-height: 1.9;
                  ">
                    Log your beans<br/>
                    Track every brew<br/>
                    Dial in your craft
                  </td>
                </tr>
              </table>

              <table cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                <tr>
                  <td>
                    <a href="https://tervabrewed.com" style="
                      display: inline-block;
                      background-color: #e8d9b8;
                      color: #1e1508;
                      font-family: 'Courier New', Courier, monospace;
                      font-size: 13px;
                      font-weight: 700;
                      text-decoration: none;
                      padding: 10px 22px;
                      border-radius: 999px;
                      letter-spacing: 0.03em;
                    ">⟳ Start Brewing</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height: 12px;"></td></tr>

          <!-- Info row - like the bean meta rows -->
          <tr>
            <td style="
              background-color: #2e1f0e;
              border-radius: 16px;
              padding: 20px 28px;
              border: 1px solid #4a3520;
            ">
              <p style="
                margin: 0 0 4px;
                font-family: 'Courier New', Courier, monospace;
                font-size: 11px;
                color: #a08060;
                text-transform: uppercase;
                letter-spacing: 0.08em;
              ">What's inside</p>
              <p style="
                margin: 0;
                font-family: 'Courier New', Courier, monospace;
                font-size: 13px;
                color: #d4b896;
                line-height: 1.8;
              ">
                Bean library &nbsp;·&nbsp; Brew recipes &nbsp;·&nbsp; Gear tracking<br/>
                Flavour notes &nbsp;·&nbsp; Brew timelines
              </p>
            </td>
          </tr>

          <tr><td style="height: 32px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td style="
              font-family: 'Courier New', Courier, monospace;
              font-size: 11px;
              color: #5a4030;
              text-align: center;
              line-height: 1.7;
            ">
              You're receiving this because you signed up at tervabrewed.com<br/>
              <a href="https://tervabrewed.com/unsubscribe" style="color: #7a5f45; text-decoration: underline;">Unsubscribe</a>
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
