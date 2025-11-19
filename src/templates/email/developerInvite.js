export const developerInviteTemplate = (devName, pmName, projectTitle, projectDescription, techStack, acceptLink) => {
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
        .tech-stack { display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; }
        .tech-tag { background: #E0E7FF; color: #4F46E5; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; }
        .button { display: inline-block; background: #4F46E5; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .adventure-badge { display: inline-block; background: #DBEAFE; color: #1E40AF; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .xp-note { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚔️ Adventure Awaits!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Join an epic quest as a Developer</p>
        </div>
        <div class="content">
          <p>Greetings <strong>${devName}</strong>,</p>
          
          <p><strong>${pmName}</strong> (Guild Master) has invited you to join an exciting project on <strong>DevQuest</strong>!</p>
          
          <div class="project-box">
            <div style="margin-bottom: 10px;">
              <span class="adventure-badge">⚔️ PARTY INVITATION</span>
            </div>
            <h2 style="margin: 10px 0; color: #4F46E5;">${projectTitle}</h2>
            <p style="color: #6b7280; margin: 10px 0;">${projectDescription}</p>
            
            ${techStack && techStack.length > 0 ? `
              <div style="margin-top: 15px;">
                <p style="font-weight: 600; margin-bottom: 8px; color: #374151;">Tech Stack:</p>
                <div class="tech-stack">
                  ${techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="xp-note">
            <strong>💎 Earn XP & Level Up!</strong><br/>
            <span style="color: #92400E;">Complete tasks to earn experience points, unlock badges, and climb the leaderboard!</span>
          </div>

          <p><strong>What you'll do:</strong></p>
          <ul style="color: #4b5563;">
            <li>Work on assigned tasks and challenges</li>
            <li>Move tasks through the Kanban board</li>
            <li>Collaborate with your team members</li>
            <li>Earn XP for every completed task</li>
            <li>Level up and unlock achievements</li>
          </ul>

          <div style="text-align: center;">
            <a href="${acceptLink}" style="display: inline-block; background-color: #4F46E5; color: #ffffff !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold;">Join the Party & Start Quest</a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            This invitation will expire in 7 days. Your adventure awaits!
          </p>
        </div>
        <div class="footer">
          <p>DevQuest - Where Code Becomes Adventure</p>
          <p style="font-size: 12px; color: #9ca3af;">
            You received this email because ${pmName} invited you to join their project team.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
