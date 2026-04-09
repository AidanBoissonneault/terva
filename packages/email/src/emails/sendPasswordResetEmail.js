// Send Password Reset Email
// used from the server when a user forgets their email.
// currently uses a temp HTML page made by Claude, will change later.
// CREATED ON: 05APR2026
// By: Aidan Boissonneault
import { resend } from '../client.js';
export async function sendPasswordResetEmail(email, url) {
    return resend.emails.send({
        from: 'Terva <noreply@tervabrewed.com>',
        to: email,
        subject: 'Reset your password',
        html: `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h2>Reset your password</h2>
        <p>Click below to reset your password:</p>
        <a href="${url}"
           style="
             display: inline-block;
             padding: 10px 16px;
             background: #000;
             color: #fff;
             text-decoration: none;
             border-radius: 6px;
           ">
          Reset Password
        </a>
        <p>If you didn’t request this, you can ignore this email.</p>
      </div>
    `,
    });
}
