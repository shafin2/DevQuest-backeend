export default (url, name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - DevQuest</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F0F4F8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F0F4F8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">DevQuest</h1>
              <p style="margin: 8px 0 0; color: #E0E7FF; font-size: 14px;">Build Amazing Projects Together</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="margin: 0 0 16px; color: #111827; font-size: 26px; font-weight: 600;">Hi ${name}! 👋</h2>
              <p style="margin: 0 0 24px; color: #4B5563; font-size: 16px; line-height: 1.6;">
                Welcome to DevQuest! We're excited to have you join our project collaboration platform.
              </p>
              <p style="margin: 0 0 32px; color: #4B5563; font-size: 16px; line-height: 1.6;">
                To get started, please verify your email address by clicking the button below:
              </p>
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #4F46E5;">
                    <a href="${url}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; letter-spacing: 0.3px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 32px 0 0; color: #6B7280; font-size: 14px; line-height: 1.5;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0; color: #4F46E5; font-size: 13px; word-break: break-all;">
                ${url}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 8px; color: #9CA3AF; font-size: 13px; line-height: 1.5;">
                ⏱️ This verification link will expire in <strong>24 hours</strong>.
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 13px; line-height: 1.5;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px; text-align: center; background-color: #111827;">
              <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                © ${new Date().getFullYear()} DevQuest. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
