import { OpenAI } from 'openai';

let openai: OpenAI | null = null;

export function initAi() {
  openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPEN_ROUTER_API_KEY,
  });
}


export async function askAI(model: string, systemPrompt: string, userPrompt: string): Promise<null | string> {
  if(!openai) throw new Error('openai not initialized');

    try {  
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      })
  
      return response.choices[0].message.content
    }
    catch (error) {
      throw new Error(`Failed to ask ai, error: ${error}`)
    }
}