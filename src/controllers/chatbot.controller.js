import OpenAI from 'openai';

export const getChatResponse = async (req, res, next) => {
  try {
    const { message, role } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Initialize SambaNova client
    const client = new OpenAI({
      apiKey: process.env.SAMBANOVA_API_KEY,
      baseURL: "https://api.sambanova.ai/v1"
    });

    const systemPrompt = `You are DevQuest assistant, a helpful guide for a gamified project management platform. User role: ${role || 'User'}.

XP System (Complete Details):
- Quest Givers (Clients): Earn 50 XP for creating each project + 10% bonus XP when any task in their project is completed by developers
- Guild Masters (PMs): Earn 10 XP for creating each task + 20% bonus XP when a developer completes the task they created
- Adventurers (Developers): Earn full task XP when completing tasks (10-1000 XP based on difficulty: Easy=25, Medium=50, Hard=100, Expert=200+)
- Leveling: Every 100 XP = 1 level up (Level 1→2 at 100 XP, Level 2→3 at 200 XP, etc.)

Other Features:
- Projects: Clients create quests with team members, budget, deadlines
- Tasks: PMs create tasks on Quest Board (Kanban), assign to developers, set XP rewards
- Badges: Unlock achievements (First Quest, Task Slayer, Speed Demon, Bug Hunter)
- Leaderboard: Rankings by role (All/Clients/PMs/Developers)
- Team Chat: Real-time chat in each project room

Answer concisely in 2-3 sentences.`;

    const response = await client.chat.completions.create({
      model: "Meta-Llama-3.1-8B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      top_p: 0.9
    });

    const botResponse = response.choices[0].message.content;

    res.json({
      success: true,
      data: {
        response: botResponse
      }
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'AI temporarily unavailable'
    });
  }
};

export const generateProgressSummary = async (req, res, next) => {
  try {
    const { projectData } = req.body;

    if (!projectData) {
      return res.status(400).json({
        success: false,
        message: 'Project data is required'
      });
    }

    const client = new OpenAI({
      apiKey: process.env.SAMBANOVA_API_KEY,
      baseURL: "https://api.sambanova.ai/v1"
    });

    const systemPrompt = `You are a professional project analyst. Generate a concise progress summary for clients viewing their project dashboard. Focus on:
- Overall progress percentage and status
- Team performance highlights
- Completed milestones
- Upcoming deadlines
- Any blockers or concerns

Be professional, positive, and actionable. Keep it to 3-4 sentences maximum.`;

    const userPrompt = `Project: ${projectData.title}
Description: ${projectData.description || 'N/A'}
Total Tasks: ${projectData.totalTasks || 0}
Completed: ${projectData.completedTasks || 0}
In Progress: ${projectData.inProgressTasks || 0}
Team Size: ${projectData.teamSize || 0}
Deadline: ${projectData.deadline || 'Not set'}
Budget: ${projectData.budget || 'Not set'}

Generate a brief, insightful progress summary for the client.`;

    const response = await client.chat.completions.create({
      model: "Meta-Llama-3.1-8B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const summary = response.choices[0].message.content;

    res.json({
      success: true,
      data: { summary }
    });
  } catch (error) {
    console.error('Progress summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate summary'
    });
  }
};

export const generateTaskSuggestion = async (req, res, next) => {
  try {
    const { context, type } = req.body; // type: 'title' or 'description'

    if (!context || !type) {
      return res.status(400).json({
        success: false,
        message: 'Context and type are required'
      });
    }

    const client = new OpenAI({
      apiKey: process.env.SAMBANOVA_API_KEY,
      baseURL: "https://api.sambanova.ai/v1"
    });

    let systemPrompt, userPrompt;

    if (type === 'title') {
      systemPrompt = `You are a task naming expert. Generate clear, action-oriented task titles that are concise (5-8 words) and professional. Use imperative verbs (Build, Create, Implement, Fix, etc.).`;
      userPrompt = `Project: ${context.projectTitle || 'Software project'}
Task context: ${context.userInput || 'New task'}

Generate 3 professional task title suggestions. Return ONLY the titles, one per line, without numbering or bullets.`;
    } else {
      systemPrompt = `You are a task specification expert. Generate clear, detailed task descriptions that include:
- What needs to be done
- Expected outcome
- Key requirements

Keep it professional and actionable (2-3 sentences).`;
      userPrompt = `Task title: ${context.title || 'New task'}
Project: ${context.projectTitle || 'Software project'}
Additional context: ${context.userInput || 'None'}

Generate a clear task description.`;
    }

    const response = await client.chat.completions.create({
      model: "Meta-Llama-3.1-8B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: type === 'title' ? 100 : 150
    });

    const suggestion = response.choices[0].message.content;

    res.json({
      success: true,
      data: {
        suggestion: type === 'title' ? suggestion.split('\n').filter(s => s.trim()) : suggestion
      }
    });
  } catch (error) {
    console.error('Task suggestion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate suggestion'
    });
  }
};
