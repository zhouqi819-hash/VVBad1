import { GoogleGenAI } from "@google/genai";
import { SystemStats, RobotState, RobotSettings } from "../types";

const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateAIResponse = async (
  prompt: string, 
  context: { stats: SystemStats; state: RobotState; settings: RobotSettings }
): Promise<string> => {
  if (!ai) {
    return "API Key 未配置。请检查您的环境变量设置。";
  }

  const systemContext = `
    你是 "蓝视智寻" (Blue Vision) 智能鞋物整理机器人的 AI 中枢助手。
    你的设定是：专业、高效、具有未来感的智能系统。请用中文回答所有问题。
    
    当前遥测数据 (Telemetry):
    - 状态: ${context.state}
    - 电池电量: ${context.stats.batteryLevel}%
    - 内部温度: ${context.stats.temperature}°C
    - 今日整理数量: ${context.stats.dailyShoesOrganized}
    - 存储容量已用: ${context.stats.storageCapacity}%
    - 移动速度设定: ${context.settings.movementSpeed}%
    
    你可以回答关于机器人状态、维护建议的问题，或者解释系统如何工作（例如 YOLOv8 视觉识别, 麦克纳姆轮驱动等）。
    保持回答简练，适合作为仪表盘的命令接口回复。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemContext,
      }
    });
    return response.text || "未收到回复。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "与 AI 核心通信时发生错误。";
  }
};