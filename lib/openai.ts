export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  wordCount: number;
}

export async function summarizeSearchResults(
  results: Array<{ title: string; description: string; url: string }>,
  apiKey: string
): Promise<SummaryResult> {
  try {
    // Prepare context from search results
    const context = results
      .map((r) => `${r.title}: ${r.description}`)
      .join('\n\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that summarizes search results. Provide a concise summary and extract 3-5 key points.',
          },
          {
            role: 'user',
            content: `Please summarize the following search results:\n\n${context}\n\nProvide the response in JSON format with "summary" (string), "keyPoints" (array of strings).`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.statusText} - ${await response.text()}`
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response
    const parsed = JSON.parse(content);

    return {
      summary: parsed.summary || '',
      keyPoints: parsed.keyPoints || [],
      wordCount: parsed.summary?.split(/\s+/).length || 0,
    };
  } catch (error) {
    console.error('OpenAI summarize error:', error);
    throw error;
  }
}
