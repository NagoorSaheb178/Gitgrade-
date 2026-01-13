import { AnalysisResult, RepoContext } from "../types";

// Since Puter is loaded via script tag, we declare it globally
declare const puter: any;

export const analyzeRepo = async (context: RepoContext): Promise<AnalysisResult> => {
  // Check if Puter is available
  if (typeof puter === 'undefined') {
    throw new Error("Puter SDK not loaded. Please check your internet connection.");
  }

  const prompt = `
    You are GitGrade, an expert senior software engineer and code mentor.
    Analyze the following GitHub repository metadata to evaluate its quality.
    
    IMPORTANT: You MUST respond ONLY with a valid JSON object. No conversational text before or after the JSON.

    **Expected JSON Format:**
    {
      "score": number (0-100),
      "grade": "Bronze" | "Silver" | "Gold" | "Platinum",
      "summary": "2-3 sentence summary",
      "roadmap": ["step 1", "step 2", ...],
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
      "breakdown": {
        "codeQuality": number,
        "documentation": number,
        "testing": number,
        "structure": number,
        "realWorldUtility": number
      }
    }

    **Repository Info:**
    - Name: ${context.metadata.name}
    - Description: ${context.metadata.description || "No description"}
    - Language: ${context.metadata.language}
    - Topics: ${context.metadata.topics.join(', ')}
    
    **Structure:**
    ${JSON.stringify(context.fileTree)}

    **Recent Commits:**
    ${JSON.stringify(context.recentCommitMessages)}

    **README Preview:**
    ${context.readmeContent.substring(0, 1000)}

    Perform a deep analysis and return only the JSON.
  `;

  try {
    // Use Puter.js AI chat
    const response = await puter.ai.chat(prompt);
    
    // Puter responses can be objects or strings depending on version/context
    const resultText = response.toString();
    
    // Extract JSON in case the AI added markdown backticks or filler text
    const start = resultText.indexOf('{');
    const end = resultText.lastIndexOf('}');
    
    if (start === -1 || end === -1) {
      throw new Error("AI did not return a valid JSON format.");
    }
    
    const jsonStr = resultText.substring(start, end + 1);
    const result = JSON.parse(jsonStr) as AnalysisResult;

    // Basic validation of the result structure
    if (typeof result.score !== 'number' || !result.grade) {
        throw new Error("AI returned an incomplete analysis result.");
    }

    return result;

  } catch (error: any) {
    console.error("Puter AI Analysis Failed:", error);
    throw new Error("Failed to analyze repository with Puter AI. " + error.message);
  }
};