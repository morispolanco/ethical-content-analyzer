
/**
 * Extracts the YouTube video ID from various URL formats.
 * @param url The YouTube URL.
 * @returns The video ID or null if not found.
 */
export const getVideoId = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
        if (urlObj.hostname.includes('youtube.com')) {
            const videoId = urlObj.searchParams.get('v');
if (videoId) {
                return videoId;
            }
        }
    } catch (e) {
        // Fallback for non-URL strings or malformed URLs
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// A database of pre-existing transcripts to demonstrate finding an existing transcript.
const cannedTranscripts: { [key: string]: string } = {
  "m_esT_wowGA": `
    (Scene: A colorful playroom. Steve is playing with blocks. Maggie, a magpie puppet, flies in.)
    Steve: Hello Maggie! What are we doing today?
    Maggie: Let's play hide and seek! You count!
    Steve: Okay! One... two... oops! (Steve trips over a block and falls down gently). Oh, I'm so clumsy.
    Maggie: (Pops up from behind a chair) Tonto Steve! Tonto Steve! You fell down!
    Steve: (Laughing) Oh Maggie, you found me. Yes, silly me. Now it's my turn to find you!
    (Later, in a home video clip submitted by a viewer)
    Parent: (Off-screen) What happened, sweetie?
    Child: (A 4-year-old child points at their father who just dropped his keys)
    Child: Tonto papá! Tonto papá! Just like Maggie says!
    Parent: (Sighs) Oh dear.
    `,
};

/**
 * Checks for a public transcript for a given YouTube URL from a local cache.
 * @param url The URL of the YouTube video.
 * @returns A promise that resolves with the transcript (or null) and video ID.
 */
export const getTranscriptFromUrl = (url: string): Promise<{ transcript: string | null; videoId: string; }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const videoId = getVideoId(url);
      if (!videoId) {
        return reject(new Error("Invalid YouTube URL. Please check the format and try again."));
      }
      const transcript = cannedTranscripts[videoId] || null;
      resolve({ transcript, videoId });
    }, 500); // Simulate network delay
  });
};

/**
 * Simulates a server-side process of downloading and transcribing audio from a YouTube URL.
 * In a real application, this would involve a backend service.
 * @param videoId The ID of the YouTube video.
 * @returns A promise that resolves with a generic, plausible transcript.
 */
export const transcribeAudioFromUrl = (videoId: string): Promise<string> => {
    console.log(`Simulating transcription for video ID: ${videoId}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Return a generic transcript to show the process works for any URL.
            resolve("Hello everyone, and welcome back to the channel. In today's video, we are going to be looking at some interesting new toys. This first one is a bright red car, and it makes a very loud vroom sound. Let's see what happens next. Oh, look, here comes a blue airplane. It can fly very high in the sky. It's important to share our toys and play nicely together. Always be kind to your friends.");
        }, 2000); // Simulate longer delay for transcription
    });
};
