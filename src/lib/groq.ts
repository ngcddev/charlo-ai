import Groq from 'groq-sdk'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function generateResponse(
  systemPrompt: string,
  userMessage: string,
  history: Message[]
): Promise<string> {
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    max_tokens: 512,
    temperature: 0.7,
  })

  const text = completion.choices[0]?.message?.content
  if (!text) throw new Error('Empty response from Groq')
  return text
}
