import { GoogleGenAI, Type } from "@google/genai";
import { AiSignal } from '../types';

// Ensure API_KEY is set in your environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });

const model = 'gemini-2.5-flash';

export const getAIInsights = async (mockData: string): Promise<{ insights: string[], riskAlert: string }> => {
  try {
    const prompt = `Based on the following user trading data, generate some insights. User data: ${mockData}. Provide 3 short, actionable trading insights and a single, concise risk alert. Keep the language simple and direct. For example: an insight could be "Your EUR/USD trades show a 73% win rate.", and a risk alert could be "You're approaching 3% daily risk limit. Consider reducing position sizes."`;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Fix: Added responseSchema to ensure structured JSON output as per Gemini API guidelines.
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              description: "An array of 3 short, actionable trading insights.",
              items: {
                type: Type.STRING,
              },
            },
            riskAlert: {
              type: Type.STRING,
              description: "A single, concise risk alert.",
            },
          },
          required: ["insights", "riskAlert"],
        },
      }
    });

    const text = response.text.trim();
    return JSON.parse(text);

  } catch (error) {
    console.error("Error fetching AI insights:", error);
    // Return fallback data in case of an API error
    return {
      insights: ["Your EUR/USD trades show 73% win rate.", "Consider reducing position size on GBP pairs.", "Gold trend looks bullish for next session."],
      riskAlert: "You're approaching 3% daily risk limit. Consider reducing position sizes."
    };
  }
};


export const askAIAssistant = async (question: string): Promise<string> => {
    try {
        const prompt = `You are an expert trading assistant for the Alphalytic platform. A user has a question: "${question}". Provide a concise, helpful, and easy-to-understand answer. Use markdown for formatting if necessary.`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error asking AI assistant:", error);
        return "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
    }
}

export const getSignalInsight = async (signal: AiSignal): Promise<string> => {
  try {
    const prompt = `You are an expert trading analyst providing rationale for AI-generated signals.
A "${signal.signal}" signal was generated for the asset ${signal.fullName} (${signal.pair}) based on a "${signal.strategy}" strategy.
Provide a short, one or two-sentence explanation for why this signal might be valid.
Focus on the strategy itself. The explanation should be clear and concise for a trader.
Example: "A Momentum Breakout strategy suggests a strong buy for Gold because the price has decisively broken above a key resistance level on high volume, indicating strong bullish pressure."`;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text.trim();

  } catch (error) {
    console.error("Error fetching signal insight:", error);
    return "Could not retrieve AI rationale at this time. Please try again later.";
  }
};