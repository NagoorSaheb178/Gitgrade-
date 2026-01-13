import { AnalysisResult, RepoContext } from "../types";

declare const puter: any;

export const analyzeRepo = async (context: RepoContext): Promise<AnalysisResult> => {
  if (typeof puter === 'undefined') {
    throw new Error("Puter SDK failed to load. Please check your browser's ad-blocker or internet connection.");
  }

  // On Vercel (external domains), Puter might require the user to be signed in for AI features.
  // The 401 error usually happens automatically on script load; we handle it by checking auth status.
  const isSignedIn = await puter.auth.isSignedIn();
  if (!isSignedIn) {
    // We don't force a popup here to avoid blocking the UI, but we'll notify the user if the AI call fails.
    console.warn("User is not signed in to Puter. AI requests may fail on external domains.");
  }

  const prompt = `
    You are GitGrade, an expert senior software engineer. Analyze this GitHub repository and return ONLY a JSON object.
    
    Format:
    {
      "score": number,
      "grade": "Bronze" | "Silver" | "Gold" | "Platinum",
      "summary": "string",
      "roadmap": ["string"],
      "strengths": ["string"],
      "weaknesses": ["string"],
      "breakdown": { "codeQuality": number, "documentation": number, "testing": number, "structure": number, "realWorldUtility": number }
    }

    Repo Name: ${context.metadata.name}
    Language: ${context.metadata.language}
    Structure: ${JSON.stringify(context.fileTree)}
    README: ${context.readmeContent.substring(0, 1000)}
  `;

  try {
    // Attempt the AI chat
    const response = await puter.ai.chat(prompt);
    const resultText = response.toString();
    
    const start = resultText.indexOf('{');
    const end = resultText.lastIndexOf('}');
    
    if (start === -1 || end === -1) {
      throw new Error("AI returned an invalid response format.");
    }
    
    const jsonStr = resultText.substring(start, end + 1);
    return JSON.parse(jsonStr) as AnalysisResult;

  } catch (error: any) {
    console.error("Puter AI Analysis Failed:", error);
    
    // If we get a 401 or similar, suggest signing in
    if (!isSignedIn) {
       throw new Error("Puter AI requires you to be logged in when using a custom domain. Please click the 'Sign in with Puter' prompt if it appears, or refresh the page.");
    }
    
    throw new Error("AI analysis failed. Please try again later.");
  }
};