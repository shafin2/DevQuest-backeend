export default (name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to DevQuest</title>
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
              <h2 style="margin: 0 0 16px; color: #111827; font-size: 28px; font-weight: 600; text-align: center;">Welcome to DevQuest! 🎉</h2>
              <p style="margin: 0 0 24px; color: #4B5563; font-size: 16px; line-height: 1.6; text-align: center;">
                Hi <strong>${name}</strong>, your account has been successfully verified!
              </p>
              <div style="margin: 32px 0; padding: 24px; background-color: #F0FDF4; border-radius: 8px; border-left: 4px solid #4CAF50;">
                <p style="margin: 0 0 12px; color: #166534; font-size: 15px; font-weight: 600;">
                  ✓ Your account is now active
                </p>
                <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.6;">
                  You can now access all features of DevQuest and start collaborating on amazing projects.
                </p>
              </div>
              <p style="margin: 24px 0 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                Our platform connects clients with talented developers and project managers to bring ideas to life.
              </p>
              <p style="margin: 24px 0 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                If you have any questions or need assistance, our support team is always here to help.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 8px; color: #6B7280; font-size: 14px; line-height: 1.5; text-align: center;">
                Need help getting started?
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 13px; line-height: 1.5; text-align: center;">
                Contact us at <a href="mailto:support@devquest.com" style="color: #4F46E5; text-decoration: none;">support@devquest.com</a>
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
