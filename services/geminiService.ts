
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generate(
    model: string,
    systemInstruction: string,
    userPrompt: string,
    maxOutputTokens: number = 4096,
    temperature: number = 0.5,
    useSearch: boolean = false
  ): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction,
          maxOutputTokens,
          temperature,
          tools: useSearch ? [{ googleSearch: {} }] : undefined,
        },
      });
      return response.text || "No content generated.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async generateWithSearch(
    model: string,
    systemInstruction: string,
    userPrompt: string
  ): Promise<{ text: string; sources: any[] }> {
    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      });
      
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return {
        text: response.text || "No content generated.",
        sources
      };
    } catch (error) {
      console.error("Gemini Search Error:", error);
      throw error;
    }
  }
}
