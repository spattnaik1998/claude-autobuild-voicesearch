export interface SearchResult {
  title: string;
  description: string;
  url: string;
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

    const data = await response.json();

    // Transform Serper results to our format
    return (data.organic || []).map((result: any) => ({
      title: result.title,
      description: result.snippet,
      url: result.link,
    }));
  } catch (error) {
    console.error('Serper search error:', error);
    throw error;
  }
}
