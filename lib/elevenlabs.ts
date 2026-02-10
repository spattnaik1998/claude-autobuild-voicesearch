export interface TTSResult {
  audioUrl: string;
  duration: number;
}

export async function textToSpeech(
  text: string,
  apiKey: string
): Promise<TTSResult> {
  try {
    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `ElevenLabs API error: ${response.statusText} - ${await response.text()}`
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    // Estimate duration (roughly 150 words per minute)
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / 150) * 60;

    return {
      audioUrl: `data:audio/mpeg;base64,${base64Audio}`,
      duration: Math.round(estimatedDuration * 1000), // Convert to milliseconds
    };
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    throw error;
  }
}
