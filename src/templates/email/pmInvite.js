export const pmInviteTemplate = (pmName, clientName, projectTitle, projectDescription, acceptLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .project-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5; }
        .button { display: inline-block; background: #4F46E5; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .quest-badge { display: inline-block; background: #FEF3C7; color: #92400E; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 New Quest Available!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">You've been invited to lead a project</p>
        </div>
        <div class="content">
          <p>Hello <strong>${pmName}</strong>,</p>
          
          <p><strong>${clientName}</strong> has invited you to manage their project on <strong>DevQuest</strong>!</p>
          
          <div class="project-box">
            <div style="margin-bottom: 10px;">
              <span class="quest-badge">🏆 QUEST INVITATION</span>
            </div>
            <h2 style="margin: 10px 0; color: #4F46E5;">${projectTitle}</h2>
            <p style="color: #6b7280; margin: 10px 0;">${projectDescription}</p>
          </div>

          <p><strong>As Project Manager, you will:</strong></p>
          <ul style="color: #4b5563;">
            <li>Build and lead your development team</li>
            <li>Create and assign tasks to developers</li>
            <li>Track project progress on the Kanban board</li>
            <li>Earn XP and level up as Guild Master</li>
          </ul>

          <div style="text-align: center;">
            <a href="${acceptLink}" style="display: inline-block; background-color: #4F46E5; color: #ffffff !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold;">Accept Quest & View Project</a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            This invitation will expire in 7 days. Don't let this quest slip away!
          </p>
        </div>
        <div class="footer">
          <p>DevQuest - Where Projects Become Adventures</p>
          <p style="font-size: 12px; color: #9ca3af;">
            You received this email because ${clientName} invited you to manage their project.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
