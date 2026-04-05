import { resend } from '../client'

export async function sendPasswordResetEmail(email: string, url: string) {
	return resend.emails.send({
		from: 'Terva <auth@yourdomain.com>',
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
	})
}
