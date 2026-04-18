// Send Password Reset Email
// used from the server when a user forgets their password.
// CREATED ON: 05APR2026
// LAST EDITED: 17APR2026
// By: Aidan Boissonneault
import { resend } from '../client.js';
export async function sendPasswordResetEmail(email, url) {
    return resend.emails.send({
        from: 'Terva <noreply@tervabrewed.com>',
        to: email,
        subject: 'Reset your Terva password',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Reset your Terva password</title>
  <style>
    :root { color-scheme: light only; }
    body { margin: 0; padding: 0; background-color: #e9e4de !important; }
  </style>
</head>
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

          <!-- Main card -->
          <tr>
            <td style="background-color: #ded6cd; border-radius: 20px; padding: 24px; border: 1px solid #b6aca1;">
              <p style="margin: 0 0 4px; font-size: 20px; font-weight: 600; color: #342c23; line-height: 1.2; letter-spacing: -0.2px;">Reset your password</p>
              <p style="margin: 0 0 20px; font-size: 13px; color: #867867; line-height: 1.6;">We received a request to reset your Terva password. Click below to set a new one.</p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-radius: 999px; background: linear-gradient(135deg, #a36e09 0%, #ca8a10 100%);">
                    <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #a36e09 0%, #ca8a10 100%); color: #ffffff; font-size: 13px; font-weight: 600; text-decoration: none; padding: 11px 24px; border-radius: 999px; letter-spacing: 0.02em;">Reset Password</a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                <tr>
                  <td style="border-top: 1px solid #b6aca1; padding-top: 16px;">
                    <p style="margin: 0; font-size: 12px; color: #867867; line-height: 1.6;">
                      If you didn't request a password reset, you can safely ignore this email. This link expires in 1 hour.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height: 28px; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>

          <!-- Footer -->
          <tr>
            <td style="font-size: 11px; color: #867867; text-align: center; line-height: 1.7;">
              You're receiving this because you requested a password reset at tervabrewed.com<br/>
              <a href="https://tervabrewed.com/unsubscribe" style="color: #a36e09; text-decoration: underline;">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
    });
}
//# sourceMappingURL=sendPasswordResetEmail.js.map