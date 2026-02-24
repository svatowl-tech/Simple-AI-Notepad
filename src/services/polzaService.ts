export interface PolzaResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
}

export const improveText = async (
  text: string,
  model: string,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  const response = await fetch('https://api.polza.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert text editor. Your task is to improve the given text by fixing grammar, spelling, logic, and structure. Return ONLY the improved text. Do not add conversational filler, explanations, or markdown formatting unless it was present in the original text.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API Error: ${response.status}`);
  }

  const data: PolzaResponse = await response.json();
  return data.choices[0]?.message?.content || '';
};
