
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuestions = async (subject: 'math' | 'chinese'): Promise<any[]> => {
  const prompt = subject === 'math' 
    ? "針對國小一年級程度，生成 20 道趣味數學題（包含20以內的加減法，或簡單圖形邏輯）。" 
    : "針對國小一年級程度，生成 20 道國語測驗題。測驗形式為：在題目中給出一個注音符號（如『ㄅㄚ』），要求小朋友從選項中選出對應的國字（如『八』）。";

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        type: { type: Type.STRING, description: "multiple-choice" },
        text: { type: Type.STRING },
        options: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING } 
        },
        answer: { type: Type.STRING },
        hint: { type: Type.STRING },
        visualAid: { type: Type.STRING, description: "一個代表題目的核心內容或正確答案意義的 emoji" }
      },
      required: ["id", "type", "text", "options", "answer", "visualAid"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: `你是一位親切、充滿耐心的一年級小導師。
題目要簡單易懂，並使用可愛的描述。請嚴格生成剛好 20 題。

【視覺化規則】：
你必須為每一道題目挑選一個非常相關且生動的 emoji 作為 『visualAid』。
特別是國語測驗：此 emoji 必須與正確答案的『意義』高度相關（例如答案是「大[ㄉㄚˋ]」，emoji 可以是 🐘；答案是「火[ㄏㄨㄛˇ]」，emoji 可以是 🔥），幫助小朋友透過圖像聯想國字。

【重要標註規則】：
1. 題目敘述中的所有中文詞彙必須使用『國字[注音]』的格式標註，例如：『選[ㄒㄩㄢˇ] 出[ㄔㄨ]』。
2. 測驗的核心注音符號請用雙引號標注。

【國語科目特別規則】：
1. 國語測驗核心為「看注音選正確國字」。
2. 選項（options）內的國字不可以帶有注音標註。`
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
};

export const getAIFeedback = async (score: number, total: number, subject: string): Promise<string> => {
  const prompt = `學生在${subject}測驗中得到了 ${score}/${total} 分。請以親切、溫暖、充滿鼓勵的方式寫一段話給這位一年級小朋友。`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "你扮演一位溫柔的學伴。說話要可愛、正向，使用很多星星或愛心等表情符號。請使用『國字[注音]』格式標註所有國字。"
      }
    });
    return response.text || "太[ㄊㄞˋ] 棒[ㄅㄤˋ] 了[ㄌㄜ˙]！ 你[ㄋㄧˇ] 真[ㄓㄣ] 的[ㄉㄜ˙] 很[ㄏㄣˇ] 努力[ㄋㄨˇ ㄌㄧˋ] 喔[ㄛ]！";
  } catch (error) {
    return "太[ㄊㄞˋ] 棒[ㄅㄤˋ] 了[ㄌㄜ˙]！ 繼[ㄐㄧˋ] 續[ㄒㄩˋ] 加[ㄐㄧㄚ] 油[ㄧㄡˊ] 喔[ㄛ]！✨";
  }
};
