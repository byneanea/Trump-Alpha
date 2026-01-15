import { GoogleGenAI, Type } from "@google/genai";
import { TradeSignal, TimeHorizon } from "../types";

// Using the new Gemini SDK format
// The API key is assumed to be in process.env.API_KEY
// Note: In a real production app, this call should ideally happen backend-side to protect the key,
// or the user should input their key (as implemented in the UI).

export const analyzeIntelWithGemini = async (
  text: string, 
  apiKey: string
): Promise<Partial<TradeSignal> | null> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are the "Trump Alpha" Engine, a specialized financial algorithm designed to convert Donald Trump's political rhetoric into actionable trading signals.
    
    Analyze the provided text based on this logic matrix:
    1. "MAGA" / "Made in USA" -> Bullish for Industrial/Steel (X, CAT).
    2. "Tariff" / "China" -> Bearish for Importers (Walmart), Bullish for Domestic.
    3. "Drill Baby Drill" / Energy -> Bullish for Oil/Gas (HAL, XOM), Bearish for Green Energy.
    4. "Border" / "Security" -> Bullish for Private Prisons (GEO) & Defense.
    5. "DOGE" / "Efficiency" -> Bullish for Crypto (DOGE, BTC) & Tesla.
    6. "Fake News" -> Bullish for DJT (Trump Media).

    Return a JSON object describing the trade signal.
    Horizon logic: "Tariff/Drill" usually Mid-Term. "Fake News/DOGE" usually Short-Term. "MAGA/Defense" usually Long-Term.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-latest",
      contents: `Analyze this statement: "${text}"`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ticker: { type: Type.STRING, description: "Stock Ticker symbol, e.g. DJT" },
            name: { type: Type.STRING, description: "Company Name" },
            sector: { type: Type.STRING, description: "Sector" },
            horizon: { type: Type.STRING, enum: ["SHORT_TERM", "MID_TERM", "LONG_TERM"] },
            action: { type: Type.STRING, enum: ["BUY", "SELL", "HOLD"] },
            probability: { type: Type.INTEGER, description: "Confidence score 0-100" },
            reasoning: { type: Type.STRING, description: "Short explanation of the logic" },
            catalystKeyword: { type: Type.STRING, description: "The trigger keyword found" }
          },
          required: ["ticker", "action", "probability", "reasoning", "horizon"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data as Partial<TradeSignal>;
    }
    return null;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};