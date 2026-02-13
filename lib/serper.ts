export interface SearchResult {
  title: string;
  description: string;
  url: string;
}

interface SerperOrganicResult {
  title: string;
  snippet: string;
  link: string;
  position?: number;
  date?: string;
}

interface SerperResponse {
  organic?: SerperOrganicResult[];
  answerBox?: {
    answer?: string;
    snippet?: string;
  };
  searchParameters?: {
    q: string;
    type: string;
  };
}

export async function searchWithSerper(
  query: string,
  apiKey: string
): Promise<SearchResult[]> {
  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: 10,
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.statusText}`);
    }

    const data: SerperResponse = await response.json();

    // Transform Serper results to our format
    return (data.organic || []).map((result: SerperOrganicResult) => ({
      title: result.title,
      description: result.snippet,
      url: result.link,
    }));
  } catch (error) {
    console.error('Serper search error:', error);
    throw error;
  }
}
