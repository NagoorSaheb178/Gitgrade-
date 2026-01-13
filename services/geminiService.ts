import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, RepoContext } from "../types";

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "Overall score from 0 to 100" },
    grade: { type: Type.STRING, enum: ["Bronze", "Silver", "Gold", "Platinum"] },
    summary: { type: Type.STRING, description: "A concise 2-3 sentence summary of the repository quality." },
    roadmap: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 4-6 actionable steps to improve the repository." 
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 key strengths."
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 key weaknesses."
    },
    breakdown: {
      type: Type.OBJECT,
      properties: {
        codeQuality: { type: Type.NUMBER, description: "Score 0-100" },
        documentation: { type: Type.NUMBER, description: "Score 0-100" },
        testing: { type: Type.NUMBER, description: "Score 0-100" },
        structure: { type: Type.NUMBER, description: "Score 0-100" },
        realWorldUtility: { type: Type.NUMBER, description: "Score 0-100" },
      },
      required: ["codeQuality", "documentation", "testing", "structure", "realWorldUtility"]
    }
  },
  required: ["score", "grade", "summary", "roadmap", "breakdown", "strengths", "weaknesses"]
};

export const analyzeRepo = async (context: RepoContext): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  // Use JSON.stringify for variable content to prevent prompt injection and ensure valid formatting
  const prompt = `
    You are GitGrade, an expert senior software engineer and code mentor.
    Analyze the following GitHub repository metadata to evaluate its quality, completeness, and professionalism.

    **Repository Info:**
    - Name: ${context.metadata.name}
    - Description: ${context.metadata.description || "No description provided"}
    - Language: ${context.metadata.language}
    - Topics: ${context.metadata.topics.join(', ')}
    - Last Pushed: ${context.metadata.pushedAt}
    
    **Structure (truncated):**
    ${JSON.stringify(context.fileTree)}

    **Dependency / Config File:**
    ${JSON.stringify(context.packageFileContent)}

    **Recent Commit Messages:**
    ${JSON.stringify(context.recentCommitMessages)}

    **README Content (Truncated):**
    ${JSON.stringify(context.readmeContent)}

    **Evaluation Criteria:**
    1. **Code Quality:** Consistency, standard naming conventions (inferred from file names), presence of linting/config.
    2. **Structure:** Logical folder hierarchy, separation of concerns.
    3. **Documentation:** Quality and existence of README, setup instructions, usage examples.
    4. **Testing:** Presence of test files (look for .test.js, _test.py, tests/ folder etc), CI workflows (.github/workflows).
    5. **Real-world Utility:** Does it solve a problem? Is it a complete project or just a snippet?
    6. **Git Practices:** Are commit messages meaningful?

    **Output:**
    Generate a JSON response strictly following the provided schema. 
    - The 'roadmap' should be highly actionable and specific to the detected gaps (e.g., "Add a Dockerfile", "Implement CI with GitHub Actions", "Add unit tests for api/routes").
    - Be honest but constructive.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error: any) {
    console.error("Gemini Analysis Failed:", error);
    // Provide a more helpful error message for common issues
    if (error.message?.includes('429')) {
       throw new Error("Rate limit exceeded. Please try again in a moment.");
    }
    if (error.message?.includes('500') || error.message?.includes('xhr error')) {
       throw new Error("Service temporarily unavailable or repository content is too large. Please try again.");
    }
    throw new Error("Failed to analyze repository. Please try again.");
  }
};